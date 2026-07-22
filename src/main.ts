import { LitElement, html, nothing, PropertyValues, TemplateResult } from 'lit'
import { state, property } from 'lit/decorators.js'
import { mdiMinus, mdiPlus } from '@mdi/js'
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
  THERMOMETER: 'mdi:thermometer',
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

  // Press-and-hold repeat for the setpoint +/- buttons: after an initial delay
  // the step repeats until release. Separate from the _holdTimer above (which
  // detects tap/hold/double-tap on the temperature display).
  _repeatTimer: ReturnType<typeof setTimeout> | null = null
  _repeatInterval: ReturnType<typeof setInterval> | null = null
  _repeatFired = false
  static REPEAT_DELAY_MS = 500
  static REPEAT_INTERVAL_MS = 300

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
    this._endRepeat()
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
      const controlObj = this.config.control as Record<string, any>
      const rawEntries = Object.entries(controlObj)
      if (rawEntries.length > 0) {
        // hvac (the primary heat/cool/off bar) is always rendered FIRST, unless
        // explicitly hidden (`control.hvac: false` or `_hidden: true`). It's
        // force-included when an object `control` omits it (mirrors the editor),
        // and hoisted to the top even when it's listed later — otherwise editing
        // a mode label (which appends `control.hvac`) would push the main bar to
        // the bottom.
        const hvacDef = 'hvac' in controlObj
          ? controlObj.hvac
          : (supportedModeType('hvac') ? {} : undefined)
        const others = rawEntries.filter(([type]) => type !== 'hvac')
        const entries = (hvacDef !== undefined
          ? [['hvac', hvacDef], ...others]
          : others) as [string, any][]
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
          ${config.hide_setpoint === true
          ? nothing
          : html`<div class="setpoint">
          ${this._useDial(_values)
          ? Object.keys(_values).length === 2
            ? this._renderDualDial(_values, minTemp, maxTemp, unit, entity)
            : Object.entries(_values).map(([field, value]) =>
                this._renderDial(field, value, minTemp, maxTemp, unit, entity)
              )
          : Object.entries(_values).map(([field, value]) => {
          const isOff = entity.state === HVAC_MODES.OFF
          const hasValue = !isOff && ['string', 'number'].includes(typeof value)
          const numericValue = typeof value === 'number' ? value : Number(value)
          const showUnit = unit !== false && hasValue
          // Full number inline ("24,5") with the unit as a small superscript —
          // the classic temperature look. (The dial keeps the stacked ha-big-
          // number style separately.)
          const formattedValue = formatNumber(value, { ...config, locale: this._hass?.locale })
          return html`
              <div class="current-wrapper ${stepLayout}">
                <ha-icon-button
                  ?disabled=${(value === null && minTemp === null) || (value !== null && maxTemp !== null && numericValue >= maxTemp)}
                  class="thermostat-trigger thermostat-trigger--up"
                  aria-label="Increase ${field}"
                  .label=${`Increase ${field}`}
                  @click=${() => this._tapStep(() => this._stepSetpoint(field, 1, minTemp, maxTemp))}
                  @pointerdown=${() => this._beginRepeat(() => this._stepSetpoint(field, 1, minTemp, maxTemp))}
                  @pointerup=${this._endRepeat}
                  @pointercancel=${this._endRepeat}
                  @pointerleave=${this._endRepeat}
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
                  aria-label=${isOff
              ? `${field}: ${this._dialActionLabel(entity)}`
              : `${field}: ${formatNumber(value, { ...config, locale: this._hass?.locale })}${showUnit ? ` ${unit}` : ''}`}
                  class=${_updatingValues
              ? 'current--value updating'
              : 'current--value'}
                >
                  ${isOff
              ? this._dialActionLabel(entity)
              : html`${formattedValue}${showUnit
                  ? html`<span class="current--unit">${unit}</span>`
                  : nothing}`}
                </h3>
                <ha-icon-button
                  ?disabled=${value === null || (minTemp !== null && numericValue <= minTemp)}
                  class="thermostat-trigger thermostat-trigger--down"
                  aria-label="Decrease ${field}"
                  .label=${`Decrease ${field}`}
                  @click=${() => this._tapStep(() => this._stepSetpoint(field, -1, minTemp, maxTemp))}
                  @pointerdown=${() => this._beginRepeat(() => this._stepSetpoint(field, -1, minTemp, maxTemp))}
                  @pointerup=${this._endRepeat}
                  @pointercancel=${this._endRepeat}
                  @pointerleave=${this._endRepeat}
                >
                  <ha-icon .icon=${row ? ICONS.MINUS : ICONS.DOWN}></ha-icon>
                </ha-icon-button>
              </div>
            `
        })}
          </div>`}
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

  // Live preview while dragging the dial ring: the slider emits `value-changing`
  // continuously during a drag (and `value-changed` only on release). Reflect the
  // in-progress value in the center display so the user sees the target they are
  // dialling in; the actual service call still waits for `value-changed`.
  _onDialChanging = (field: string, value: number) => {
    if (value == null || Number.isNaN(value)) return
    const { decimals } = this.config
    this._values = {
      ...this._values,
      [field]: +formatNumber(value, { decimals }),
    }
  }

  // One setpoint step in `dir` (+1/-1), clamped to the entity's min/max. Returns
  // false when it can't step further (already at a bound, or an uninitialised
  // value that was just seeded) so the hold-repeat loop knows to stop.
  _stepSetpoint(
    field: string,
    dir: 1 | -1,
    minTemp: number | null,
    maxTemp: number | null
  ): boolean {
    const raw = this._values[field]
    if (raw === null || raw === undefined) {
      // Uninitialised: the up button seeds it at the low bound once; down is a no-op.
      if (dir > 0 && minTemp !== null) this.setTemperature(0, field, minTemp)
      return false
    }
    const v = Number(raw)
    if (dir > 0 && maxTemp !== null && v >= maxTemp) return false
    if (dir < 0 && minTemp !== null && v <= minTemp) return false
    this.setTemperature(dir * this.stepSize, field)
    return true
  }

  // Press-and-hold on a +/- button: after REPEAT_DELAY_MS the `step` repeats
  // every REPEAT_INTERVAL_MS until release, stopping early if `step` reports it
  // can't advance (returns false). @pointerup/leave/cancel calls _endRepeat.
  _beginRepeat = (step: () => boolean) => {
    this._repeatFired = false
    this._endRepeat()
    this._repeatTimer = setTimeout(() => {
      this._repeatFired = true
      if (step() === false) {
        this._endRepeat()
        return
      }
      this._repeatInterval = setInterval(() => {
        if (step() === false) this._endRepeat()
      }, SimpleThermostat.REPEAT_INTERVAL_MS)
    }, SimpleThermostat.REPEAT_DELAY_MS)
  }

  _endRepeat = () => {
    if (this._repeatTimer) {
      clearTimeout(this._repeatTimer)
      this._repeatTimer = null
    }
    if (this._repeatInterval) {
      clearInterval(this._repeatInterval)
      this._repeatInterval = null
    }
  }

  // The click that follows a pointer release (and the keyboard-activation path):
  // skip it if a hold already stepped, otherwise do the single tap step.
  _tapStep = (step: () => boolean) => {
    if (this._repeatFired) {
      this._repeatFired = false
      return
    }
    step()
  }

  // Render the setpoint as the native HA circular dial only when explicitly
  // requested and the element is actually registered (older HA cores lack it).
  // Supports a single setpoint (one handle) and dual heat_cool (two handles);
  // a missing element gracefully falls back to the number display.
  _useDial(values: Record<string, unknown>): boolean {
    const count = Object.keys(values).length
    return (
      this.config?.setpoint_style === 'dial' &&
      (count === 1 || count === 2) &&
      !!customElements.get('ha-control-circular-slider')
    )
  }

  // Custom name for the entity's current hvac mode (control.hvac.<state>.name),
  // so a mode renamed in the editor's Mode labels also shows in the dial center.
  _modeNameOverride(entity: any): string | undefined {
    const control = this.config?.control as any
    if (!control || typeof control !== 'object' || Array.isArray(control)) return undefined
    const modeObj = control.hvac?.[entity?.state]
    return modeObj && typeof modeObj === 'object' && typeof modeObj.name === 'string'
      ? modeObj.name
      : undefined
  }

  // The dial's center action label, in priority order: an explicit
  // `dial_action_labels` override (per hvac_action, then per state), then the
  // custom mode name from Mode labels, then Home Assistant's own translated
  // action / state text.
  _dialActionLabel(entity: any): string {
    const action = entity?.attributes?.hvac_action
    const overrides = this.config?.dial_action_labels
    if (action && overrides?.[action]) return overrides[action]
    if (overrides?.[entity?.state]) return overrides[entity.state]
    // `idle` means the mode is selected but nothing is running — showing the
    // mode name ("Kühlen") there would be misleading, so surface the real live
    // action instead. For every other case (actively heating/cooling, or no
    // action at all) the custom mode name is what the user wants to see.
    if (action === 'idle') {
      return this._hass?.formatEntityAttributeValue?.(entity, 'hvac_action', 'idle') ?? action
    }
    const modeName = this._modeNameOverride(entity)
    if (modeName) return modeName
    return action
      ? this._hass?.formatEntityAttributeValue?.(entity, 'hvac_action', action) ?? action
      : this._hass?.formatEntityState?.(entity) ?? entity?.state
  }

  // Color the dial ring by the current HVAC mode, reusing the same mode color
  // variables the mode buttons use (--heat-color, --cool-color, …). Returns a
  // CSS color reference or '' for modes without a distinct color (off/unknown),
  // where the ring keeps its neutral default. The center number stays neutral.
  _ringColor(entity: any): string {
    const modes: Record<string, string> = {
      heat: 'heat',
      cool: 'cool',
      auto: 'auto',
      heat_cool: 'heat_cool',
      dry: 'dry',
      fan_only: 'fan_only',
    }
    const key = modes[entity?.state]
    return key ? `var(--${key}-color)` : ''
  }

  _renderDial(
    field: string,
    value: any,
    minTemp: number | null,
    maxTemp: number | null,
    unit: string | boolean,
    entity: any
  ) {
    const isOff = entity.state === HVAC_MODES.OFF
    // When off there is no meaningful setpoint — mirror the native card and show
    // the localized state ("Off"/"Aus") in place of the target temperature
    // (honouring a custom mode name / dial_action_labels override).
    const offLabel = this._dialActionLabel(entity)
    const numericValue = typeof value === 'number' ? value : Number(value)
    const adapter = getAdapter(this.config.entity)
    const current = Number(adapter.getCurrentValue(entity.attributes ?? {}))
    // Hide the current-value line when it equals the setpoint (e.g. a fan, whose
    // "current" is just the percentage) — otherwise it duplicates the big number.
    const hasCurrent = Number.isFinite(current) && current !== numericValue
    const currentIcon = adapter.getCurrentValueIcon()
    const unitStr = typeof unit === 'string' ? unit : ''
    const showUnit = unit !== false && value != null
    const locale = this._hass?.locale
    const actionLabel = this._dialActionLabel(entity)
    // Split the target into a big integer part and a small fractional part so
    // the decimals sit under the unit (like HA's ha-big-number).
    const formatted =
      value == null
        ? this.config.fallback ?? '—'
        : formatNumber(value, { ...this.config, locale })
    const fracMatch = /^(-?\d+)([.,]\d+)$/.exec(formatted)
    const intPart = fracMatch ? fracMatch[1] : formatted
    const fracPart = fracMatch ? `${fracMatch[2]}` : ''
    const ringColor = isOff ? '' : this._ringColor(entity)
    return html`
      <div class="current-wrapper dial">
        <ha-control-circular-slider
          style=${ringColor ? `--control-circular-slider-color: ${ringColor}` : nothing}
          .value=${isOff || value == null ? undefined : numericValue}
          .current=${hasCurrent ? current : undefined}
          .min=${minTemp ?? 0}
          .max=${maxTemp ?? 100}
          .step=${this.stepSize}
          ?disabled=${isOff || value == null}
          mode="full"
          .label=${field}
          @value-changing=${(e: any) =>
            this._onDialChanging(field, e.detail.value)}
          @value-changed=${(e: any) =>
            this.setTemperature(0, field, e.detail.value)}
        ></ha-control-circular-slider>

        <div
          class="dial-info"
          @pointerdown=${this._onActionPointerDown}
          @pointerup=${this._onActionPointerUp}
          @pointercancel=${this._onActionPointerUp}
          @click=${this._onActionClick}
          role="button"
          tabindex="0"
          aria-label=${isOff
            ? `${field}: ${offLabel}`
            : `${field}: ${formatNumber(value, { ...this.config, locale })}${showUnit ? ` ${unitStr}` : ''}`}
        >
          ${isOff
            ? nothing
            : html`<span class="dial-action">${actionLabel}</span>`}
          ${isOff
            ? html`<span class="dial-target dial-off">${offLabel}</span>`
            : html`<span class=${this._updatingValues ? 'dial-target updating' : 'dial-target'}>
                <span class="dial-int">${intPart}</span
                >${showUnit || fracPart
                  ? html`<span class="dial-fu"
                      >${showUnit
                        ? html`<span class="current--unit">${unitStr}</span>`
                        : nothing}${fracPart
                        ? html`<span class="dial-frac">${fracPart}</span>`
                        : nothing}</span
                    >`
                  : nothing}
              </span>`}
          ${hasCurrent
            ? html`<span class="dial-current"
                ><ha-icon .icon=${currentIcon}></ha-icon
                >${formatNumber(current, { ...this.config, locale })}${unitStr
                  ? ` ${unitStr}`
                  : ''}</span
              >`
            : nothing}
        </div>

        <div class="dial-buttons">
          <ha-outlined-icon-button
            class="thermostat-trigger"
            ?disabled=${isOff || value == null || (minTemp !== null && numericValue <= minTemp)}
            aria-label="Decrease ${field}"
            .label=${`Decrease ${field}`}
            @click=${() => this._tapStep(() => this._stepSetpoint(field, -1, minTemp, maxTemp))}
            @pointerdown=${() => this._beginRepeat(() => this._stepSetpoint(field, -1, minTemp, maxTemp))}
            @pointerup=${this._endRepeat}
            @pointercancel=${this._endRepeat}
            @pointerleave=${this._endRepeat}
          >
            <ha-svg-icon .path=${mdiMinus}></ha-svg-icon>
          </ha-outlined-icon-button>
          <ha-outlined-icon-button
            class="thermostat-trigger"
            ?disabled=${isOff ||
            (value === null && minTemp === null) ||
            (value !== null && maxTemp !== null && numericValue >= maxTemp)}
            aria-label="Increase ${field}"
            .label=${`Increase ${field}`}
            @click=${() => this._tapStep(() => this._stepSetpoint(field, 1, minTemp, maxTemp))}
            @pointerdown=${() => this._beginRepeat(() => this._stepSetpoint(field, 1, minTemp, maxTemp))}
            @pointerup=${this._endRepeat}
            @pointercancel=${this._endRepeat}
            @pointerleave=${this._endRepeat}
          >
            <ha-svg-icon .path=${mdiPlus}></ha-svg-icon>
          </ha-outlined-icon-button>
        </div>
      </div>
    `
  }

  // Dual (heat_cool) variant: one ring with two draggable handles for the low
  // and high targets. The native slider reports each handle via its own
  // low-/high- events; dragging live-updates the matching value and commits on
  // release. Center shows both targets; +/- buttons are omitted to keep the two
  // numbers legible inside the ring (the handles are the control).
  _renderDualDial(
    values: Record<string, any>,
    minTemp: number | null,
    maxTemp: number | null,
    unit: string | boolean,
    entity: any
  ) {
    const lowField = 'target_temp_low'
    const highField = 'target_temp_high'
    const isOff = entity.state === HVAC_MODES.OFF
    const offLabel = this._dialActionLabel(entity)
    const low = Number(values[lowField])
    const high = Number(values[highField])
    const adapter = getAdapter(this.config.entity)
    const current = Number(adapter.getCurrentValue(entity.attributes ?? {}))
    const hasCurrent = Number.isFinite(current)
    const currentIcon = adapter.getCurrentValueIcon()
    const unitStr = typeof unit === 'string' ? unit : ''
    const showUnit = unit !== false
    const locale = this._hass?.locale
    const actionLabel = this._dialActionLabel(entity)
    const fmt = (v: number) => formatNumber(v, { ...this.config, locale })
    const target = (v: number, extra: string) => html`<span class="dial-dual-${extra}"
      >${fmt(v)}${showUnit
        ? html`<span class="dial-dual-unit">${unitStr}</span>`
        : nothing}</span
    >`
    return html`
      <div class="current-wrapper dial dual">
        <ha-control-circular-slider
          style=${isOff
            ? nothing
            : '--control-circular-slider-low-color: var(--heat-color); --control-circular-slider-high-color: var(--cool-color)'}
          dual
          .low=${isOff ? undefined : low}
          .high=${isOff ? undefined : high}
          .current=${hasCurrent ? current : undefined}
          .min=${minTemp ?? 0}
          .max=${maxTemp ?? 100}
          .step=${this.stepSize}
          ?disabled=${isOff}
          mode="full"
          @low-changing=${(e: any) => this._onDialChanging(lowField, e.detail.value)}
          @low-changed=${(e: any) => this.setTemperature(0, lowField, e.detail.value)}
          @high-changing=${(e: any) => this._onDialChanging(highField, e.detail.value)}
          @high-changed=${(e: any) => this.setTemperature(0, highField, e.detail.value)}
        ></ha-control-circular-slider>

        <div
          class="dial-info"
          @pointerdown=${this._onActionPointerDown}
          @pointerup=${this._onActionPointerUp}
          @pointercancel=${this._onActionPointerUp}
          @click=${this._onActionClick}
          role="button"
          tabindex="0"
          aria-label=${isOff
            ? offLabel
            : `${fmt(low)} – ${fmt(high)}${showUnit ? ` ${unitStr}` : ''}`}
        >
          ${isOff
            ? html`<span class="dial-target dial-off">${offLabel}</span>`
            : html`
                <span class="dial-action">${actionLabel}</span>
                <span class=${this._updatingValues ? 'dial-dual-targets updating' : 'dial-dual-targets'}>
                  ${target(low, 'low')}<span class="dial-dual-sep">–</span>${target(high, 'high')}
                </span>`}
          ${hasCurrent
            ? html`<span class="dial-current"
                ><ha-icon .icon=${currentIcon}></ha-icon
                >${fmt(current)}${unitStr ? ` ${unitStr}` : ''}</span
              >`
            : nothing}
        </div>
      </div>
    `
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
    // Fan/humidifier setpoints are a percentage; only climate follows the HA
    // temperature system unit (°C/°F).
    const adapterUnit = getAdapter(this.config.entity).getSetpointUnit()
    if (adapterUnit !== undefined) {
      return adapterUnit
    }
    return this._hass.config?.unit_system?.temperature ?? false
  }
}
