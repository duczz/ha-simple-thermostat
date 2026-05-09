import { LitElement, html } from 'lit'
import styles from './styles.css'
import fireEvent from './fireEvent'

import { CardConfig } from './config/card'
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
    if (!this.hass) return html``

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
            ` : ''}
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel .header=${'Mode Controls'} outlined>
          <div class="panel-content">
            <ha-formfield label="Show mode controls">
              <ha-switch
                .checked=${this.config.control !== false}
                @change=${this.toggleControl}
              ></ha-switch>
            </ha-formfield>

            ${this.config.control !== false ? html`
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
                    .checked=${this.config?.layout?.mode?.headings !== false}
                    .configValue="${'layout.mode.headings'}"
                    @change=${this.valueChanged}
                  ></ha-switch>
                </ha-formfield>
              </div>
            ` : ''}
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel .header=${'Layout & Display'} outlined>
          <div class="panel-content">
            <div class="side-by-side">
              <ha-selector
                .hass=${this.hass}
                .selector=${{ select: { options: ['0', '1'], mode: 'dropdown' } }}
                .value=${String(this.config.decimals ?? 1)}
                .label=${'Decimals'}
                .configValue=${'decimals'}
                @value-changed=${this.valueChanged}
              ></ha-selector>
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
                .selector=${{ select: { options: ['0.5', '1'], mode: 'dropdown' } }}
                .value=${String(this.config.step_size ?? 0.5)}
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
          </div>
        </ha-expansion-panel>

        <ha-expansion-panel .header=${'Custom CSS'} outlined expanded>
          <div class="panel-content">
            <p class="styles-hint">
              Use <code>--st-*</code> variables or target any selector inside the card.
            </p>
            <textarea
              class="styles-textarea"
              .value=${this.config.styles ?? ''}
              placeholder="ha-card { --st-spacing: 8px; }"
              rows="6"
              spellcheck="false"
              @input=${this.cssChanged}
              @keydown=${this._handleCssKeydown}
            ></textarea>
          </div>
        </ha-expansion-panel>

        <div class="editor-footer">
          <ha-button @click=${this._openLink}>
            <ha-icon icon="mdi:book-open-variant" slot="icon"></ha-icon>
            All configuration options
          </ha-button>
          <span class="editor-footer__hint">
            Sensors, faults &amp; advanced options require the code editor
          </span>
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
    fireEvent(this, 'config-changed', { config: copy })
  }

  _handleCssKeydown(ev: KeyboardEvent) {
    const ta = ev.target as HTMLTextAreaElement
    const { selectionStart, selectionEnd, value } = ta
    if (ev.key === 'Tab' && !ev.shiftKey) {
      ev.preventDefault()
      ta.value = value.substring(0, selectionStart) + '  ' + value.substring(selectionEnd)
      ta.selectionStart = ta.selectionEnd = selectionStart + 2
      ta.dispatchEvent(new Event('input', { bubbles: true }))
    } else if (ev.key === 'Tab' && ev.shiftKey) {
      ev.preventDefault()
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
      const twoSpaces = value.substring(lineStart, lineStart + 2)
      if (twoSpaces === '  ') {
        ta.value = value.substring(0, lineStart) + value.substring(lineStart + 2)
        ta.selectionStart = ta.selectionEnd = Math.max(lineStart, selectionStart - 2)
        ta.dispatchEvent(new Event('input', { bubbles: true }))
      }
    } else if (ev.key === 'Enter') {
      ev.preventDefault()
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1
      const indent = value.substring(lineStart).match(/^(\s*)/)?.[1] ?? ''
      const newText = '\n' + indent
      ta.value = value.substring(0, selectionStart) + newText + value.substring(selectionEnd)
      ta.selectionStart = ta.selectionEnd = selectionStart + newText.length
      ta.dispatchEvent(new Event('input', { bubbles: true }))
    }
  }

  cssChanged(ev) {
    if (!this.config || !this.hass) return
    const copy = cloneDeep(this.config)
    const value = ev.target.value ?? ''
    if (!value) {
      delete copy.styles
    } else {
      copy.styles = value
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
