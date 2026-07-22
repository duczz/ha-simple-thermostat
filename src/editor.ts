import { LitElement, html, nothing } from 'lit'
import { state, property } from 'lit/decorators.js'
import { mdiBookOpenVariant, mdiPageLayoutHeader, mdiTune, mdiPalette, mdiGestureTap, mdiDelete, mdiPlus, mdiCheck, mdiCodeBraces, mdiThermometer, mdiArrowAll, mdiChevronDown, mdiChevronUp, mdiInformationOutline, mdiTagTextOutline, mdiArrowUp, mdiArrowDown } from '@mdi/js'

import styles from './styles.css'
import fireEvent from './fireEvent'
import { version } from '../package.json'
import { CardConfig } from './config/card'
import { HASS } from './types'
import { getAdapter, EntityAdapter } from './adapters'
import { isObject } from './utils'
import { mergeBannerFormData } from './config/bannerForm'
import { applyFormChange, shiftCollapseState } from './config/editorForm'

declare const process: { env: { BUILD_TIME: string } }
const BUILD_TIME = process.env.BUILD_TIME

const GithubReadMe =
  'https://github.com/duczz/ha-simple-thermostat/blob/master/README.md'

// Mode types the "Mode labels" editor can rename/re-icon per value. Each is
// probed against the entity via the adapter's getModeAttribute(type); only
// types the entity actually exposes (a non-empty list) are shown.
const MODE_LABEL_TYPES = [
  'hvac',
  'mode',
  'preset',
  'fan',
  'swing',
  'swing_horizontal',
  'swing_vertical',
  'vane_horizontal',
  'vane_vertical',
]

const MODE_TYPE_LABELS: Record<string, string> = {
  hvac: 'HVAC modes',
  mode: 'Modes',
  preset: 'Preset modes',
  fan: 'Fan modes',
  swing: 'Swing modes',
  swing_horizontal: 'Horizontal swing',
  swing_vertical: 'Vertical swing',
  vane_horizontal: 'Horizontal vane',
  vane_vertical: 'Vertical vane',
}

const isRecord = (x: any): boolean =>
  typeof x === 'object' && x !== null && !Array.isArray(x)

// structuredClone is a browser-native deep clone (Baseline 2022); all HA-
// supported browsers ship it. JSON.parse(JSON.stringify(...)) is the older
// fallback we used to do.
const cloneDeep = <T>(obj: T): T => structuredClone(obj)

export function buildSchema(config: any) {
  // Show any custom step_size (e.g. 2) as its own dropdown option so the field
  // isn't rendered blank for values outside the presets.
  const stepSizeOptions = [
    { value: 'auto', label: 'Auto (from entity)' },
    { value: '0.1', label: '0.1' },
    { value: '0.5', label: '0.5' },
    { value: '1', label: '1' },
  ]
  const currentStep = config?.step_size != null ? String(config.step_size) : null
  if (currentStep && !stepSizeOptions.some((o) => o.value === currentStep)) {
    stepSizeOptions.push({ value: currentStep, label: currentStep })
  }

  const headerSchema: any[] = []
  if (config.header !== false) {
    headerSchema.push(
      {
        type: 'grid',
        schema: [
          { name: 'name', selector: { text: {} } },
          { name: 'icon', selector: { icon: {} } },
        ],
      },
      { name: 'toggle.entity', selector: { entity: {} } },
      {
        type: 'grid',
        schema: [
          { name: 'toggle.name', selector: { text: {} } },
          { name: 'toggle.icon', selector: { icon: {} } },
        ],
      }
    )
  }

  return [
    {
      type: 'expandable',
      title: 'General',
      iconPath: mdiThermometer,
      expanded: true,
      schema: [
        { name: 'entity', selector: { entity: { domain: ['climate', 'fan', 'humidifier'] } } },
        { name: 'current_value_entity', selector: { entity: { domain: 'sensor' } } },
        {
          type: 'grid',
          schema: [
            {
              name: 'decimals',
              selector: { number: { min: 0, max: 5, step: 1, mode: 'box' } },
            },
            { name: 'unit', selector: { text: {} } },
          ],
        },
      ],
    },
    {
      type: 'expandable',
      title: 'Header',
      iconPath: mdiPageLayoutHeader,
      schema: [
        { name: 'show_header', selector: { boolean: {} } },
        ...headerSchema,
      ],
    },
    {
      type: 'expandable',
      title: 'Setpoint',
      iconPath: mdiThermometer,
      schema: [
        { name: 'hide_setpoint', selector: { boolean: {} } },
        {
          name: 'setpoint_style',
          selector: {
            select: {
              mode: 'dropdown',
              options: [
                { value: 'number', label: 'Number (+/- buttons)' },
                { value: 'dial', label: 'Dial (circular slider)' },
              ],
            },
          },
        },
        {
          type: 'grid',
          schema: [
            {
              name: 'layout.step',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: [
                    { value: 'row', label: 'Row' },
                    { value: 'column', label: 'Column' },
                    { value: 'right', label: 'Right (Stacked)' },
                  ],
                },
              },
            },
            {
              name: 'step_size',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: stepSizeOptions,
                },
              },
            },
          ],
        },
      ],
    },
    {
      type: 'expandable',
      title: 'Mode controls',
      iconPath: mdiTune,
      schema: [
        {
          type: 'grid',
          column_min_width: '130px',
          schema: [
            { name: 'show_preset', selector: { boolean: {} } },
            { name: 'show_fan', selector: { boolean: {} } },
            { name: 'show_swing', selector: { boolean: {} } },
          ],
        },
        {
          type: 'grid',
          column_min_width: '130px',
          schema: [
            { name: 'control.preset._hide_when_off', selector: { boolean: {} } },
            { name: 'control.fan._hide_when_off', selector: { boolean: {} } },
            { name: 'control.swing._hide_when_off', selector: { boolean: {} } },
          ],
        },
        {
          type: 'grid',
          column_min_width: '130px',
          schema: [
            { name: 'show_swing_vertical', selector: { boolean: {} } },
            { name: 'show_swing_horizontal', selector: { boolean: {} } },
          ],
        },
        { name: 'control.swing_vertical.entity', selector: { entity: { domain: ['select', 'input_select', 'switch', 'input_boolean'] } } },
        { name: 'control.swing_horizontal.entity', selector: { entity: { domain: ['select', 'input_select', 'switch', 'input_boolean'] } } },
        {
          type: 'grid',
          column_min_width: '130px',
          schema: [
            { name: 'layout.mode.names', selector: { boolean: {} } },
            { name: 'layout.mode.icons', selector: { boolean: {} } },
            { name: 'layout.mode.headings', selector: { boolean: {} } },
          ],
        },
      ],
    },


    {
      type: 'expandable',
      title: 'Interactions',
      iconPath: mdiGestureTap,
      schema: [
        { name: 'tap_action', selector: { ui_action: { default_action: 'more-info' } } },
        { name: 'hold_action', selector: { ui_action: { default_action: 'none' } } },
        { name: 'double_tap_action', selector: { ui_action: { default_action: 'none' } } },
      ],
    },
  ]
}

const LABELS: Record<string, string> = {
  entity: 'Entity (required)',
  current_value_entity: 'Current temperature entity (optional)',
  show_header: 'Show header',
  name: 'Name',
  icon: 'Icon',
  'toggle.entity': 'Toggle entity',
  'toggle.name': 'Toggle label',
  'toggle.icon': 'Toggle icon',
  show_preset: 'Show preset',
  show_fan: 'Show fan',
  show_swing: 'Show swing',
  'control.preset._hide_when_off': 'Hide preset when off',
  'control.fan._hide_when_off': 'Hide fan when off',
  'control.swing._hide_when_off': 'Hide swing when off',
  show_swing_vertical: 'Show vertical swing',
  show_swing_horizontal: 'Show horizontal swing',
  'layout.mode.names': 'Show mode names',
  'layout.mode.icons': 'Show mode icons',
  'layout.mode.headings': 'Show mode headings',
  decimals: 'Decimals',
  unit: 'Unit',
  'layout.step': 'Step layout (number style)',
  step_size: 'Step size',
  fallback: 'Fallback text',
  hide_setpoint: 'Hide setpoint controls',
  setpoint_style: 'Setpoint style',
  'hide.temperature': 'Hide temperature',
  'hide.state': 'Hide state',
  'icon.temperature': 'Temperature icon',
  'icon.state': 'State icon',
  'color.temperature': 'Temperature color (CSS)',
  'color.state': 'State color (CSS)',
  'label.temperature': 'Temperature label',
  'label.state': 'State label',
  'layout.sensors.type': 'Sensor layout',
  'layout.sensors.labels': 'Show sensor labels',
  tap_action: 'Tap action',
  hold_action: 'Hold action',
  double_tap_action: 'Hold-tap action',
  'control.swing_horizontal.entity': 'Horizontal Swing entity',
  'control.swing_vertical.entity': 'Vertical Swing entity',
}


function isModeEnabled(
  config: any,
  type: string,
  adapter: EntityAdapter
): boolean {
  const control = config.control
  if (control === false) return false
  if (Array.isArray(control)) return control.includes(type)
  if (isObject(control)) {
    if (control[type] === false || (control[type] && typeof control[type] === 'object' && control[type]._hidden === true)) return false
    return type in control
  }
  return adapter.getDefaultControl().includes(type)
}

export default class SimpleThermostatEditor extends LitElement {
  @state() config!: CardConfig
  @state() _newStateColorInputs: Record<number, { state: string; color: string; committedKey?: string }> = {}
  @state() _newStateTextColorInputs: Record<number, { state: string; color: string; committedKey?: string }> = {}
  @state() _collapsedSensors: Record<number, boolean> = {}
  @state() _collapsedBanners: Record<number, boolean> = {}
  @property({ attribute: false }) hass?: HASS

  get _hasBatteryBanner() {
    return (this.config?.banners || []).some((b: any) => b.attribute === 'battery_level')
  }

  get _hasWindowBanner() {
    return (this.config?.banners || []).some((b: any) => b.icon === 'mdi:window-open' || b.text === 'Window open')
  }

  get _hasOfflineBanner() {
    return (this.config?.banners || []).some((b: any) => {
      if (Array.isArray(b.state)) return b.state.includes('unavailable')
      if (typeof b.state === 'string') return b.state.includes('unavailable')
      return false
    })
  }

  static get styles() {
    return styles
  }

  // Caches the last real header object (e.g. `{ faults: [...] }`) so a
  // show_header off/on round trip in the editor doesn't lose editor-only-
  // unknown fields like `faults` that have no form field to repopulate them.
  private _lastHeaderConfig: any = undefined

  setConfig(config: CardConfig) {
    this.config = config || ({} as CardConfig)
    if (this.config.header && typeof this.config.header === 'object') {
      this._lastHeaderConfig = this.config.header
    }
  }

  _openLink() {
    window.open(GithubReadMe, '_blank', 'noopener')
  }

  _buildFormData() {
    const adapter = getAdapter(this.config.entity)
    // While the header is hidden, fall back to the cached header instead of
    // `{}` — otherwise the (invisible, since headerSchema is empty when
    // show_header is false) name/icon/toggle form fields silently carry an
    // empty value forward, which then wipes them the moment the header is
    // re-enabled (applyFormChange treats an empty field as "clear this").
    const header: any =
      this.config.header && typeof this.config.header === 'object'
        ? this.config.header
        : (this._lastHeaderConfig ?? {})
    const data: any = {
      entity: this.config.entity ?? '',
      current_value_entity: this.config.current_value_entity ?? '',
      show_header: this.config.header !== false,
      decimals: this.config.decimals ?? 1,
      // A non-string unit (`unit: false` = hide) is shown as empty in the text
      // field; applyFormChange preserves the underlying false on save.
      unit: typeof this.config.unit === 'string' ? this.config.unit : '',
      'layout.step': this.config.layout?.step ?? 'row',
      step_size:
        this.config.step_size != null ? String(this.config.step_size) : 'auto',
      fallback: this.config.fallback ?? '',
      'hide.temperature': this.config.hide?.temperature === true,
      'hide.state': this.config.hide?.state === true,
      'icon.temperature': this.config.icon?.temperature ?? '',
      'icon.state': this.config.icon?.state ?? '',
      'label.temperature': this.config.label?.temperature ?? '',
      'label.state': this.config.label?.state ?? '',
      sensors: this.config.sensors ?? [],
      'layout.sensors.type': this.config.layout?.sensors?.type ?? 'table',
      'layout.sensors.labels':
        this.config.layout?.sensors?.labels !== false,
      'layout.mode.names': this.config.layout?.mode?.names !== false,
      'layout.mode.icons': this.config.layout?.mode?.icons !== false,
      'layout.mode.headings': this.config.layout?.mode?.headings === true,
      hide_setpoint: this.config.hide_setpoint === true,
      setpoint_style: this.config.setpoint_style ?? 'number',
      show_preset: isModeEnabled(this.config, 'preset', adapter),
      show_fan: isModeEnabled(this.config, 'fan', adapter),
      show_swing: isModeEnabled(this.config, 'swing', adapter),
      'control.preset._hide_when_off': (this.config.control as any)?.preset?._hide_when_off === true,
      'control.fan._hide_when_off': (this.config.control as any)?.fan?._hide_when_off === true,
      // The single swing toggle reflects any swing variant carrying the flag.
      'control.swing._hide_when_off':
        (this.config.control as any)?.swing?._hide_when_off === true ||
        (this.config.control as any)?.swing_vertical?._hide_when_off === true ||
        (this.config.control as any)?.swing_horizontal?._hide_when_off === true,
      show_swing_vertical: isModeEnabled(this.config, 'swing_vertical', adapter),
      show_swing_horizontal: isModeEnabled(this.config, 'swing_horizontal', adapter),
      name: header.name ?? '',
      icon: typeof header.icon === 'string' ? header.icon : '',
      'toggle.entity': header.toggle?.entity ?? '',
      'toggle.name': header.toggle?.name ?? '',
      'toggle.icon':
        typeof header.toggle?.icon === 'string' ? header.toggle.icon : '',
      tap_action: this.config.tap_action ?? { action: 'more-info' },
      hold_action: this.config.hold_action ?? { action: 'none' },
      double_tap_action: this.config.double_tap_action ?? { action: 'none' },
    }

    const existingControl = (typeof this.config.control === 'object' && this.config.control !== null && !Array.isArray(this.config.control) ? this.config.control : {}) as any
    data['control.swing_horizontal.entity'] = existingControl.swing_horizontal?.entity ?? ''
    data['control.swing_vertical.entity'] = existingControl.swing_vertical?.entity ?? ''

    return data
  }

  _applyFormChange(updated: any) {
    if (this.config.header && typeof this.config.header === 'object') {
      this._lastHeaderConfig = this.config.header
    }
    return applyFormChange(this.config, updated, this._lastHeaderConfig)
  }

  _valueChanged = (ev: CustomEvent) => {
    const updated = ev.detail.value
    const copy = this._applyFormChange(updated)
    fireEvent(this, 'config-changed', { config: copy })
  }

  _computeLabel = (schema: any) => LABELS[schema.name] ?? schema.name

  _getVirtualSensors() {
    const virtualSensors: any[] = []
    if (this.config?.hide?.temperature !== true) {
      virtualSensors.push({
        _isVirtual: 'temperature',
        entity: 'Built-in: Temperature',
        name: this.config?.label?.temperature || '',
        icon: this.config?.icon?.temperature || '',
        color: this.config?.color?.temperature || '',
      })
    }
    if (this.config?.hide?.state !== true) {
      virtualSensors.push({
        _isVirtual: 'state',
        entity: 'Built-in: State',
        name: this.config?.label?.state || '',
        icon: this.config?.icon?.state || '',
        color: this.config?.color?.state || '',
      })
    }
    return virtualSensors
  }

  _getAllSensors() {
    return [...this._getVirtualSensors(), ...(this.config?.sensors || [])]
  }

  _addSensor = () => {
    const sensors = [...(this.config.sensors || [])]
    sensors.push({ entity: '', name: '', icon: '', color: '' } as any)
    this._applyAndFire({ sensors })
  }

  _onSensorFormChanged = (index: number, formData: any) => {
    const allSensors = this._getAllSensors()
    const target = allSensors[index]

    if (target._isVirtual) {
      const copy = { ...this.config }
      if ('label' in formData) {
        copy.label = { ...copy.label }
        if (formData.label) copy.label[target._isVirtual] = formData.label
        else delete copy.label[target._isVirtual]
      }
      if ('icon' in formData) {
        copy.icon = { ...copy.icon }
        if (formData.icon) copy.icon[target._isVirtual] = formData.icon
        else delete copy.icon[target._isVirtual]
      }
      if ('color' in formData) {
        copy.color = { ...copy.color }
        if (formData.color) copy.color[target._isVirtual] = formData.color
        else delete copy.color[target._isVirtual]
      }
      fireEvent(this, 'config-changed', { config: copy })
    } else {
      const virtualCount = this._getVirtualSensors().length
      const realIndex = index - virtualCount
      const sensors = [...(this.config.sensors || [])]
      const { label, ...rest } = formData

      if (rest.entity && rest.display_as && rest.display_as !== 'state') {
        const [domain] = rest.entity.split('.')
        let isValid = false
        if (rest.display_as === 'switch' && ['switch', 'input_boolean', 'light', 'fan', 'automation', 'siren'].includes(domain)) isValid = true
        if (rest.display_as === 'slider' && ['input_number', 'number'].includes(domain)) isValid = true
        if (rest.display_as === 'select' && ['input_select', 'select'].includes(domain)) isValid = true
        if (!isValid) {
          rest.display_as = 'state'
        }
      }

      sensors[realIndex] = { ...sensors[realIndex], ...rest, name: label || undefined }
      this._applyAndFire({ sensors })
    }
  }

  _restoreSensor = (type: string) => {
    if ((this.config.hide as any)?.[type]) {
      // Clone `hide` instead of mutating the shared config object
      const copy = { ...this.config, hide: { ...this.config.hide, [type]: false } }
      fireEvent(this, 'config-changed', { config: copy })
    }
  }

  _getStateColors = (index: number): Record<string, string> => {
    const allSensors = this._getAllSensors()
    const sensor = allSensors[index]
    if (sensor._isVirtual) {
      return (this.config.state_color as any)?.[sensor._isVirtual] || {}
    } else {
      const virtualCount = this._getVirtualSensors().length
      const realIndex = index - virtualCount
      return (this.config.sensors?.[realIndex] as any)?.state_color || {}
    }
  }

  _setStateColor = (index: number, stateKey: string, color: string) => {
    const allSensors = this._getAllSensors()
    const sensor = allSensors[index]
    if (sensor._isVirtual) {
      const copy = { ...this.config } as any
      copy.state_color = { ...copy.state_color }
      const current = { ...(copy.state_color[sensor._isVirtual] || {}) }
      if (color) current[stateKey] = color
      else delete current[stateKey]
      copy.state_color[sensor._isVirtual] = current
      fireEvent(this, 'config-changed', { config: copy })
    } else {
      const virtualCount = this._getVirtualSensors().length
      const realIndex = index - virtualCount
      const sensors = [...(this.config.sensors || [])] as any[]
      const current = { ...(sensors[realIndex].state_color || {}) }
      if (color) current[stateKey] = color
      else delete current[stateKey]
      sensors[realIndex] = { ...sensors[realIndex], state_color: current }
      this._applyAndFire({ sensors })
    }
  }

  _updatePendingStateColor = (index: number, field: 'state' | 'color', value: string) => {
    const pending = this._newStateColorInputs[index] || { state: '', color: '' }
    const oldCommittedKey = pending.committedKey
    const newPending = { ...pending, [field]: value }

    if (newPending.state) {
      newPending.committedKey = newPending.state
      this._newStateColorInputs = { ...this._newStateColorInputs, [index]: newPending }
      this._replaceStateColor(index, oldCommittedKey, newPending.state, newPending.color)
    } else {
      if (oldCommittedKey) {
        this._setStateColor(index, oldCommittedKey, '')
      }
      newPending.committedKey = undefined
      this._newStateColorInputs = { ...this._newStateColorInputs, [index]: newPending }
    }
  }

  _replaceStateColor = (index: number, oldKey: string | undefined, newKey: string, color: string) => {
    const allSensors = this._getAllSensors()
    const sensor = allSensors[index]
    const stateColors = { ...this._getStateColors(index) }

    if (oldKey && oldKey !== newKey) {
      delete stateColors[oldKey]
    }
    stateColors[newKey] = color

    if (sensor._isVirtual) {
      const copy = { ...this.config } as any
      copy.state_color = { ...copy.state_color, [sensor._isVirtual]: stateColors }
      fireEvent(this, 'config-changed', { config: copy })
    } else {
      const virtualCount = this._getVirtualSensors().length
      const realIndex = index - virtualCount
      const sensors = [...(this.config.sensors || [])] as any[]
      sensors[realIndex] = { ...sensors[realIndex], state_color: stateColors }
      this._applyAndFire({ sensors })
    }
  }

  _commitStateColor = (index: number) => {
    const updated = { ...this._newStateColorInputs }
    delete updated[index]
    this._newStateColorInputs = updated
  }

  _getStateTextColors = (index: number): Record<string, string> => {
    const allSensors = this._getAllSensors()
    const sensor = allSensors[index]
    if (sensor._isVirtual) {
      return (this.config.state_text_color as any)?.[sensor._isVirtual] || {}
    } else {
      const virtualCount = this._getVirtualSensors().length
      const realIndex = index - virtualCount
      return (this.config.sensors?.[realIndex] as any)?.state_text_color || {}
    }
  }

  _setStateTextColor = (index: number, stateKey: string, color: string) => {
    const allSensors = this._getAllSensors()
    const sensor = allSensors[index]
    if (sensor._isVirtual) {
      const copy = { ...this.config } as any
      copy.state_text_color = { ...copy.state_text_color }
      const current = { ...(copy.state_text_color[sensor._isVirtual] || {}) }
      if (color) current[stateKey] = color
      else delete current[stateKey]
      copy.state_text_color[sensor._isVirtual] = current
      fireEvent(this, 'config-changed', { config: copy })
    } else {
      const virtualCount = this._getVirtualSensors().length
      const realIndex = index - virtualCount
      const sensors = [...(this.config.sensors || [])] as any[]
      const current = { ...(sensors[realIndex].state_text_color || {}) }
      if (color) current[stateKey] = color
      else delete current[stateKey]
      sensors[realIndex] = { ...sensors[realIndex], state_text_color: current }
      this._applyAndFire({ sensors })
    }
  }

  _updatePendingStateTextColor = (index: number, field: 'state' | 'color', value: string) => {
    const pending = this._newStateTextColorInputs[index] || { state: '', color: '' }
    const oldCommittedKey = pending.committedKey
    const newPending = { ...pending, [field]: value }

    if (newPending.state) {
      newPending.committedKey = newPending.state
      this._newStateTextColorInputs = { ...this._newStateTextColorInputs, [index]: newPending }
      this._replaceStateTextColor(index, oldCommittedKey, newPending.state, newPending.color)
    } else {
      if (oldCommittedKey) {
        this._setStateTextColor(index, oldCommittedKey, '')
      }
      newPending.committedKey = undefined
      this._newStateTextColorInputs = { ...this._newStateTextColorInputs, [index]: newPending }
    }
  }

  _replaceStateTextColor = (index: number, oldKey: string | undefined, newKey: string, color: string) => {
    const allSensors = this._getAllSensors()
    const sensor = allSensors[index]
    const stateColors = { ...this._getStateTextColors(index) }

    if (oldKey && oldKey !== newKey) {
      delete stateColors[oldKey]
    }
    stateColors[newKey] = color

    if (sensor._isVirtual) {
      const copy = { ...this.config } as any
      copy.state_text_color = { ...copy.state_text_color, [sensor._isVirtual]: stateColors }
      fireEvent(this, 'config-changed', { config: copy })
    } else {
      const virtualCount = this._getVirtualSensors().length
      const realIndex = index - virtualCount
      const sensors = [...(this.config.sensors || [])] as any[]
      sensors[realIndex] = { ...sensors[realIndex], state_text_color: stateColors }
      this._applyAndFire({ sensors })
    }
  }

  _commitStateTextColor = (index: number) => {
    const updated = { ...this._newStateTextColorInputs }
    delete updated[index]
    this._newStateTextColorInputs = updated
  }

  _removeSensor = (index: number) => {
    const allSensors = this._getAllSensors()
    const target = allSensors[index]

    // Keep collapse/expand state attached to the right rows after removal
    this._collapsedSensors = shiftCollapseState(this._collapsedSensors, index)

    if (target._isVirtual) {
      const copy = { ...this.config, hide: { ...this.config.hide, [target._isVirtual]: true } }
      fireEvent(this, 'config-changed', { config: copy })
    } else {
      const virtualCount = this._getVirtualSensors().length
      const realIndex = index - virtualCount
      const sensors = [...(this.config.sensors || [])]
      sensors.splice(realIndex, 1)
      if (sensors.length === 0) {
        const copy = { ...this.config }
        delete copy.sensors
        fireEvent(this, 'config-changed', { config: copy })
      } else {
        this._applyAndFire({ sensors })
      }
    }
  }

  // Reorder a custom sensor by one position. Built-in (virtual) sensors keep
  // their fixed spot at the top; only entries in `config.sensors` move.
  _moveSensor = (index: number, dir: -1 | 1) => {
    const allSensors = this._getAllSensors()
    if (allSensors[index]?._isVirtual) return
    const virtualCount = this._getVirtualSensors().length
    const realIndex = index - virtualCount
    const targetReal = realIndex + dir
    const sensors = [...(this.config.sensors || [])]
    if (targetReal < 0 || targetReal >= sensors.length) return
    ;[sensors[realIndex], sensors[targetReal]] = [sensors[targetReal], sensors[realIndex]]
    // Keep collapse/expand state attached to the rows as they swap.
    const c = { ...this._collapsedSensors }
    const tmp = c[index]
    c[index] = c[index + dir]
    c[index + dir] = tmp
    this._collapsedSensors = c
    this._applyAndFire({ sensors })
  }

  // Insert a new banner at the position that keeps the list sorted by severity
  // (error → warning → info → success). Rendering still follows the array order,
  // so a new banner arrives "pre-sorted" but can be moved manually afterwards.
  _addBannerSorted = (banner: any) => {
    const rankOf = (t?: string) => ({ error: 1, warning: 2, info: 3, success: 4 } as Record<string, number>)[t || 'warning'] ?? 99
    const banners = [...(this.config.banners || [])]
    const r = rankOf(banner.type)
    let at = banners.length
    for (let i = 0; i < banners.length; i++) {
      if (rankOf(banners[i].type) > r) { at = i; break }
    }
    banners.splice(at, 0, banner)
    // Shift collapse state up for the banners that moved down by the insertion.
    const shifted: Record<number, boolean> = {}
    for (const [k, v] of Object.entries(this._collapsedBanners)) {
      const idx = Number(k)
      shifted[idx >= at ? idx + 1 : idx] = v
    }
    this._collapsedBanners = shifted
    fireEvent(this, 'config-changed', { config: { ...this.config, banners } })
  }

  _addBanner = () => this._addBannerSorted({ type: 'info', text: 'New Banner' })

  _addBatteryBanner = () =>
    this._addBannerSorted({ attribute: 'battery_level', below: 20, type: 'warning', text: 'Low battery ({{value}}%)', icon: 'mdi:battery-alert' })

  _addWindowBanner = () =>
    this._addBannerSorted({ entity: 'binary_sensor.window', state: 'on', type: 'info', text: 'Window open', icon: 'mdi:window-open' })

  _addOfflineBanner = () =>
    this._addBannerSorted({ state: ['unavailable', 'unknown'], type: 'error', text: 'Device unavailable', icon: 'mdi:alert-circle-outline' })

  _removeBanner = (index: number) => {
    const banners = [...(this.config.banners || [])]
    banners.splice(index, 1)
    // Keep collapse/expand state attached to the right banners after removal
    this._collapsedBanners = shiftCollapseState(this._collapsedBanners, index)
    const copy = { ...this.config }
    if (banners.length === 0) {
      delete copy.banners
    } else {
      copy.banners = banners
    }
    fireEvent(this, 'config-changed', { config: copy })
  }

  _moveBanner = (index: number, dir: -1 | 1) => {
    const banners = [...(this.config.banners || [])]
    const target = index + dir
    if (target < 0 || target >= banners.length) return
    ;[banners[index], banners[target]] = [banners[target], banners[index]]
    const c = { ...this._collapsedBanners }
    const tmp = c[index]
    c[index] = c[target]
    c[target] = tmp
    this._collapsedBanners = c
    fireEvent(this, 'config-changed', { config: { ...this.config, banners } })
  }

  _onBannerFormChanged = (index: number, formData: any) => {
    const banners = [...(this.config.banners || [])]
    banners[index] = mergeBannerFormData(banners[index], formData)
    const copy = { ...this.config, banners }
    fireEvent(this, 'config-changed', { config: copy })
  }

  _applyAndFire = (updated: any) => {
    const copy = this._applyFormChange({ ...this._buildFormData(), ...updated })
    fireEvent(this, 'config-changed', { config: copy })
  }

  // Mode types the entity exposes, each with its list of raw mode values, for
  // the "Mode labels" panel. Empty when the entity/state isn't available.
  _getModeLabelGroups(): { type: string; label: string; values: string[] }[] {
    const entityId = this.config?.entity
    const stateObj = entityId ? this.hass?.states?.[entityId] : undefined
    if (!stateObj) return []
    const adapter = getAdapter(entityId)
    const groups: { type: string; label: string; values: string[] }[] = []
    for (const type of MODE_LABEL_TYPES) {
      const attr = adapter.getModeAttribute(type)
      const raw = stateObj.attributes?.[attr]
      if (!Array.isArray(raw)) continue
      const values = raw.filter((v: any) => typeof v === 'string')
      if (values.length) groups.push({ type, label: MODE_TYPE_LABELS[type] ?? type, values })
    }
    return groups
  }

  // Current name/icon override for a single mode value (from control.<type>.<value>).
  _getModeOverride(type: string, value: string): { name?: string | false; icon?: string } {
    const control = (this.config as any)?.control
    if (!isRecord(control)) return {}
    const typeObj = control[type]
    if (!isRecord(typeObj)) return {}
    const valObj = typeObj[value]
    return isRecord(valObj) ? valObj : {}
  }

  // Write a mode value's name/icon into control.<type>.<value>, pruning empty
  // objects so a cleared field leaves no residue. Fires config-changed once.
  _setModeLabels = (type: string, value: string, next: { name?: string; icon?: string }) => {
    const copy = cloneDeep(this.config) as any
    let control = copy.control
    if (!isRecord(control)) control = {}
    copy.control = control
    const typeObj = isRecord(control[type]) ? control[type] : {}
    control[type] = typeObj
    const valObj = isRecord(typeObj[value]) ? { ...typeObj[value] } : {}
    for (const field of ['name', 'icon'] as const) {
      const nv = next[field]
      if (nv !== undefined && nv !== null && nv !== '') valObj[field] = nv
      else delete valObj[field]
    }
    if (Object.keys(valObj).length === 0) delete typeObj[value]
    else typeObj[value] = valObj
    if (Object.keys(typeObj).length === 0) delete control[type]
    if (Object.keys(control).length === 0) delete copy.control
    fireEvent(this, 'config-changed', { config: copy })
  }

  render() {
    if (!this.hass || !this.config) return html``

    const schema = buildSchema(this.config)
    const data = this._buildFormData()

    const schemaBefore = schema.filter((s: any) => !['Interactions'].includes(s.title))
    const schemaAfter = schema.filter((s: any) => s.title === 'Interactions')

    const modeLabelGroups = this._getModeLabelGroups()
    const modeLabelSchema = [
      {
        type: 'grid',
        column_min_width: '140px',
        schema: [
          { name: 'name', selector: { text: {} } },
          { name: 'icon', selector: { icon: {} } },
        ],
      },
    ]

    return html`
      <div class="card-config">
        <style>
          .card-config > ha-expansion-panel,
          .card-config > ha-form {
            display: block;
          }
          /* Spacing kommt aus gap auf .card-config (styles.css) — kein margin-top
             mehr, das brauchte ein :not(:first-of-type) und traf die Panels innerhalb
             von ha-form ohnehin nie (Shadow-DOM). */
          .chip ha-icon, .chip ha-state-icon {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        </style>
        <ha-form
          .hass=${this.hass}
          .data=${data}
          .schema=${schemaBefore}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>

        ${modeLabelGroups.length
        ? html`<ha-expansion-panel outlined>
          <div slot="header" style="display: flex; align-items: center; gap: 8px;">
            <ha-svg-icon .path=${mdiTagTextOutline}></ha-svg-icon>
            Mode labels
          </div>
          <div class="panel-content">
            <div class="mode-label-hint">
              Rename a mode or give it a custom icon. The key on the left is the
              raw entity state and cannot be changed. Leave a field empty to keep
              the Home Assistant default.
            </div>
            ${modeLabelGroups.map(
          (group) => html`
              <div class="mode-label-group">
                <div class="mode-label-heading">${group.label}</div>
                ${group.values.map((value) => {
            const ov = this._getModeOverride(group.type, value)
            return html`
                    <div class="mode-label-row">
                      <code class="mode-label-key">${value}</code>
                      <ha-form
                        .hass=${this.hass}
                        .data=${{
                name: typeof ov.name === 'string' ? ov.name : '',
                icon: ov.icon ?? '',
              }}
                        .schema=${modeLabelSchema}
                        .computeLabel=${(s: any) => (s.name === 'name' ? 'Name' : 'Icon')}
                        @value-changed=${(e: any) =>
                this._setModeLabels(group.type, value, e.detail.value)}
                      ></ha-form>
                    </div>
                  `
          })}
              </div>
            `
        )}
          </div>
        </ha-expansion-panel>`
        : nothing}

        <ha-expansion-panel outlined>
          <div slot="header" style="display: flex; align-items: center; gap: 8px;">
            <ha-svg-icon .path=${mdiInformationOutline}></ha-svg-icon>
            Banners
          </div>
          <div class="panel-content">
            ${(this.config.banners || []).map((banner: any, index: number) => {
        const isCollapsed = this._collapsedBanners[index] ?? true
        const bannerSchema = [
          { name: 'entity', selector: { entity: {} } },
          {
            type: 'grid',
            column_min_width: '140px',
            schema: [
              { name: 'attribute', selector: { text: {} } },
              { name: 'text', selector: { text: {} } },
            ]
          },
          {
            type: 'grid',
            column_min_width: '140px',
            schema: [
              { name: 'type', selector: { select: { mode: 'dropdown', options: ['warning', 'error', 'info', 'success'] } } },
              { name: 'icon', selector: { icon: {} } },
            ]
          },
          {
            type: 'grid',
            column_min_width: '140px',
            schema: [
              { name: 'state', selector: { text: {} } },
              { name: 'state_not', selector: { text: {} } },
              { name: 'below', selector: { number: { mode: 'box', step: 0.1 } } },
              { name: 'above', selector: { number: { mode: 'box', step: 0.1 } } },
            ]
          }
        ]

        return html`
                <div style="border: 1px solid var(--divider-color); padding: 0 12px${isCollapsed ? '' : ' 12px'}; border-radius: 8px; margin-bottom: 12px; position: relative;">
                  <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; ${isCollapsed ? '' : 'margin-bottom: 12px;'}" @click=${() => { this._collapsedBanners = { ...this._collapsedBanners, [index]: !isCollapsed } }}>
                    <div style="font-weight: 500;">
                      ${banner.text || banner.entity || 'New Banner'}
                    </div>
                    <div style="display: flex; gap: 4px; align-items: center;">
                      <ha-icon-button
                        .path=${mdiArrowUp}
                        .disabled=${index === 0}
                        @click=${(e: Event) => {
            e.stopPropagation()
            this._moveBanner(index, -1)
          }}
                      ></ha-icon-button>
                      <ha-icon-button
                        .path=${mdiArrowDown}
                        .disabled=${index === (Array.isArray(this.config.banners) ? this.config.banners.length : 0) - 1}
                        @click=${(e: Event) => {
            e.stopPropagation()
            this._moveBanner(index, 1)
          }}
                      ></ha-icon-button>
                      <ha-icon-button
                        .path=${mdiDelete}
                        style="color: var(--error-color);"
                        @click=${(e: Event) => {
            e.stopPropagation()
            this._removeBanner(index)
          }}
                      ></ha-icon-button>
                      <ha-icon-button
                        .path=${isCollapsed ? mdiChevronDown : mdiChevronUp}
                        @click=${(e: Event) => {
            e.stopPropagation()
            this._collapsedBanners = { ...this._collapsedBanners, [index]: !isCollapsed }
          }}
                      ></ha-icon-button>
                    </div>
                  </div>
                  ${isCollapsed ? nothing : html`
                    <ha-form
                      .hass=${this.hass}
                      .data=${{ ...banner, state: Array.isArray(banner.state) ? banner.state.join(', ') : banner.state, state_not: Array.isArray(banner.state_not) ? banner.state_not.join(', ') : banner.state_not }}
                      .schema=${bannerSchema}
                      .computeLabel=${(s: any) => ({ entity: 'Entity (optional)', attribute: 'Attribute (optional)', text: 'Text ({{value}} allowed)', type: 'Color Type', icon: 'Icon', state: 'State triggers (comma separated)', state_not: 'State NOT triggers', below: 'Below value', above: 'Above value' })[s.name] ?? s.name}
                      @value-changed=${(e: any) => this._onBannerFormChanged(index, e.detail.value)}
                    ></ha-form>
                  `}
                </div>
              `
      })}
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
              <ha-button @click=${this._addBanner} outlined>Add Custom Banner</ha-button>
              ${!this._hasBatteryBanner ? html`<ha-button @click=${this._addBatteryBanner} outlined>Add Low Battery Banner</ha-button>` : nothing}
              ${!this._hasWindowBanner ? html`<ha-button @click=${this._addWindowBanner} outlined>Add Open Window Banner</ha-button>` : nothing}
              ${!this._hasOfflineBanner ? html`<ha-button @click=${this._addOfflineBanner} outlined>Add Climate Offline Banner</ha-button>` : nothing}
            </div>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel outlined>
          <div slot="header" style="display: flex; align-items: center; gap: 8px;">
            <ha-svg-icon .path=${mdiBookOpenVariant}></ha-svg-icon>
            Sensors
          </div>
          <div class="panel-content">
            <ha-form
              style="margin-bottom: 8px;"
              .hass=${this.hass}
              .data=${data}
              .schema=${[{
        type: 'grid',
        column_min_width: '160px',
        schema: [
          {
            name: 'layout.sensors.type',
            selector: {
              select: {
                mode: 'dropdown',
                options: [
                  { value: 'table', label: 'Table' },
                  { value: 'list', label: 'List' },
                  { value: 'chips', label: 'Chips' },
                  { value: 'badges', label: 'Badges' },
                ],
              },
            },
          },
          { name: 'layout.sensors.labels', selector: { boolean: {} } },
        ],
      }]}
              .computeLabel=${this._computeLabel}
              @value-changed=${this._valueChanged}
            ></ha-form>

            <div style="height: 1px; background-color: var(--divider-color); margin: 8px 0;"></div>

            ${this._getAllSensors().map(
        (sensor: any, index: number) => {
          const [entityDomain] = (sensor.entity || '').split('.')
          const renderOptions = [{ value: 'state', label: 'State (Text)' }]
          if (['switch', 'input_boolean', 'light', 'fan', 'automation', 'siren'].includes(entityDomain)) {
            renderOptions.push({ value: 'switch', label: 'Toggle Switch' })
          } else if (['input_number', 'number'].includes(entityDomain)) {
            renderOptions.push({ value: 'slider', label: 'Slider' })
          } else if (['input_select', 'select'].includes(entityDomain)) {
            renderOptions.push({ value: 'select', label: 'Select Dropdown' })
          }

          const sensorSchema = sensor._isVirtual ? [
            { name: 'label', selector: { text: {} } },
            {
              type: 'grid',
              column_min_width: '140px',
              schema: [
                { name: 'icon', selector: { icon: {} } },
                { name: 'color', selector: { text: {} } },
              ],
            },
          ] : [
            { name: 'entity', selector: { entity: {} } },
            {
              type: 'grid',
              column_min_width: '140px',
              schema: [
                { name: 'label', selector: { text: {} } },
                {
                  name: 'display_as',
                  selector: {
                    select: {
                      options: renderOptions,
                      mode: 'dropdown'
                    }
                  }
                },
              ]
            },
            {
              type: 'grid',
              column_min_width: '140px',
              schema: [
                { name: 'icon', selector: { icon: {} } },
                { name: 'color', selector: { text: {} } },
              ],
            },
          ]
          const sensorData = {
            entity: sensor.entity || '',
            label: sensor.name || '',
            icon: sensor.icon || '',
            color: sensor.color || '',
            display_as: sensor.display_as || 'state',
          }
          const friendlyName = sensorData.entity && this.hass?.states?.[sensorData.entity]
            ? this.hass.states[sensorData.entity].attributes.friendly_name || sensorData.entity
            : sensorData.entity || `Custom Sensor ${index - this._getVirtualSensors().length + 1}`

          const isCollapsed = this._collapsedSensors[index] ?? true

          return html`
            <div style="border: 1px solid var(--divider-color); padding: 0 12px${isCollapsed ? '' : ' 12px'}; border-radius: 8px; margin-bottom: 12px; position: relative;">
              <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer; ${isCollapsed ? '' : 'margin-bottom: 12px;'}" @click=${() => { this._collapsedSensors = { ...this._collapsedSensors, [index]: !isCollapsed } }}>
                <div style="font-weight: 500;">
                  ${sensor._isVirtual
              ? `Built-in: ${sensor._isVirtual === 'state' ? 'State' : 'Temperature'}`
              : `${friendlyName}${sensorData.label ? ` (${sensorData.label})` : ''}`}
                </div>
                <div style="display: flex; gap: 4px; align-items: center;">
                        ${sensor._isVirtual ? nothing : html`
                        <ha-icon-button
                          .path=${mdiArrowUp}
                          .disabled=${index - this._getVirtualSensors().length === 0}
                          @click=${(e: Event) => {
              e.stopPropagation()
              this._moveSensor(index, -1)
            }}
                        ></ha-icon-button>
                        <ha-icon-button
                          .path=${mdiArrowDown}
                          .disabled=${index - this._getVirtualSensors().length === (Array.isArray(this.config.sensors) ? this.config.sensors.length : 0) - 1}
                          @click=${(e: Event) => {
              e.stopPropagation()
              this._moveSensor(index, 1)
            }}
                        ></ha-icon-button>`}
                        <ha-icon-button
                          .path=${mdiDelete}
                          style="color: var(--error-color);"
                          @click=${(e: Event) => {
              e.stopPropagation()
              this._removeSensor(index)
            }}
                        ></ha-icon-button>
                        <ha-icon-button
                          .path=${isCollapsed ? mdiChevronDown : mdiChevronUp}
                          @click=${(e: Event) => {
              e.stopPropagation()
              this._collapsedSensors = { ...this._collapsedSensors, [index]: !isCollapsed }
            }}
                        ></ha-icon-button>
                      </div>
                    </div>
                    ${isCollapsed ? nothing : html`
                    <ha-form
                      .hass=${this.hass}
                      .data=${sensorData}
                      .schema=${sensorSchema}
                      .computeLabel=${(s: any) => ({ entity: 'Entity', label: 'Name / Label (optional)', icon: 'Icon (optional)', color: 'Color (CSS, optional)', display_as: 'Display As' })[s.name] ?? s.name}
                      @value-changed=${(e: any) => this._onSensorFormChanged(index, e.detail.value)}
                    ></ha-form>
                    ${(() => {
                const stateColors = this._getStateColors(index)
                const pending = this._newStateColorInputs[index] || { state: '', color: '' }
                const entries = Object.entries(stateColors).filter(([k]) => k !== pending.committedKey)
                return html`
                        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--divider-color);">
                          <div style="font-size: 12px; color: var(--secondary-text-color); font-weight: 500; margin-bottom: 6px;">State Colors (Icon)</div>
                          ${entries.map(([stateKey, stateColor]) => html`
                          <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; align-items: center; margin-bottom: 8px;">
                            <ha-selector
                              style="min-width: 0; margin-bottom: -22px;"
                              .hass=${this.hass}
                              .selector=${{ text: {} }}
                              .value=${stateKey}
                              .label=${'State'}
                              disabled
                            ></ha-selector>
                            <ha-selector
                              style="min-width: 0; margin-bottom: -22px;"
                              .hass=${this.hass}
                              .selector=${{ text: {} }}
                              .value=${stateColor}
                              .label=${'Color CSS'}
                              @value-changed=${(e: any) => this._setStateColor(index, stateKey, e.detail.value)}
                            ></ha-selector>
                            <ha-icon-button
                              .path=${mdiDelete}
                              style="color: var(--error-color);"
                              @click=${() => this._setStateColor(index, stateKey, '')}
                            ></ha-icon-button>
                          </div>
                        `)}
                        <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; align-items: center; margin-top: 8px;">
                          <ha-selector
                            style="min-width: 0; margin-bottom: -22px;"
                            .hass=${this.hass}
                            .selector=${{ text: {} }}
                            .value=${pending.state}
                            .label=${'State (e.g. heat)'}
                            @value-changed=${(e: any) => this._updatePendingStateColor(index, 'state', e.detail.value)}
                          ></ha-selector>
                          <ha-selector
                            style="min-width: 0; margin-bottom: -22px;"
                            .hass=${this.hass}
                            .selector=${{ text: {} }}
                            .value=${pending.color}
                            .label=${'Color CSS'}
                            @value-changed=${(e: any) => this._updatePendingStateColor(index, 'color', e.detail.value)}
                          ></ha-selector>
                          <ha-icon-button
                            .path=${mdiPlus}
                            style="${pending.state ? '' : 'opacity: 0.4;'}"
                            @click=${() => this._commitStateColor(index)}
                          ></ha-icon-button>
                        </div>
                      </div>
                      ${(() => {
                        const stateTextColors = this._getStateTextColors(index)
                        const pendingText = this._newStateTextColorInputs[index] || { state: '', color: '' }
                        const entriesText = Object.entries(stateTextColors).filter(([k]) => k !== pendingText.committedKey)
                        return html`
                        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--divider-color);">
                          <div style="font-size: 12px; color: var(--secondary-text-color); font-weight: 500; margin-bottom: 6px;">State Colors (Text)</div>
                          ${entriesText.map(([stateKey, stateColor]) => html`
                          <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; align-items: center; margin-bottom: 8px;">
                            <ha-selector
                              style="min-width: 0; margin-bottom: -22px;"
                              .hass=${this.hass}
                              .selector=${{ text: {} }}
                              .value=${stateKey}
                              .label=${'State'}
                              disabled
                            ></ha-selector>
                            <ha-selector
                              style="min-width: 0; margin-bottom: -22px;"
                              .hass=${this.hass}
                              .selector=${{ text: {} }}
                              .value=${stateColor}
                              .label=${'Text Color CSS'}
                              @value-changed=${(e: any) => this._setStateTextColor(index, stateKey, e.detail.value)}
                            ></ha-selector>
                            <ha-icon-button
                              .path=${mdiDelete}
                              style="color: var(--error-color);"
                              @click=${() => this._setStateTextColor(index, stateKey, '')}
                            ></ha-icon-button>
                          </div>
                        `)}
                        <div style="display: grid; grid-template-columns: 1fr 1fr auto; gap: 8px; align-items: center; margin-top: 8px;">
                          <ha-selector
                            style="min-width: 0; margin-bottom: -22px;"
                            .hass=${this.hass}
                            .selector=${{ text: {} }}
                            .value=${pendingText.state}
                            .label=${'State (e.g. heat)'}
                            @value-changed=${(e: any) => this._updatePendingStateTextColor(index, 'state', e.detail.value)}
                          ></ha-selector>
                          <ha-selector
                            style="min-width: 0; margin-bottom: -22px;"
                            .hass=${this.hass}
                            .selector=${{ text: {} }}
                            .value=${pendingText.color}
                            .label=${'Text Color CSS'}
                            @value-changed=${(e: any) => this._updatePendingStateTextColor(index, 'color', e.detail.value)}
                          ></ha-selector>
                          <ha-icon-button
                            .path=${mdiPlus}
                            style="${pendingText.state ? '' : 'opacity: 0.4;'}"
                            @click=${() => this._commitStateTextColor(index)}
                          ></ha-icon-button>
                        </div>
                      </div>
                      `})()}
                    `})()}
                    `}
                  </div>
                `
        }
      )}
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              ${this.config?.hide?.temperature ? html`
                <ha-button @click=${() => this._restoreSensor('temperature')} outlined style="flex: 1;">Add Built-in Temperature</ha-button>
              ` : nothing}
              ${this.config?.hide?.state ? html`
                <ha-button @click=${() => this._restoreSensor('state')} outlined style="flex: 1;">Add Built-in State</ha-button>
              ` : nothing}
            </div>
            <ha-button @click=${this._addSensor} outlined style="width: 100%; margin-top: ${this.config?.hide?.temperature || this.config?.hide?.state ? '8px' : '0'};">Add Custom Sensor</ha-button>
          </div>
        </ha-expansion-panel>
        <ha-form
          .hass=${this.hass}
          .data=${data}
          .schema=${schemaAfter}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>

        <ha-expansion-panel outlined>
          <div slot="header" style="display: flex; align-items: center; gap: 8px;">
            <ha-svg-icon .path=${mdiCodeBraces}></ha-svg-icon>
            Custom CSS
          </div>
          <div class="panel-content">
            <div class="styles-editor">
              <ha-code-editor
                mode="yaml"
                autocomplete-entities
                autocomplete-icons
                .hass=${this.hass}
                .value=${this.config.styles ?? ''}
                .configValue=${'styles'}
                @value-changed=${this._stylesChanged}
              ></ha-code-editor>
            </div>
          </div>
        </ha-expansion-panel>

        <div class="editor-footer">
          <ha-button @click=${this._openLink}>
            <ha-svg-icon .path=${mdiBookOpenVariant} slot="icon"></ha-svg-icon>
            All configuration options
          </ha-button>
          <span class="editor-footer__hint">
            Advanced settings only via YAML
          </span>
          <span class="editor-footer__version">v${version} · ${BUILD_TIME}</span>
        </div>
      </div>
    `
  }

  _stylesChanged = (ev: CustomEvent) => {
    const value = (ev.detail as any)?.value
    const copy = cloneDeep(this.config) as any
    if (value === '' || value == null) delete copy.styles
    else copy.styles = value
    fireEvent(this, 'config-changed', { config: copy })
  }
}
