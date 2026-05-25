import { html } from 'lit'
import formatNumber from '../formatNumber'
import { LooseObject } from '../types'

interface InfoItemDetails extends LooseObject {
  heading?: string | false
  icon?: string
  unit?: string
  decimals?: number
  type?: string
}

interface InfoItemOptions {
  hide?: boolean
  state: any
  hass: any
  openEntityPopover?
  details: InfoItemDetails
}

export default function renderInfoItem({
  hide = false,
  hass,
  state,
  details,
  openEntityPopover,
}: InfoItemOptions) {
  if (hide || typeof state === 'undefined') return

  const { type, heading, icon, unit, decimals } = details

  let valueCell
  if (type === 'relativetime') {
    valueCell = html`
      <div class="sensor-value">
        <ha-relative-time .datetime=${state} .hass=${hass}></ha-relative-time>
      </div>
    `
  } else if (typeof state === 'object') {
    let value
    let displayUnit = ''

    if (unit !== undefined) {
      // Custom unit provided: use raw state to prevent HA's native format from adding the native unit
      let rawState = state.state
      if (typeof decimals === 'number') {
        rawState = formatNumber(rawState, { decimals })
      }
      value = rawState
      displayUnit = unit ? ` ${unit}` : '' // Allows overriding to empty string to hide unit
    } else {
      value = hass.formatEntityState(state)
    }

    valueCell = html`
      <div
        class="sensor-value clickable"
        @click="${() => openEntityPopover?.(state.entity_id)}"
      >
        ${value}${displayUnit}
      </div>
    `
  } else {
    let value =
      typeof decimals === 'number' ? formatNumber(state, { decimals }) : state
    const displayUnit = unit ? ` ${unit}` : ''
    valueCell = html` <div class="sensor-value">${value}${displayUnit}</div> `
  }

  if (heading === false) {
    return valueCell
  }

  const headingResult = icon
    ? html` <ha-icon .icon=${icon}></ha-icon> `
    : html` ${heading}: `

  return html`
    <div class="sensor-heading">${headingResult}</div>
    ${valueCell}
  `
}
