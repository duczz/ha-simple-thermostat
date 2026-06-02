import { html } from 'lit'
import { ControlMode, HVAC_MODES } from '../types'

interface ModeTypeOptions {
  state: string
  entity: any
  hass: any
  mode: ControlMode
  modeOptions
  localize
  setMode
}

export default function renderModeType({
  state,
  entity,
  hass,
  mode: options,
  modeOptions,
  localize,
  setMode,
}: ModeTypeOptions) {
  const { type, hide_when_off, mode = 'none', list, name } = options
  if (list.length === 0 || (hide_when_off && state === HVAC_MODES.OFF)) {
    return null
  }

  const SPECIAL_ATTRIBUTES = ['vane_horizontal', 'vane_vertical', 'oscillating', 'direction']
  const modeAttribute = SPECIAL_ATTRIBUTES.includes(type) ? type : `${type}_mode`

  const maybeRenderName = (name: string | false, value: string) => {
    if (name === false) return null
    if (modeOptions?.names === false) return null

    try {
      if (type === 'hvac') {
        return hass.formatEntityState({ ...entity, state: value })
      }
      return hass.formatEntityAttributeValue(entity, modeAttribute, value)
    } catch {
      return name
    }
  }
  const maybeRenderIcon = (icon: string) => {
    if (!icon) return null
    if (modeOptions?.icons === false) return null
    return html` <ha-icon class="mode-icon" .icon=${icon}></ha-icon> `
  }

  const CLEAN_TITLES: Record<string, string> = {
    hvac: 'Operation',
    fan: 'Speed',
    preset: 'Preset',
    swing: 'Swing',
    vane_horizontal: 'Vane Horizontal',
    vane_vertical: 'Vane Vertical',
    swing_horizontal: 'Swing Horizontal',
    swing_vertical: 'Swing Vertical',
    oscillating: 'Oscillation',
    direction: 'Direction',
  }
  let title = name
  if (!title) {
    title = CLEAN_TITLES[type]
  }
  if (!title) {
    const str = type === 'hvac' ? 'operation' : `${type}_mode`
    title = localize(`ui.card.climate.${str}`)
    if (title === `ui.card.climate.${str}`) {
      const attrKey = `state_attributes.climate.${type === 'hvac' ? 'hvac' : type}_mode`
      title = localize(attrKey)
      if (title === attrKey) {
        title = 'Mode'
      }
    }
  }
  const headings = modeOptions?.headings ?? false

  return html`
    <div class="modes ${headings ? 'heading' : ''}" role="group" aria-label=${title}>
      ${headings ? html` <div class="mode-title">${title}</div> ` : ''}
      ${list.map(
        ({ value, icon, name }) => html`
          <div
            class="mode-item ${value === mode ? 'active ' + mode : ''}"
            role="button"
            tabindex="0"
            aria-pressed=${value === mode ? 'true' : 'false'}
            aria-label=${name || value}
            @click=${() => setMode(type, value)}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setMode(type, value)
              }
            }}
          >
            ${maybeRenderIcon(icon)} ${maybeRenderName(name, value)}
          </div>
        `
      )}
    </div>
  `
}
