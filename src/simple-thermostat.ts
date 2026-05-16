import { name as CARD_NAME, version } from '../package.json'
import SimpleThermostatEditor from './editor'
import SimpleThermostat from './main'

// Guard against double-registration when the file is loaded multiple times
// (e.g. HACS + a manual `resources:` entry). Without this, the second load
// throws `NotSupportedError: ... already used with this registry`.
if (!customElements.get(CARD_NAME)) {
  customElements.define(CARD_NAME, SimpleThermostat)
}
if (!customElements.get(`${CARD_NAME}-editor`)) {
  customElements.define(`${CARD_NAME}-editor`, SimpleThermostatEditor)
}

console.info(
  `%c SIMPLE-THERMOSTAT %c v${version} `,
  'color: white; background: #6f4cff; font-weight: 700; padding: 2px 6px; border-radius: 3px 0 0 3px;',
  'color: #6f4cff; background: #1f1f1f; font-weight: 700; padding: 2px 6px; border-radius: 0 3px 3px 0;'
)

const w = window as any
w.customCards = w.customCards || []
// `customCards.type` is the bare element tag — NOT prefixed with `custom:`.
// HA's <hui-card-picker> uses this directly as the element name to render
// the preview tile; the `custom:` prefix would fail silently.
if (!w.customCards.find((c: any) => c.type === CARD_NAME)) {
  w.customCards.push({
    type: CARD_NAME,
    name: 'Simple Thermostat',
    preview: false,
    description: 'A different take on the thermostat card',
    documentationURL: 'https://github.com/duczz/ha-simple-thermostat',
  })
}
