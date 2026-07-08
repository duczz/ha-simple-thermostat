import { LitElement, html, nothing, PropertyValues, TemplateResult } from 'lit'
import { state, property } from 'lit/decorators.js'
import debounce from 'debounce-fn'
import { name as CARD_NAME } from '../package.json'

import isEqual from './isEqual'
import styles from './styles.css'

import formatNumber from './formatNumber'
import fireEvent from './fireEvent'
import renderHeader from './components/header'
import renderTemplated, { wrapSensors } from './components/templated'
import renderSensors from './components/sensors'
import renderModeType from './components/modeType'
import renderBanners from './components/banners'

import parseHeader, { HeaderData, MODE_ICONS } from './config/header'
import parseSetpoints from './config/setpoints'
import parseService, { Service } from './config/service'
import { getAdapter } from './adapters'
import { sortModes } from './config/sort'
import { getTrackedEntities } from './config/trackedEntities'

import { CardConfig, ModeValue, ModeControlObject, MODES, TapAction } from './config/card'

import {
  ControlMode,
  ControlModeOption,
  LooseObject,
  Sensor,
  PreparedSensor,
  HASS,
  HVAC_MODES,
} from './types'

interface HANode extends Element {
  hass: any
}

const DEBOUNCE_TIMEOUT = 500
const STEP_SIZE = 0.5
const DECIMALS = 1
const UPDATING_TIMEOUT = 10000

const ICONS = {
  UP: 'hass:chevron-up',
  DOWN: 'hass:chevron-down',
  PLUS: 'mdi:plus',
  MINUS: 'mdi:minus',
}

const DEFAULT_HIDE = {
  temperature: false,
  state: false,
}

function shouldShowModeControl(
  modeOption: string,
  config: Partial<ModeControlObject>
) {
  if (typeof config[modeOption] === 'object') {
    const obj = config[modeOption] as ModeValue
    return obj.include !== false
  }

  return config?.[modeOption] ?? true
}

function getModeList(
  type: string,
  attributes: LooseObject,
  specification: Partial<ModeControlObject> = {},
  modeAttribute: string = `${type}_modes`
) {
  let modeOptions = attributes[modeAttribute]
  if (type === 'oscillating') {
    modeOptions = ['false', 'true']
  } else if (type === 'direction') {
    modeOptions = ['forward', 'reverse']
  }

  // Handle boolean attributes (e.g. fan oscillating)
  if (typeof modeOptions === 'boolean') {
    modeOptions = ['false', 'true']
  }
  if (!Array.isArray(modeOptions)) {
    return []
  }
  return modeOptions
    .filter((modeOption) => shouldShowModeControl(modeOption, specification))
    .map((modeOption) => {
      const modeKey = String(modeOption)
      const values =
        typeof specification[modeKey] === 'object'
          ? specification[modeKey]
          : ({} as {})
      return {
        icon: MODE_ICONS[modeKey] ?? MODE_ICONS[modeKey.toLowerCase()],
        value: modeKey,
        // No default `name` here on purpose: leaving it undefined lets
        // modeType.ts localize the label via hass.formatEntityState /
        // formatEntityAttributeValue. Setting `name: modeKey` would shadow that
        // (maybeRenderName returns early on any non-undefined name) and render
        // the raw state key (e.g. "heat") instead of the localized label.
        ...values,
      }
    })
}


interface Values {
  [key: string]: number | string
}

export default class SimpleThermostat extends LitElement {
  static get styles() {
    return styles
  }

  @state()
  config!: CardConfig
  @state()
  header!: false | HeaderData
  @state()
  service!: Service
  @state()
  modes: Array<ControlMode> = []
  _hass: HASS = {}
  @state()
  entity: LooseObject | undefined
  @state()
  sensors: Array<Sensor | PreparedSensor> = []
  @state()
  showSensors: boolean = true
  stepSize = STEP_SIZE
  @state()
  _values: Values = {}
  @state()
  _updatingValues: boolean = false
  @state()
  _hide = DEFAULT_HIDE

  _updatingValuesTimeout: ReturnType<typeof setTimeout> | null = null
  _needsRecompute = true
  _trackedStateRefs: Record<string, any> = {}
  _entityGraceTimer: ReturnType<typeof setTimeout> | null = null
  static ENTITY_GRACE_MS = 5000

  // Action-handler state: detects tap vs hold vs double-tap on primary
  // interaction targets (the temperature display / header)
  _holdTimer: ReturnType<typeof setTimeout> | null = null
  _holdFired = false
  _clickCount = 0
  _clickTimer: ReturnType<typeof setTimeout> | null = null
  static HOLD_MS = 500
  static DOUBLE_TAP_MS = 250

  // Tracks whether a debounced setTemperature call is still waiting to fire.
  // `debounce-fn` only exposes `.cancel()`, not `.flush()` — we track this
  // ourselves so disconnectedCallback can send the pending value immediately
  // instead of silently dropping it (see _performCleanup).
  _pendingSetTemperature = false

  _sendSetTemperature(values: object) {
    const { domain, service, data = {} } = this.service
    this._callAction(`${domain}.${service}`, {
      entity_id: this.config.entity,
      ...data,
      ...values,
    })
  }

  _debouncedSetTemperature = debounce(
    (values: object) => {
      this._pendingSetTemperature = false
      this._sendSetTemperature(values)
    },
    {
      wait: DEBOUNCE_TIMEOUT,
    }
  )

  _callAction(action: string, data: object) {
    if (typeof this._hass.performAction === 'function') {
      this._hass.performAction({ action, data })
    } else {
      const [domain, service] = action.split('.')
      this._hass.callService(domain, service, data)
    }
  }

  static getConfigElement() {
    return window.document.createElement(`${CARD_NAME}-editor`)
  }

  static getStubConfig(hass: any) {
    const entity = Object.keys(hass.states).find(
      (id) =>
        id.startsWith('climate.') ||
        id.startsWith('fan.') ||
        id.startsWith('humidifier.')
    )
    return { entity: entity ?? '' }
  }

  setConfig(config: CardConfig) {
    if (!config?.entity) {
      throw new Error('simple-thermostat: entity is required')
    }
    this.config = {
      decimals: DECIMALS,
      ...config,
    }
    this.service = parseService(this.config.service ?? false, getAdapter(this.config.entity))
    this._needsRecompute = true

    if (this._hass?.states) {
      this.updateFromHass(this._hass)
    }
  }

  private _disconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private readonly DISCONNECT_GRACE_MS = 300;

  connectedCallback() {
    super.connectedCallback()
    if (this._disconnectTimer) {
      clearTimeout(this._disconnectTimer)
      this._disconnectTimer = null
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._disconnectTimer = setTimeout(() => {
      this._performCleanup()
    }, this.DISCONNECT_GRACE_MS)
  }

  private _performCleanup() {
    if (this.isConnected) return
    
    if (this._updatingValuesTimeout) {
      clearTimeout(this._updatingValuesTimeout)
      this._updatingValuesTimeout = null
    }
    if (this._holdTimer) {
      clearTimeout(this._holdTimer)
      this._holdTimer = null
    }
    if (this._clickTimer) {
      clearTimeout(this._clickTimer)
      this._clickTimer = null
    }
    if (this._entityGraceTimer) {
      clearTimeout(this._entityGraceTimer)
      this._entityGraceTimer = null
    }
    // Flush instead of drop: if the user changed the setpoint and navigated
    // away before the 500ms debounce fired, send it now rather than losing
    // the change silently.
    if (this._pendingSetTemperature) {
      this._pendingSetTemperature = false
      this._sendSetTemperature(this._values)
    }
    this._debouncedSetTemperature?.cancel?.()
  }

  updated(changedProperties: PropertyValues) {
    super.updated(changedProperties)
    const patchHass: Array<HANode> = Array.from(
      this.renderRoot.querySelectorAll('[with-hass]')
    )
    for (const child of Array.from(patchHass)) {
      // Forward attributes to properties
      Array.from(child.attributes).forEach((attr) => {
        if (attr.name.startsWith('fwd-')) {
          child[attr.name.replace('fwd-', '')] = attr.value
        }
      })
      // Always forward hass
      child.hass = this._hass
    }
  }

  set hass(hass: any) {
    this._hass = hass

    if (!hass?.states) {
      return
    }

    this.updateFromHass(hass)
  }

  updateFromHass(hass: any) {
    if (!this.config?.entity) {
      return
    }

    const entity = hass.states[this.config.entity]

    if (!entity) {
      // Grace period: keep the last known state visible for a few seconds so
      // integration reloads / short disconnects don't flash "Entity not
      // available". A truly missing entity (never seen) errors immediately.
      if (this.entity !== undefined && this._entityGraceTimer === null) {
        this._entityGraceTimer = setTimeout(() => {
          this._entityGraceTimer = null
          this.entity = undefined
        }, SimpleThermostat.ENTITY_GRACE_MS)
      }
      return
    }
    if (this._entityGraceTimer !== null) {
      clearTimeout(this._entityGraceTimer)
      this._entityGraceTimer = null
    }

    // Short-circuit: skip full recompute when neither the main entity nor
    // any of the tracked entities changed since the last update.
    const trackedIds = getTrackedEntities(this.config)
    let hasChanges = this._needsRecompute

    for (const id of trackedIds) {
      const newState = hass.states[id]
      if (this._trackedStateRefs[id] !== newState) {
        hasChanges = true
        this._trackedStateRefs[id] = newState
      }
    }

    if (!hasChanges) {
      return
    }
    this._needsRecompute = false
    this.entity = entity

    this.header = parseHeader(
      this.config.header === false ? false : (this.config.header ?? {}),
      entity,
      hass
    )

    // HA can transiently deliver states without an attributes object
    const attributes = entity.attributes ?? {}
    const adapter = getAdapter(this.config.entity)

    let values = parseSetpoints(this.config.setpoints, attributes, adapter)

    // If we are updating the values, and they are now equal
    // we can safely assume we've been able to update the set points
    // in HA and remove the updating flag
    // If we are not updating we take the values we get from HA
    // because it means they changed elsewhere
    if (this._updatingValues && isEqual(values, this._values)) {
      this._updatingValues = false
      if (this._updatingValuesTimeout) {
        clearTimeout(this._updatingValuesTimeout)
        this._updatingValuesTimeout = null
      }
    } else if (!this._updatingValues) {
      this._values = values
    }

    const defaultControl = adapter.getDefaultControl()

    const getOverrideConfig = (type: string) => {
      const modeConfig = (this.config.control as LooseObject)?.[type]
      return modeConfig && typeof modeConfig === 'object' && typeof modeConfig.entity === 'string'
        ? modeConfig
        : undefined
    }

    const supportedModeType = (type: string) => {
      if (getOverrideConfig(type)) return true
      return attributes[adapter.getModeAttribute(type)] !== undefined
    }

    const getModeListImpl = (
      type: string,
      attributes: LooseObject,
      specification: Partial<ModeControlObject> = {},
      modeAttribute: string = `${type}_modes`
    ) => {
      const overrideConfig = getOverrideConfig(type)
      if (overrideConfig) {
        const overrideEntity = hass.states[overrideConfig.entity]
        if (!overrideEntity || overrideEntity.state === 'unavailable' || overrideEntity.state === 'unknown') return []

        let modeOptions: string[] = []
        const [domain] = overrideEntity.entity_id.split('.')

        if (domain === 'select' || domain === 'input_select') {
          const options = overrideEntity.attributes?.options
          modeOptions = Array.isArray(options) ? options.map(String) : []
        } else if (domain === 'switch' || domain === 'input_boolean') {
          modeOptions = ['off', 'on']
        }

        if (!Array.isArray(modeOptions) || modeOptions.length === 0) return []

        return modeOptions
          .filter((modeOption) => shouldShowModeControl(modeOption, specification))
          .map((modeOption) => {
            const modeKey = String(modeOption)
            const values = typeof specification[modeKey] === 'object' ? specification[modeKey] : {}
            return {
              icon: MODE_ICONS[modeKey] ?? MODE_ICONS[modeKey.toLowerCase()],
              value: modeKey,
              name: modeKey,
              ...values,
            } as ControlModeOption
          })
      }
      return getModeList(type, attributes, specification, modeAttribute)
    }

    const buildBasicModes = (items: any) => {
      return items.filter(supportedModeType).map((type: string) => ({
        type,
        hide_when_off: false,
        list: getModeListImpl(type, attributes, {}, adapter.getModeAttribute(type)),
      }))
    }

    let controlModes: Array<Partial<ControlMode>> = []
    if (this.config.control === false) {
      controlModes = []
    } else if (Array.isArray(this.config.control)) {
      controlModes = buildBasicModes(this.config.control)
    } else if (typeof this.config.control === 'object') {
      const entries = Object.entries(this.config.control)
      if (entries.length > 0) {
        controlModes = entries
          .filter(([type, definition]: [string, any]) => supportedModeType(type) && definition !== false && definition?._hidden !== true)
          .map(([type, definition]: [string, ModeControlObject]) => {
            const { _name, _hide_when_off, _hidden, ...controlField } = definition
            return {
              type,
              hide_when_off: _hide_when_off,
              name: _name,
              list: getModeListImpl(type, attributes, controlField, adapter.getModeAttribute(type)),
            }
          })
      } else {
        controlModes = buildBasicModes(defaultControl)
      }
    } else {
      controlModes = buildBasicModes(defaultControl)
    }

    // Decorate mode types with active value and set to this.modes
    this.modes = controlModes.map((values) => {
      const list = sortModes(values.type!, values.list ?? [])
      if (values.type === MODES.HVAC) {
        return {
          ...values,
          list,
          mode: entity.state,
        } as ControlMode
      }

      const overrideConfig = getOverrideConfig(values.type!)
      let mode: any
      if (overrideConfig) {
        const overrideEntity = hass.states[overrideConfig.entity]
        mode = overrideEntity ? overrideEntity.state : 'none'
      } else {
        mode = attributes[adapter.getModePayloadKey(values.type!)]
      }

      return {
        ...values,
        list,
        mode: mode != null ? String(mode) : 'none',
      } as ControlMode
    })

    if (this.config.step_size) {
      this.stepSize = +this.config.step_size
    } else {
      const adapterStep = adapter.getRange(attributes).step
      this.stepSize = adapterStep != null ? +adapterStep : STEP_SIZE
    }

    this._hide = { ...DEFAULT_HIDE, ...this.config.hide }

    // `sensors` wins over the `entities` alias when both are present — the
    // visual editor writes `sensors`, so its changes must take effect even
    // if a legacy `entities` key is still in the YAML.
    const configSensors = this.config.sensors ?? this.config.entities

    this.showSensors = !(configSensors === false || this.config.sensors === false || this.config.entities === false)

    if (!this.showSensors) {
      this.sensors = []
    } else if (this.config.version === 3) {
      this.sensors = []
      const sensorsList = Array.isArray(configSensors) ? configSensors : []
      const mainEntityId = this.config.entity!
      const customSensors = sensorsList.map((sensor, index) => {
        const entityId = sensor?.entity ?? mainEntityId
        let context: LooseObject | undefined = entity
        if (sensor?.entity) {
          context = this._hass.states?.[sensor.entity]
        }
        return {
          id: sensor?.id ?? String(index),
          label: sensor?.label ?? sensor?.name,
          icon: sensor?.icon,
          template: sensor?.template ?? '',
          show: sensor?.show !== false,
          display_as: sensor?.display_as,
          entityId,
          context,
        } as PreparedSensor
      })
      const ids = customSensors.map((s) => s.id)
      const builtins: Array<PreparedSensor> = []
      if (!ids.includes('state')) {
        builtins.push({
          id: 'state',
          label: '{{ui.operation}}',
          template: '{{state.text}}',
          entityId: mainEntityId,
          context: entity,
          show: true,
        })
      }
      if (!ids.includes('temperature')) {
        const tempEntityId =
          this.config.current_value_entity ??
          this.config.current_temperature_entity ??
          mainEntityId
        const useExternalTemp =
          tempEntityId !== mainEntityId && hass.states[tempEntityId]
        builtins.push({
          id: 'temperature',
          label: '{{ui.currently}}',
          template: useExternalTemp
            ? '{{state.raw|formatNumber}}'
            : adapter.getCurrentValueTemplate(),
          entityId: tempEntityId,
          context: useExternalTemp ? hass.states[tempEntityId] : entity,
          show: true,
        })
      }
      this.sensors = [...builtins, ...customSensors]
    } else if (configSensors) {
      this.sensors = configSensors.map(
        ({ name, entity: sensorEntity, attribute, unit, ...rest }) => {
          let state
          const names = [name]
          if (sensorEntity) {
            state = hass.states[sensorEntity]
            names.push(state?.attributes?.friendly_name)
            if (attribute) {
              state = state?.attributes?.[attribute]
            }
          } else {
            const attrs = this.entity?.attributes ?? {}
            if (attribute && attribute in attrs) {
              state = attrs[attribute]
              names.push(attribute)
            }
          }
          names.push(sensorEntity)

          return {
            ...rest,
            name: names.find((n) => !!n),
            state,
            entity: sensorEntity,
            unit,
          } as Sensor
        }
      )
    } else {
      // No sensors configured (anymore) — drop previously computed ones so
      // removing the last sensor in the editor takes effect immediately.
      this.sensors = []
    }
  }

  localize = (label: string, prefix = '') => {
    const key = `${prefix}${label}`
    return this._hass.localize(key) || label
  }

  render() {
    // LitElement performs one render pass right after connectedCallback
    // regardless of property changes, so this can run before `setConfig`
    // has ever been called (e.g. `hass` assigned first in some editor
    // preview / dashboard re-render orderings). Guard before touching
    // `this.config` at all.
    if (!this.config) {
      return html`<ha-card class="loading"></ha-card>`
    }

    const { _hide, _values, _updatingValues, config, entity } = this
    const warnings: Array<TemplateResult> = []
    if (this.stepSize < 1 && this.config.decimals === 0) {
      warnings.push(html`
        <ha-alert alert-type="warning">
          Decimals is set to 0 and step_size is lower than 1. Decrementing a
          setpoint will likely not work. Change one of the settings to clear
          this warning.
        </ha-alert>
      `)
    }

    if (!entity) {
      // Distinguish "still loading" (hass not yet received) from
      // "entity truly missing" so users don't see a spurious error
      // during initial mount.
      if (!this._hass?.states) {
        return html`<ha-card class="loading"></ha-card>`
      }
      return html`
        <ha-alert alert-type="error">
          Entity not available: ${config.entity}
        </ha-alert>
      `
    }

    const action = entity.attributes?.hvac_action

    const renderAdapter = getAdapter(this.config.entity)
    const { min: minTemp, max: maxTemp } = renderAdapter.getRange(entity.attributes)

    const unit = this.getUnit()

    const stepLayout = this.config?.layout?.step ?? 'row'
    const row = stepLayout === 'row'

    const isUnavailable = ['unavailable', 'unknown'].includes(entity.state)
    // Sanitize entity-derived class values: only allow safe identifier chars
    const safeClass = (v: unknown) =>
      typeof v === 'string' ? v.replace(/[^a-z0-9_-]/gi, '') : ''
    const classes = [
      !this.header && 'no-header',
      safeClass(action),
      isUnavailable && safeClass(entity.state),
    ].filter((cx) => !!cx)

    let sensorsHtml
    if (this.config.version === 3) {
      sensorsHtml = this.sensors
        .filter((spec: PreparedSensor) => spec.show !== false)
        .map((spec: PreparedSensor) => {
          return renderTemplated({
            ...spec,
            variables: this.config.variables,
            hass: this._hass,
            config: this.config,
            localize: this.localize,
            openEntityPopover: this.openEntityPopover,
          })
        })
      sensorsHtml = wrapSensors(this.config, sensorsHtml)
    } else {
      sensorsHtml = this.showSensors
        ? renderSensors({
          _hide,
          unit,
          hass: this._hass,
          entity: entity,
          sensors: this.sensors,
          config: this.config,
          localize: this.localize,
          openEntityPopover: this.openEntityPopover,
        })
        : ''
    }
    return html`
      <ha-card class="${classes.join(' ')}">
        ${this.config.styles
        ? html`<style>
              ${this.config.styles}
            </style>`
        : nothing}
        ${warnings}
        ${renderHeader({
          header: this.header,
          toggleEntityChanged: this.toggleEntityChanged,
          entity: entity,
          openEntityPopover: this.openEntityPopover,
        })}
        ${renderBanners({ config: this.config, hass: this._hass, entity: entity })}
        <section class="body">
          ${sensorsHtml}
          <div class="divider"></div>
          ${config.hide_setpoint === true ? nothing : Object.entries(_values).map(([field, value]) => {
          const isOff = entity.state === HVAC_MODES.OFF
          const hasValue = !isOff && ['string', 'number'].includes(typeof value)
          const numericValue = typeof value === 'number' ? value : Number(value)
          const showUnit = unit !== false && hasValue
          return html`
              <div class="current-wrapper ${stepLayout}">
                <ha-icon-button
                  ?disabled=${(value === null && minTemp === null) || (value !== null && maxTemp !== null && numericValue >= maxTemp)}
                  class="thermostat-trigger thermostat-trigger--up"
                  aria-label="Increase ${field}"
                  .label=${`Increase ${field}`}
                  @click="${() => value === null ? this.setTemperature(0, field, minTemp!) : this.setTemperature(this.stepSize, field)}"
                >
                  <ha-icon .icon=${row ? ICONS.PLUS : ICONS.UP}></ha-icon>
                </ha-icon-button>

                <h3
                  @pointerdown=${this._onActionPointerDown}
                  @pointerup=${this._onActionPointerUp}
                  @pointercancel=${this._onActionPointerUp}
                  @click=${this._onActionClick}
                  @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                this._dispatchAction('tap')
              }
            }}
                  role="button"
                  tabindex="0"
                  aria-label=${`${field}: ${formatNumber(value, { ...config, locale: this._hass?.locale })}${showUnit ? ` ${unit}` : ''
            }`}
                  class=${_updatingValues
              ? 'current--value updating'
              : 'current--value'}
                >
                  ${isOff ? 'OFF' : formatNumber(value, {
                ...config,
                locale: this._hass?.locale,
              })}
                  ${showUnit
              ? html`<span class="current--unit">${unit}</span>`
              : nothing}
                </h3>
                <ha-icon-button
                  ?disabled=${value === null || (minTemp !== null && numericValue <= minTemp)}
                  class="thermostat-trigger thermostat-trigger--down"
                  aria-label="Decrease ${field}"
                  .label=${`Decrease ${field}`}
                  @click="${() => this.setTemperature(-this.stepSize, field)}"
                >
                  <ha-icon .icon=${row ? ICONS.MINUS : ICONS.DOWN}></ha-icon>
                </ha-icon-button>
              </div>
            `
        })}
        </section>

        ${this.modes.map((mode) =>
          renderModeType({
            state: entity.state,
            entity,
            hass: this._hass,
            mode,
            localize: this.localize,
            modeOptions: this.config?.layout?.mode ?? {},
            setMode: this.setMode,
          })
        )}
      </ha-card>
    `
  }

  toggleEntityChanged = (ev: Event) => {
    if (!this.header || !this.header.toggle) return

    const el = ev.target as HTMLInputElement
    this._callAction(
      el.checked ? 'homeassistant.turn_on' : 'homeassistant.turn_off',
      { entity_id: this.header.toggle.entity?.entity_id }
    )
  }

  setTemperature(change: number, field: string, baseValue?: number) {
    this._updatingValues = true
    if (this._updatingValuesTimeout) clearTimeout(this._updatingValuesTimeout)
    this._updatingValuesTimeout = setTimeout(() => {
      this._updatingValues = false
      this._updatingValuesTimeout = null
    }, UPDATING_TIMEOUT)
    const previousValue = baseValue ?? this._values[field]
    const newValue = Number(previousValue) + change
    const { decimals } = this.config

    this._values = {
      ...this._values,
      [field]: +formatNumber(newValue, { decimals }),
    }
    this._pendingSetTemperature = true
    this._debouncedSetTemperature(this._values)
  }

  setMode = (type: string, mode: string) => {
    if (type && mode) {
      const modeConfig = (this.config.control as LooseObject)?.[type]
      const overrideEntityId = modeConfig?.entity as string | undefined

      if (overrideEntityId && this._hass?.states?.[overrideEntityId]) {
        const domain = overrideEntityId.split('.')[0]
        if (domain === 'select' || domain === 'input_select') {
          this._callAction(`${domain}.select_option`, { entity_id: overrideEntityId, option: mode })
        } else if (domain === 'switch' || domain === 'input_boolean') {
          this._callAction(`homeassistant.turn_${mode === 'on' ? 'on' : 'off'}`, { entity_id: overrideEntityId })
        }
      } else {
        const adapter = getAdapter(this.config.entity)
        const payloadValue = adapter.transformModePayloadValue
          ? adapter.transformModePayloadValue(type, mode)
          : mode
        this._callAction(adapter.getModeService(type), {
          entity_id: this.config.entity,
          [adapter.getModePayloadKey(type)]: payloadValue,
        })
      }
      fireEvent(this, 'haptic', 'light')
    } else {
      fireEvent(this, 'haptic', 'failure')
    }
  }

  openEntityPopover = (entityId = null) => {
    fireEvent(this, 'hass-more-info', {
      entityId: entityId || this.config.entity,
    })
  }

  _onActionPointerDown = (e: PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return
    this._holdFired = false
    if (this._holdTimer) clearTimeout(this._holdTimer)
    this._holdTimer = setTimeout(() => {
      this._holdFired = true
      this._holdTimer = null
      this._dispatchAction('hold')
    }, SimpleThermostat.HOLD_MS)
  }

  _onActionPointerUp = () => {
    if (this._holdTimer) {
      clearTimeout(this._holdTimer)
      this._holdTimer = null
    }
  }

  _onActionClick = (e: MouseEvent) => {
    e.preventDefault()
    if (this._holdFired) {
      this._holdFired = false
      return
    }
    this._clickCount += 1
    if (this._clickCount === 1) {
      if (this._clickTimer) clearTimeout(this._clickTimer)
      this._clickTimer = setTimeout(() => {
        this._clickCount = 0
        this._clickTimer = null
        this._dispatchAction('tap')
      }, SimpleThermostat.DOUBLE_TAP_MS)
    } else {
      if (this._clickTimer) clearTimeout(this._clickTimer)
      this._clickTimer = null
      this._clickCount = 0
      this._dispatchAction('double_tap')
    }
  }

  _dispatchAction(kind: 'tap' | 'hold' | 'double_tap') {
    const key = kind === 'tap' ? 'tap_action' : kind === 'hold' ? 'hold_action' : 'double_tap_action'
    const action = this.config?.[key] ?? (kind === 'tap' ? { action: 'more-info' } : { action: 'none' })
    this._runAction(action as TapAction)
  }

  _runAction(action: TapAction) {
    switch (action.action) {
      case 'none':
        return
      case 'more-info':
        fireEvent(this, 'hass-more-info', { entityId: this.config.entity })
        return
      case 'navigate':
        history.pushState(null, '', action.navigation_path)
        fireEvent(window, 'location-changed', { replace: false })
        return
      case 'url':
        window.open(action.url_path, '_blank', 'noopener')
        return
      case 'toggle':
        this._callAction('homeassistant.toggle', {
          entity_id: this.config.entity,
        })
        return
      case 'call-service':
        this._callAction(action.service, action.service_data ?? {})
        return
    }
  }

  getCardSize() {
    let size = 2 // temperature display + sensors row
    if (this.config?.header !== false) size += 1
    if (this.config?.control !== false) size += 1
    return size
  }

  getUnit(): string | boolean {
    if (this.config.unit !== undefined) {
      return this.config.unit
    }
    return this._hass.config?.unit_system?.temperature ?? false
  }
}
