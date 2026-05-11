import { LitElement, html } from 'lit'
import styles from './styles.css'
import fireEvent from './fireEvent'

import { version } from '../package.json'
import { CardConfig } from './config/card'
declare const process: { env: { BUILD_TIME: string } }
const BUILD_TIME = process.env.BUILD_TIME
import { HASS } from './types'

function setValue(obj, path, value) {
  const pathFragments = path.split('.')
  let o = obj
  while (pathFragments.length - 1) {
    const fragment = pathFragments.shift()
    if (!Object.hasOwn(o, fragment)) o[fragment] = {}
    o = o[fragment]
  }
  o[pathFragments[0]] = value
}

function deletePath(obj, path) {
  const parts = path.split('.')
  let o = obj
  while (parts.length > 1) {
    const part = parts.shift()
    if (!o[part]) return
    o = o[part]
  }
  delete o[parts[0]]
}

const NUMERIC_CONFIG_PATHS = ['decimals', 'step_size']

const GithubReadMe =
  'https://github.com/duczz/ha-simple-thermostat/blob/master/README.md'

const stub = {
  header: {},
  layout: { mode: {} },
}

const cloneDeep = (obj) => JSON.parse(JSON.stringify(obj))

export default class SimpleThermostatEditor extends LitElement {
  config!: CardConfig
  hass?: HASS

  static get styles() {
    return styles
  }

  static get properties() {
    return { hass: {}, config: {} }
  }

  setConfig(config) {
    this.config = config || cloneDeep(stub)
  }

  _openLink() {
    window.open(GithubReadMe)
  }

  render() {
    if (!this.hass || !this.config) return html``

    return html`
      <div class="card-config">

        <ha-selector
          .hass=${this.hass}
          .selector=${{ entity: { domain: 'climate' } }}
          .value=${this.config.entity ?? ''}
          .label=${'Entity (required)'}
          .configValue=${'entity'}
          @value-changed=${this.valueChanged}
        ></ha-selector>

        <ha-expansion-panel .header=${'Header'} outlined expanded>
          <div class="panel-content">
            <ha-formfield label="Show header">
              <ha-switch
                .checked=${this.config.header !== false}
                @change=${this.toggleHeader}
              ></ha-switch>
            </ha-formfield>

            ${this.config.header !== false ? html`
              <div class="side-by-side">
                <ha-textfield
                  label="Name (optional)"
                  .value="${this.config.header?.name ?? ''}"
                  .configValue="${'header.name'}"
                  @input="${this.valueChanged}"
                ></ha-textfield>
                <ha-icon-picker
                  label="Icon (optional)"
                  .value="${this.config.header?.icon ?? ''}"
                  .configValue=${'header.icon'}
                  @value-changed=${this.valueChanged}
                ></ha-icon-picker>
              </div>
              <div class="side-by-side">
                <ha-selector
                  .hass=${this.hass}
                  .selector=${{ entity: {} }}
                  .value=${this.config?.header?.toggle?.entity ?? ''}
                  .label=${'Toggle entity (optional)'}
                  .configValue=${'header.toggle.entity'}
                  @value-changed=${this.valueChanged}
                ></ha-selector>
                <ha-textfield
                  label="Toggle label"
                  .value="${this.config?.header?.toggle?.name ?? ''}"
                  .configValue="${'header.toggle.name'}"
                  @input="${this.valueChanged}"
                ></ha-textfield>
              </div>
              ${this.config?.header?.toggle?.entity ? html`
                <ha-icon-picker
                  label="Toggle icon (optional)"
                  .value="${this.config?.header?.toggle?.icon ?? ''}"
                  .configValue=${'header.toggle.icon'}
                  @value-changed=${this.valueChanged}
                ></ha-icon-picker>
              ` : ''}
            ` : ''}
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel .header=${'Mode Controls'} outlined>
          <div class="panel-content">
            <div class="editor-switches">
              <ha-formfield label="Show mode names">
                <ha-switch
                  .checked=${this.config?.layout?.mode?.names !== false}
                  .configValue="${'layout.mode.names'}"
                  @change=${this.valueChanged}
                ></ha-switch>
              </ha-formfield>
              <ha-formfield label="Show mode icons">
                <ha-switch
                  .checked=${this.config?.layout?.mode?.icons !== false}
                  .configValue="${'layout.mode.icons'}"
                  @change=${this.valueChanged}
                ></ha-switch>
              </ha-formfield>
              <ha-formfield label="Show mode headings">
                <ha-switch
                  .checked=${this.config?.layout?.mode?.headings === true}
                  .configValue="${'layout.mode.headings'}"
                  @change=${this.valueChanged}
                ></ha-switch>
              </ha-formfield>
            </div>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel .header=${'Layout & Display'} outlined>
          <div class="panel-content">
            <div class="side-by-side">
              <ha-textfield
                label="Decimals"
                type="number"
                min="0"
                max="5"
                .value="${String(this.config.decimals ?? 1)}"
                .configValue="${'decimals'}"
                @input="${this.valueChanged}"
              ></ha-textfield>
              <ha-textfield
                label="Unit (optional)"
                .value="${this.config.unit ?? ''}"
                .configValue="${'unit'}"
                @input="${this.valueChanged}"
              ></ha-textfield>
            </div>
            <div class="side-by-side">
              <ha-selector
                .hass=${this.hass}
                .selector=${{ select: { options: ['column', 'row'], mode: 'dropdown' } }}
                .value=${this.config.layout?.step ?? 'row'}
                .label=${'Step layout'}
                .configValue=${'layout.step'}
                @value-changed=${this.valueChanged}
              ></ha-selector>
              <ha-selector
                .hass=${this.hass}
                .selector=${{ select: { options: [
                  { value: '', label: 'Auto (from entity)' },
                  { value: '0.1', label: '0.1' },
                  { value: '0.5', label: '0.5' },
                  { value: '1', label: '1' },
                ], mode: 'dropdown' } }}
                .value=${this.config.step_size != null ? String(this.config.step_size) : ''}
                .label=${'Step size'}
                .configValue=${'step_size'}
                @value-changed=${this.valueChanged}
              ></ha-selector>
            </div>
            <ha-textfield
              label="Fallback text (optional)"
              .value="${this.config.fallback ?? ''}"
              .configValue="${'fallback'}"
              @input="${this.valueChanged}"
            ></ha-textfield>

            <p class="section-label">Hide</p>
            <div class="editor-switches">
              <ha-formfield label="Hide temperature">
                <ha-switch
                  .checked=${this.config?.hide?.temperature === true}
                  .configValue="${'hide.temperature'}"
                  @change=${this.valueChanged}
                ></ha-switch>
              </ha-formfield>
              <ha-formfield label="Hide state">
                <ha-switch
                  .checked=${this.config?.hide?.state === true}
                  .configValue="${'hide.state'}"
                  @change=${this.valueChanged}
                ></ha-switch>
              </ha-formfield>
            </div>

            <p class="section-label">Labels</p>
            <div class="side-by-side">
              <ha-textfield
                label="Temperature label"
                .value="${this.config?.label?.temperature ?? ''}"
                .configValue="${'label.temperature'}"
                @input="${this.valueChanged}"
              ></ha-textfield>
              <ha-textfield
                label="State label"
                .value="${this.config?.label?.state ?? ''}"
                .configValue="${'label.state'}"
                @input="${this.valueChanged}"
              ></ha-textfield>
            </div>

            <p class="section-label">Sensors</p>
            <div class="side-by-side">
              <ha-selector
                .hass=${this.hass}
                .selector=${{ select: { options: ['table', 'list'], mode: 'dropdown' } }}
                .value=${this.config?.layout?.sensors?.type ?? 'table'}
                .label=${'Sensor layout'}
                .configValue=${'layout.sensors.type'}
                @value-changed=${this.valueChanged}
              ></ha-selector>
              <ha-formfield label="Show sensor labels">
                <ha-switch
                  .checked=${this.config?.layout?.sensors?.labels !== false}
                  .configValue="${'layout.sensors.labels'}"
                  @change=${this.valueChanged}
                ></ha-switch>
              </ha-formfield>
            </div>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel .header=${'Interactions'} outlined>
          <div class="panel-content">
            <p class="styles-hint">
              Configure how the card responds to tap, hold, and double-tap on the temperature display.
            </p>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ ui_action: { default_action: 'more-info' } }}
              .value=${this.config?.tap_action ?? { action: 'more-info' }}
              .label=${'Tap action'}
              .configValue=${'tap_action'}
              @value-changed=${this.valueChanged}
            ></ha-selector>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ ui_action: { default_action: 'none' } }}
              .value=${this.config?.hold_action ?? { action: 'none' }}
              .label=${'Hold action'}
              .configValue=${'hold_action'}
              @value-changed=${this.valueChanged}
            ></ha-selector>
            <ha-selector
              .hass=${this.hass}
              .selector=${{ ui_action: { default_action: 'none' } }}
              .value=${this.config?.double_tap_action ?? { action: 'none' }}
              .label=${'Double tap action'}
              .configValue=${'double_tap_action'}
              @value-changed=${this.valueChanged}
            ></ha-selector>
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel .header=${'Custom CSS'} outlined>
          <div class="panel-content">
            <p class="styles-hint">
              Use <code>--st-*</code> variables or target any selector inside the card.
            </p>
            <div class="styles-editor">
              <ha-code-editor
                mode="yaml"
                autocomplete-entities
                autocomplete-icons
                .hass=${this.hass}
                .value=${this.config.styles ?? ''}
                .configValue=${'styles'}
                @value-changed=${this.valueChanged}
              ></ha-code-editor>
            </div>
          </div>
        </ha-expansion-panel>

        <div class="editor-footer">
          <ha-button @click=${this._openLink}>
            <ha-icon icon="mdi:book-open-variant" slot="icon"></ha-icon>
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

  valueChanged(ev) {
    if (!this.config || !this.hass) return
    const { target } = ev
    const copy = cloneDeep(this.config)
    if (target.configValue) {
      let value =
        target.checked !== undefined
          ? target.checked
          : ev.detail?.value !== undefined
          ? ev.detail.value
          : target.value
      if (value === '' || value === undefined) {
        deletePath(copy, target.configValue)
      } else {
        if (typeof value === 'string' && NUMERIC_CONFIG_PATHS.includes(target.configValue)) {
          const num = Number(value)
          if (!Number.isNaN(num)) value = num
        }
        setValue(copy, target.configValue, value)
      }
    }
    // Auto-hide mode buttons when both names and icons are disabled
    if (['layout.mode.names', 'layout.mode.icons'].includes(target.configValue)) {
      const namesOff = copy?.layout?.mode?.names === false
      const iconsOff = copy?.layout?.mode?.icons === false
      if (namesOff && iconsOff) {
        copy.control = false
      } else if (copy.control === false) {
        delete copy.control
      }
    }

    fireEvent(this, 'config-changed', { config: copy })
  }

  toggleControl(ev) {
    const copy = cloneDeep(this.config)
    if (ev.target.checked) {
      delete copy.control
    } else {
      copy.control = false
    }
    fireEvent(this, 'config-changed', { config: copy })
  }

  toggleHeader(ev) {
    const copy = cloneDeep(this.config)
    copy.header = ev.target.checked ? {} : false
    fireEvent(this, 'config-changed', { config: copy })
  }
}
