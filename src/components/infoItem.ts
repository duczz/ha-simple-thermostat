import { html, nothing } from 'lit'
import formatNumber from '../formatNumber'
import { LooseObject } from '../types'
import { getRenderType, renderWidget } from './templated'
import { isObject, hasEntityId, evaluateStateMapping } from '../utils'

interface InfoItemDetails extends LooseObject {
  heading?: string | false
  icon?: string | boolean
  entity?: string
  unit?: string
  decimals?: number
  type?: string
  color?: string
  state_color?: Record<string, string>
  state_text_color?: Record<string, string>
  rawState?: string
}

interface InfoItemOptions {
  hide?: boolean
  state: any
  hass: any
  openEntityPopover?
  details: InfoItemDetails
  layoutType?: string
}

export default function renderInfoItem({
  hide = false,
  hass,
  state,
  details,
  openEntityPopover,
  layoutType,
}: InfoItemOptions) {
  if (hide || typeof state === 'undefined') return

  const { type, heading, icon, unit, decimals, color, text_color, state_color, state_text_color, rawState } = details

  const currentStateStr = rawState ?? (isObject(state) && 'state' in state ? String(state.state) : String(state ?? ''))

  const effectiveColor = evaluateStateMapping(currentStateStr, state_color) ?? color ?? ''
  const effectiveTextColor = evaluateStateMapping(currentStateStr, state_text_color) ?? text_color ?? ''

  const iconStyleAttr = effectiveColor ? `color: ${effectiveColor};` : ''
  const textStyleAttr = effectiveTextColor ? `color: ${effectiveTextColor};` : ''

  let valueCell
  let widgetHtml: any = null
  let isInteractiveWidget = false
  if (type === 'relativetime') {
    valueCell = html`
      <div class="sensor-value">
        <ha-relative-time .datetime=${state} .hass=${hass}></ha-relative-time>
      </div>
    `
  } else {
    // display_as widgets are opt-in via config, but some domains (timer)
    // always render as a widget regardless — see getRenderType.
    const renderAs = (details as any).display_as

    if (hasEntityId(state)) {
      const entityId = state.entity_id
      const [entityDomain] = entityId.split('.')
      const renderType = getRenderType(renderAs, entityDomain)
      widgetHtml = renderWidget(renderType, entityId, entityDomain, state.state, state.attributes, hass)
      // Only switch/slider/select capture their own clicks (toggle/drag/
      // pick) and must not also trigger the popover. The timer countdown is
      // plain text — let the surrounding cell stay clickable like any
      // other value.
      isInteractiveWidget = ['switch', 'slider', 'select'].includes(renderType)
    }

    if (widgetHtml) {
      valueCell = html`<div class="sensor-value">${widgetHtml}</div>`
    } else if (isObject(state)) {
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

      // In pill layouts (chips/badges) the outer pill carries the popover
      // click handler — the value cell must stay non-clickable there,
      // otherwise the event fires twice (value + bubbled pill).
      const clickEntityId = hasEntityId(state) ? state.entity_id : (details.entity || null)
      const isPillMode = layoutType === 'chips' || layoutType === 'badges'
      valueCell = isPillMode
        ? html`<div class="sensor-value" style=${textStyleAttr || null}>${value}${displayUnit}</div>`
        : html`
            <div
              class="sensor-value ${clickEntityId ? 'clickable' : ''}"
              style=${textStyleAttr || null}
              @click="${clickEntityId ? () => openEntityPopover?.(clickEntityId) : nothing}"
            >
              ${value}${displayUnit}
            </div>
          `
    } else {
      let value = typeof decimals === 'number' ? formatNumber(state, { decimals }) : state
      const displayUnit = unit ? ` ${unit}` : ''
      const clickEntityId = details.entity || null
      const isPillMode = layoutType === 'chips' || layoutType === 'badges'
      valueCell = isPillMode
        ? html`<div class="sensor-value" style=${textStyleAttr || null}>${value}${displayUnit}</div>`
        : html`<div class="sensor-value ${clickEntityId ? 'clickable' : ''}" style=${textStyleAttr || null} @click="${clickEntityId ? () => openEntityPopover?.(clickEntityId) : nothing}">${value}${displayUnit}</div>`
    }
  }

  // Determine if this item can open an entity popover
  const isWidget = isInteractiveWidget
  const popoverEntityId = (state as any)?.entity_id ?? details.entity ?? null
  const canOpenPopover = !!popoverEntityId && !!openEntityPopover

  const isPillLayout = layoutType === 'chips' || layoutType === 'badges'
  const chipClickable = canOpenPopover && !isWidget
  const headingClickable = canOpenPopover && (!isPillLayout || isWidget)

  const chipClasses = `chip ${chipClickable ? 'clickable' : ''}`
  const popoverHandler = canOpenPopover ? () => openEntityPopover(popoverEntityId) : undefined
  const popoverKeydownHandler = canOpenPopover ? (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openEntityPopover(popoverEntityId)
    }
  } : undefined

  if (heading === false && !icon) {
    if (layoutType === 'chips') {
      return html`<div
        class=${chipClasses}
        role=${chipClickable ? 'button' : undefined}
        tabindex=${chipClickable ? '0' : undefined}
        @click=${chipClickable ? popoverHandler : nothing}
        @keydown=${chipClickable ? popoverKeydownHandler : nothing}
      >${valueCell}</div>`
    }
    return html`<div class="sensor-value-full">${valueCell}</div>`
  }

  let headingResult
  const hasEntity = details.entity && hass.states[details.entity]
  const hasTextHeading = typeof heading === 'string' && heading.trim() !== '' && !heading.match(/^(mdi|hass):/)
  const hasIconHeading = typeof heading === 'string' && heading.trim() !== '' && !!(heading as string).match(/^(mdi|hass):/)

  let iconResult: any = nothing
  let textResult: any = nothing

  if (icon === false) {
    iconResult = nothing
  } else if (icon) {
    iconResult = html`<ha-icon style=${iconStyleAttr || null} .icon=${icon}></ha-icon>`
  } else if (hasIconHeading) {
    iconResult = html`<ha-icon style=${iconStyleAttr || null} .icon=${heading}></ha-icon>`
  } else if (hasEntity && !hasTextHeading) {
    iconResult = html`<ha-state-icon style=${iconStyleAttr || null} .hass=${hass} .stateObj=${hass.states[details.entity as string]}></ha-state-icon>`
  }

  if (hasTextHeading) {
    const appendColon = layoutType !== 'chips' && layoutType !== 'badges'
    textResult = html` <span class="heading-text" style=${textStyleAttr || null}>${heading}${appendColon ? ':' : ''}</span> `
  }

  headingResult = html`${iconResult}${textResult}`

  const headingClasses = `sensor-heading ${headingClickable ? 'clickable' : ''}`

  const res = html`
    <div 
      class=${headingClasses}
      @click=${headingClickable ? popoverHandler : nothing}
    >${headingResult}</div>
    <div>${valueCell}</div>
  `
  if (layoutType === 'badges') {
    return html`<div
      class="st-badge ${chipClickable ? 'clickable' : ''}"
      role=${chipClickable ? 'button' : undefined}
      tabindex=${chipClickable ? '0' : undefined}
      @click=${chipClickable ? popoverHandler : nothing}
      @keydown=${chipClickable ? popoverKeydownHandler : nothing}
    >
      ${iconResult !== nothing ? iconResult : nothing}
      <div class="sensor-text">
        ${hasTextHeading ? html`<div class="sensor-label">${heading}</div>` : nothing}
        ${valueCell}
      </div>
    </div>`
  }

  if (layoutType === 'chips') {
    return html`<div
      class=${chipClasses}
      role=${chipClickable ? 'button' : undefined}
      tabindex=${chipClickable ? '0' : undefined}
      @click=${chipClickable ? popoverHandler : nothing}
      @keydown=${chipClickable ? popoverKeydownHandler : nothing}
    >${res}</div>`
  }
  return res
}
