import { LitElement, html } from 'lit'
import { state, property } from 'lit/decorators.js'
import { mdiBookOpenVariant } from '@mdi/js'

import styles from './styles.css'
import fireEvent from './fireEvent'
import { version } from '../package.json'
import { CardConfig } from './config/card'
import { HASS } from './types'
import { getAdapter, EntityAdapter } from './adapters'

declare const process: { env: { BUILD_TIME: string } }
const BUILD_TIME = process.env.BUILD_TIME

const GithubReadMe =
  'https://github.com/duczz/ha-simple-thermostat/blob/master/README.md'

// structuredClone is a browser-native deep clone (Baseline 2022); all HA-
// supported browsers ship it. JSON.parse(JSON.stringify(...)) is the older
// fallback we used to do.
const cloneDeep = <T>(obj: T): T => structuredClone(obj)

function buildSchema(config: any) {
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
      { name: 'toggle.name', selector: { text: {} } },
      ...(config.header?.toggle?.entity
        ? [{ name: 'toggle.icon', selector: { icon: {} } }]
        : [])
    )
  }

  return [
    {
      name: 'entity',
      required: true,
      selector: { entity: { domain: ['climate', 'fan', 'humidifier'] } },
    },
    {
      name: 'current_value_entity',
      selector: { entity: { domain: ['sensor', 'input_number'] } },
    },
    {
      type: 'expandable',
      title: 'Header',
      schema: [
        { name: 'show_header', selector: { boolean: {} } },
        ...headerSchema,
      ],
    },
    {
      type: 'expandable',
      title: 'Mode Controls',
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
            { name: 'layout.mode.names', selector: { boolean: {} } },
            { name: 'layout.mode.icons', selector: { boolean: {} } },
            { name: 'layout.mode.headings', selector: { boolean: {} } },
          ],
        },
      ],
    },
    {
      type: 'expandable',
      title: 'Layout & Display',
      schema: [
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
                  ],
                },
              },
            },
            {
              name: 'step_size',
              selector: {
                select: {
                  mode: 'dropdown',
                  options: [
                    { value: 'auto', label: 'Auto (from entity)' },
                    { value: '0.1', label: '0.1' },
                    { value: '0.5', label: '0.5' },
                    { value: '1', label: '1' },
                  ],
                },
              },
            },
          ],
        },
        { name: 'fallback', selector: { text: {} } },
        {
          type: 'grid',
          column_min_width: '160px',
          schema: [
            { name: 'hide.temperature', selector: { boolean: {} } },
            { name: 'hide.state', selector: { boolean: {} } },
          ],
        },
        {
          type: 'grid',
          column_min_width: '160px',
          schema: [
            { name: 'label.temperature', selector: { text: {} } },
            { name: 'label.state', selector: { text: {} } },
          ],
        },
        {
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
                  ],
                },
              },
            },
            { name: 'layout.sensors.labels', selector: { boolean: {} } },
          ],
        },
      ],
    },
    {
      type: 'expandable',
      title: 'Interactions',
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
  show_preset: 'Preset mode',
  show_fan: 'Fan mode',
  show_swing: 'Swing mode',
  'layout.mode.names': 'Show mode names',
  'layout.mode.icons': 'Show mode icons',
  'layout.mode.headings': 'Show mode headings',
  decimals: 'Decimals',
  unit: 'Unit',
  'layout.step': 'Step layout',
  step_size: 'Step size',
  fallback: 'Fallback text',
  'hide.temperature': 'Hide temperature',
  'hide.state': 'Hide state',
  'label.temperature': 'Temperature label',
  'label.state': 'State label',
  'layout.sensors.type': 'Sensor layout',
  'layout.sensors.labels': 'Show sensor labels',
  tap_action: 'Tap action',
  hold_action: 'Hold action',
  double_tap_action: 'Double-tap action',
}


function setNested(obj: any, path: string, value: any) {
  const parts = path.split('.')
  let o = obj
  while (parts.length > 1) {
    const p = parts.shift()!
    if (!Object.hasOwn(o, p)) o[p] = {}
    o = o[p]
  }
  o[parts[0]] = value
}

function deleteNested(obj: any, path: string) {
  const parts = path.split('.')
  let o = obj
  while (parts.length > 1) {
    const p = parts.shift()!
    if (!o[p]) return
    o = o[p]
  }
  delete o[parts[0]]
}

function isModeEnabled(
  config: any,
  type: string,
  adapter: EntityAdapter
): boolean {
  const control = config.control
  if (control === false) return false
  if (Array.isArray(control)) return control.includes(type)
  return adapter.getDefaultControl().includes(type)
}

export default class SimpleThermostatEditor extends LitElement {
  @state() config!: CardConfig
  @property({ attribute: false }) hass?: HASS

  static get styles() {
    return styles
  }

  setConfig(config: CardConfig) {
    this.config = config || ({} as CardConfig)
  }

  _openLink() {
    window.open(GithubReadMe, '_blank', 'noopener')
  }

  _buildFormData() {
    const adapter = getAdapter(this.config.entity)
    const header: any =
      this.config.header && typeof this.config.header === 'object'
        ? this.config.header
        : {}
    const data: any = {
      entity: this.config.entity ?? '',
      current_value_entity: this.config.current_value_entity ?? '',
      show_header: this.config.header !== false,
      decimals: this.config.decimals ?? 1,
      unit: this.config.unit ?? '',
      'layout.step': this.config.layout?.step ?? 'row',
      step_size:
        this.config.step_size != null ? String(this.config.step_size) : 'auto',
      fallback: this.config.fallback ?? '',
      'hide.temperature': this.config.hide?.temperature === true,
      'hide.state': this.config.hide?.state === true,
      'label.temperature': this.config.label?.temperature ?? '',
      'label.state': this.config.label?.state ?? '',
      'layout.sensors.type': this.config.layout?.sensors?.type ?? 'table',
      'layout.sensors.labels':
        this.config.layout?.sensors?.labels !== false,
      'layout.mode.names': this.config.layout?.mode?.names !== false,
      'layout.mode.icons': this.config.layout?.mode?.icons !== false,
      'layout.mode.headings': this.config.layout?.mode?.headings === true,
      show_preset: isModeEnabled(this.config, 'preset', adapter),
      show_fan: isModeEnabled(this.config, 'fan', adapter),
      show_swing: isModeEnabled(this.config, 'swing', adapter),
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
    return data
  }

  _applyFormChange(updated: any) {
    const copy = cloneDeep(this.config) as any

    const directPaths = [
      'entity',
      'current_value_entity',
      'decimals',
      'unit',
      'fallback',
      'layout.step',
      'layout.mode.names',
      'layout.mode.icons',
      'layout.mode.headings',
      'layout.sensors.type',
      'layout.sensors.labels',
      'hide.temperature',
      'hide.state',
      'label.temperature',
      'label.state',
      'tap_action',
      'hold_action',
      'double_tap_action',
    ]

    for (const path of directPaths) {
      const newVal = updated[path]
      if (newVal === undefined || newVal === null || newVal === '') {
        deleteNested(copy, path)
      } else {
        setNested(copy, path, newVal)
      }
    }

    if (updated.show_header === false) {
      copy.header = false
    } else {
      if (copy.header === false || copy.header == null) copy.header = {}
      const headerName = updated.name
      const headerIcon = updated.icon
      const toggleEntity = updated['toggle.entity']
      const toggleLabel = updated['toggle.name']
      const toggleIcon = updated['toggle.icon']

      if (headerName) copy.header.name = headerName
      else delete copy.header.name
      if (headerIcon) copy.header.icon = headerIcon
      else delete copy.header.icon

      if (toggleEntity) {
        copy.header.toggle = copy.header.toggle || {}
        copy.header.toggle.entity = toggleEntity
        if (toggleLabel) copy.header.toggle.name = toggleLabel
        else delete copy.header.toggle.name
        if (toggleIcon) copy.header.toggle.icon = toggleIcon
        else delete copy.header.toggle.icon
      } else {
        delete copy.header.toggle
      }
    }

    if (updated.step_size === 'auto' || updated.step_size === '' || updated.step_size == null) {
      delete copy.step_size
    } else {
      const n = Number(updated.step_size)
      copy.step_size = Number.isNaN(n) ? updated.step_size : n
    }

    const adapter = getAdapter(copy.entity)
    const defaultControl = adapter.getDefaultControl()
    const desired = ['hvac']
    if (updated.show_preset) desired.push('preset')
    if (updated.show_fan) desired.push('fan')
    if (updated.show_swing) desired.push('swing')
    const namesOff = updated['layout.mode.names'] === false
    const iconsOff = updated['layout.mode.icons'] === false
    if (namesOff && iconsOff) {
      copy.control = false
    } else if (
      desired.length === defaultControl.length &&
      desired.every((v, i) => v === defaultControl[i])
    ) {
      delete copy.control
    } else {
      copy.control = desired
    }

    return copy
  }

  _valueChanged = (ev: CustomEvent) => {
    const updated = ev.detail.value
    const copy = this._applyFormChange(updated)
    fireEvent(this, 'config-changed', { config: copy })
  }

  _computeLabel = (schema: any) => LABELS[schema.name] ?? schema.name

  render() {
    if (!this.hass || !this.config) return html``

    const schema = buildSchema(this.config)
    const data = this._buildFormData()

    return html`
      <div class="card-config">
        <ha-form
          .hass=${this.hass}
          .data=${data}
          .schema=${schema}
          .computeLabel=${this._computeLabel}
          @value-changed=${this._valueChanged}
        ></ha-form>

        <ha-expansion-panel .header=${'Custom CSS'} outlined>
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
