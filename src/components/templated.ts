import * as Sqrl from 'squirrelly'
import { html, nothing } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import formatNumber from '../formatNumber'
// Side-effect import: registers the <simple-thermostat-timer-remaining>
// custom element used by renderWidget's 'timer' case below. Imported here
// (not in infoItem.ts) so both v2 (via infoItem.ts importing renderWidget
// from this file) and v3 pick it up from a single place.
import './timerRemaining'

const renderIcon = (icon) => `<ha-icon icon="${icon}"></ha-icon>`

// Templates render via `unsafeHTML` with autoEscape off (see below) — needed
// so filters like `icon`/`css`/`relativetime` can build real HTML tags.
// Entity-derived data (attributes, state) is NOT trustworthy: some
// integrations mirror a name/value from an external cloud/device the user
// doesn't fully control. Escaping it here, before it ever reaches Squirrelly,
// neutralizes injected markup while leaving filter-built HTML (which comes
// from our own code, not entity data) untouched.
function escapeHtmlValue(value: unknown): unknown {
  if (typeof value === 'string') {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
  }
  if (Array.isArray(value)) {
    return value.map(escapeHtmlValue)
  }
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, escapeHtmlValue(v)])
    )
  }
  return value
}

// Optimistic slider values: keep the user's chosen value visible until HA
// reports it back. TTL guards against values that never come back exactly
// (service errors, step rounding by the integration).
export const pendingSliderValues = new Map<string, { value: number; ts: number }>()
const PENDING_SLIDER_TTL_MS = 5000

const RENDERERS = {
  switch: {
    domains: ['switch', 'input_boolean', 'light', 'fan', 'automation', 'siren'],
    service: 'toggle',
  },
  slider: {
    domains: ['input_number', 'number'],
    service: 'set_value',
  },
  select: {
    domains: ['input_select', 'select'],
    service: 'select_option',
  },
}

Sqrl.defaultConfig.autoEscape = false // Turns autoEscaping off — needed for HTML output
Sqrl.filters.define('icon', renderIcon)
Sqrl.filters.define('join', (arr, delimiter = ', ') => arr.join(delimiter))
Sqrl.filters.define('css', (str, css) => {
  const styles = Object.entries(css).reduce((memo, [key, val]) => {
    return `${memo}${key}:${val};`
  }, '')
  return `<span style="${styles}">${str}</span>`
})

Sqrl.filters.define('debug', (data) => {
  try {
    return JSON.stringify(data)
  } catch {
    return `Not able to read valid JSON object from: ${data}`
  }
})

export function wrapSensors(config, content) {
  // Render no `.sensors` element at all when there's nothing to show (e.g. both
  // built-ins hidden and no custom sensors). An empty-but-present `.sensors`
  // otherwise makes `:has(.sensors:not(:empty))` match in browsers that don't
  // treat lit's comment markers as `:empty`, which flips the body layout to
  // space-between (setpoint left-aligned) instead of centered.
  if (!content || (Array.isArray(content) && content.filter(Boolean).length === 0)) {
    return nothing
  }

  const type = config?.layout?.sensors?.type ?? 'table'
  const showLabels = config?.layout?.sensors?.labels ?? true

  let renderedContent = content
  if (type === 'list' && Array.isArray(content)) {
    renderedContent = content.map((item) => html`<div class="sensor-item">${item}</div>`)
  }

  const classes = [
    showLabels ? 'with-labels' : 'without-labels',
    type === 'list' ? 'as-list' : type === 'chips' ? 'as-chips' : type === 'badges' ? 'as-badges' : 'as-table',
  ]
  return html` <div class="sensors ${classes.join(' ')}">${renderedContent}</div> `
}

export function getRenderType(display_as: any, entityDomain: string): string {
  // Auto-detect: a bare state string ("active") is useless for a timer, so
  // always show the live countdown widget regardless of display_as. Unlike
  // switch/slider/select this isn't opt-in — there's no better default.
  if (entityDomain === 'timer') return 'timer'

  if (display_as) {
    const rawRenderAs = String(display_as).trim().toLowerCase()
    if (RENDERERS[rawRenderAs]) {
      if (RENDERERS[rawRenderAs].domains.includes(entityDomain)) {
        return rawRenderAs
      }
    }
  }
  return 'state'
}

export function renderWidget(renderType: string, entityId: string, entityDomain: string, state: any, attributes: any, hass: any) {
  switch (renderType) {
    case 'timer': {
      const stateObj = { state, attributes }
      return html`<simple-thermostat-timer-remaining .stateObj=${stateObj} .hass=${hass}></simple-thermostat-timer-remaining>`
    }
    case 'switch': {
      const isOn = state === 'on' || state === 'true' || state === '1'
      return html`
        <ha-switch
          .checked=${isOn}
          @change=${async (e: Event) => {
          e.stopPropagation()
          try {
            await hass.callService(entityDomain, RENDERERS.switch.service, {
              entity_id: entityId,
            })
          } catch (err) {
            console.error(err)
          }
        }}
        ></ha-switch>
      `
    }
    case 'slider': {
      const pending = pendingSliderValues.get(entityId)
      if (
        pending !== undefined &&
        (Number(state) === pending.value ||
          Date.now() - pending.ts > PENDING_SLIDER_TTL_MS)
      ) {
        pendingSliderValues.delete(entityId)
      }
      const value = pendingSliderValues.get(entityId)?.value ?? Number(state)

      return html`
        <ha-slider
          style="width: 100%; min-width: 120px;"
          .min=${attributes.min ?? 0}
          .max=${attributes.max ?? 100}
          .step=${attributes.step ?? 1}
          .value=${value}
          pin
          @change=${async (e: any) => {
          e.stopPropagation()
          const newValue = Number(e.target.value)
          pendingSliderValues.set(entityId, { value: newValue, ts: Date.now() })
          try {
            await hass.callService(entityDomain, RENDERERS.slider.service, {
              entity_id: entityId,
              value: newValue,
            })
          } catch (err) {
            // Roll back the optimistic value so the slider doesn't stick
            pendingSliderValues.delete(entityId)
            console.error(err)
          }
        }}
        ></ha-slider>
      `
    }
    case 'select': {
      const options = Array.isArray(attributes.options) ? attributes.options : []
      return html`
        <select
          class="st-native-select"
          .value=${state}
          @click=${(e: Event) => e.stopPropagation()}
          @change=${async (e: any) => {
            e.stopPropagation()
            const newValue = e.target.value
            if (newValue && newValue !== state) {
              try {
                await hass.callService(entityDomain, RENDERERS.select.service, {
                  entity_id: entityId,
                  option: newValue,
                })
              } catch (err) {
                console.error(err)
              }
            }
          }}
        >
          ${options.map(
            (opt: string) =>
              html`<option value=${opt} ?selected=${opt === state}>${opt}</option>`
          )}
        </select>
      `
    }
  }
  return null
}

export default function renderTemplated({
  context,
  entityId,
  template = '{{state.text}}',
  label,
  icon = undefined as string | boolean | undefined,
  hass,
  variables = {},
  config,
  localize,
  openEntityPopover,
  display_as = 'state',
}) {
  if (!context) return null

  const { state, attributes } = context

  const domain = entityId?.split('.')?.[0] ?? ''
  const uiPrefix = ['climate', 'fan', 'humidifier'].includes(domain)
    ? `ui.card.${domain}.`
    : 'ui.card.climate.'
  const uiKeys = ['currently', 'operation', 'fan_mode', 'swing_mode', 'preset_mode', 'humidity']
  const translations = Object.fromEntries(
    uiKeys.map((key) => [key, hass.localize?.(`${uiPrefix}${key}`) ?? key])
  )

  // Prepare data to inject as variables into the template. Entity-derived
  // values are escaped (see escapeHtmlValue) — `variables`/`ui` are not,
  // since those come from the dashboard author's own YAML/HA translations,
  // not from a potentially attacker-influenced entity attribute.
  const data = {
    ...(escapeHtmlValue(attributes) as object),
    state: {
      raw: escapeHtmlValue(state),
      text: escapeHtmlValue(localize(state, `component.${domain}.state._.`)),
    },
    ui: translations,
    v: variables,
  }

  // Need to define these inside the function to be able to reach local scope
  Sqrl.filters.define(
    'formatNumber',
    (str, opts = { decimals: config.decimals }) => {
      return String(formatNumber(str, opts))
    }
  )
  Sqrl.filters.define('relativetime', (str) => {
    return `<ha-relative-time fwd-datetime=${str} with-hass></ha-relative-time>`
  })
  Sqrl.filters.define('translate', (str, prefix = '') => {
    // Default prefix + value form the lookup key (prefix is prepended to the
    // value by localize). The old code appended the value to the prefix too,
    // producing a doubled key that never matched.
    return localize(str, prefix || `state_attributes.${domain}.`)
  })

  const render = (template) => {
    try {
      return Sqrl.render(template, data, { useWith: true })
    } catch {
      return `[template error: ${template}]`
    }
  }

  const renderType = getRenderType(display_as, domain)
  const isWidget = ['switch', 'slider', 'select'].includes(renderType)

  const renderSensorValue = () => {
    const widgetHtml = renderWidget(renderType, entityId, domain, state, attributes, hass)
    if (widgetHtml) return widgetHtml

    const value = render(template)
    return unsafeHTML(value)
  }

  const isChips = config?.layout?.sensors?.type === 'chips'
  const isBadges = config?.layout?.sensors?.type === 'badges'
  const isPillLayout = isChips || isBadges
  const pillClass = isChips ? 'chip' : 'st-badge'

  const canOpenPopover = !!entityId && !!openEntityPopover
  const pillClickable = canOpenPopover && !isWidget
  const headingClickable = canOpenPopover && (!isPillLayout || isWidget)

  const popoverHandler = canOpenPopover ? () => openEntityPopover(entityId) : undefined
  const popoverKeydownHandler = canOpenPopover ? (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openEntityPopover(entityId)
    }
  } : undefined

  if (label === false || config?.layout?.sensors?.labels === false) {
    const valueRes = headingClickable ? html`<div 
      class="sensor-value sensor-value-full clickable"
      role="button"
      tabindex="0"
      @click=${popoverHandler}
      @keydown=${popoverKeydownHandler}
    >${renderSensorValue()}</div>` : html`<div class="sensor-value sensor-value-full">${renderSensorValue()}</div>`

    if (isPillLayout) {
      return html`<div
        class="${pillClass} ${pillClickable ? 'clickable' : ''}"
        role=${pillClickable ? 'button' : undefined}
        tabindex=${pillClickable ? '0' : undefined}
        @click=${pillClickable ? popoverHandler : nothing}
        @keydown=${pillClickable ? popoverKeydownHandler : nothing}
      >${valueRes}</div>`
    }
    return valueRes
  }

  const safeLabel = label || '{{friendly_name}}'
  
  let iconStr = ''
  let labelStr = ''
  if (icon === false) {
    if (!safeLabel.match(/^(mdi|hass):.*/)) {
      labelStr = render(safeLabel)
    }
  } else if (icon && typeof icon === 'string') {
    iconStr = renderIcon(icon)
    const renderedLabel = render(safeLabel)
    if (renderedLabel !== icon) {
      labelStr = renderedLabel
    }
  } else {
    if (safeLabel.match(/^(mdi|hass):.*/)) {
      iconStr = renderIcon(safeLabel)
    } else {
      labelStr = render(safeLabel)
    }
  }

  const heading = `${iconStr} ${labelStr}`.trim()
  const finalHeading = heading

  // In non-chip layouts (or if we want the value itself clickable), use headingClickable logic
  const valueRes = headingClickable ? html`<div 
    class="sensor-value clickable"
    role="button"
    tabindex="0"
    @click=${popoverHandler}
    @keydown=${popoverKeydownHandler}
  >${renderSensorValue()}</div>` : html`<div class="sensor-value">${renderSensorValue()}</div>`

  const headingClasses = `sensor-heading ${headingClickable ? 'clickable' : ''}`
  const headingRes = html`<div 
    class="${headingClasses}"
    @click=${headingClickable ? popoverHandler : nothing}
  >${finalHeading ? unsafeHTML(finalHeading) : nothing}</div>`

  const res = html`
    ${headingRes}
    ${valueRes}
  `

  if (isBadges) {
    return html`<div
      class="${pillClass} ${pillClickable ? 'clickable' : ''}"
      role=${pillClickable ? 'button' : undefined}
      tabindex=${pillClickable ? '0' : undefined}
      @click=${pillClickable ? popoverHandler : nothing}
      @keydown=${pillClickable ? popoverKeydownHandler : nothing}
    >
      ${iconStr ? unsafeHTML(iconStr) : nothing}
      <div class="sensor-text">
        ${labelStr ? html`<div class="sensor-label">${unsafeHTML(labelStr)}</div>` : nothing}
        ${valueRes}
      </div>
    </div>`
  }

  if (isChips) {
    return html`<div
      class="${pillClass} ${pillClickable ? 'clickable' : ''}"
      role=${pillClickable ? 'button' : undefined}
      tabindex=${pillClickable ? '0' : undefined}
      @click=${pillClickable ? popoverHandler : nothing}
      @keydown=${pillClickable ? popoverKeydownHandler : nothing}
    >${res}</div>`
  }

  return res
}
