import { LitElement, html } from 'lit'
import { property } from 'lit/decorators.js'

// Bare custom element tag (no 'custom:' prefix needed here — this isn't a
// Lovelace card type, just an inline widget). Must match the literal tag
// used in the `html` template in templated.ts's `renderWidget` — Lit
// requires the tag name to be static in the template, so it can't be built
// from this constant there.
export const TIMER_REMAINING_TAG = 'simple-thermostat-timer-remaining'

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

function formatRemaining(totalSeconds: number): string {
  const safeSeconds = Math.max(0, Math.ceil(totalSeconds))
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const seconds = safeSeconds % 60
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${minutes}:${pad(seconds)}`
}

/**
 * Live countdown for `timer.*` entities. HA's `timer` domain doesn't expose
 * a ticking "remaining" value on its own — `finishes_at` is a fixed
 * timestamp attribute while the timer is running, so a live display needs
 * its own interval independent of the card's own render cycle (the card
 * only re-renders when the tracked entity's state object reference changes,
 * which doesn't happen every second while a timer just counts down).
 */
export class SimpleThermostatTimerRemaining extends LitElement {
  @property({ attribute: false }) stateObj?: { state: string; attributes?: Record<string, any> }
  @property({ attribute: false }) hass?: any

  private _tick: ReturnType<typeof setInterval> | null = null

  // Plain text only — inherit whatever styles the surrounding sensor cell
  // already applies, no need for an isolated shadow tree here.
  createRenderRoot() {
    return this
  }

  connectedCallback() {
    super.connectedCallback()
    this._syncTicker()
  }

  disconnectedCallback() {
    this._clearTicker()
    super.disconnectedCallback()
  }

  updated() {
    this._syncTicker()
  }

  private _clearTicker() {
    if (this._tick !== null) {
      clearInterval(this._tick)
      this._tick = null
    }
  }

  private _getEndTime(): number | null {
    const finishesAt = this.stateObj?.attributes?.finishes_at
    if (!finishesAt) return null
    const parsed = Date.parse(finishesAt)
    return Number.isNaN(parsed) ? null : parsed
  }

  private _syncTicker() {
    const isActive = this.stateObj?.state === 'active'
    const endTime = this._getEndTime()
    const hasFutureEnd = endTime !== null && endTime > Date.now()

    if (isActive && hasFutureEnd && this._tick === null) {
      this._tick = setInterval(() => {
        if ((this._getEndTime() ?? 0) <= Date.now()) {
          this._clearTicker()
        }
        this.requestUpdate()
      }, 1000)
      return
    }
    if ((!isActive || !hasFutureEnd) && this._tick !== null) {
      this._clearTicker()
    }
  }

  private _getValue(): string {
    const stateObj = this.stateObj
    if (!stateObj) return ''

    if (stateObj.state === 'active') {
      const endTime = this._getEndTime()
      if (endTime !== null) {
        return formatRemaining((endTime - Date.now()) / 1000)
      }
    }
    if (stateObj.state === 'paused' && stateObj.attributes?.remaining) {
      return String(stateObj.attributes.remaining)
    }
    if (typeof this.hass?.formatEntityState === 'function') {
      return this.hass.formatEntityState(stateObj)
    }
    return stateObj.state ?? ''
  }

  render() {
    return html`${this._getValue()}`
  }
}

// Double-registration guard (HACS + manual resource can load this file
// twice) — same pattern as the main card in simple-thermostat.ts.
if (!customElements.get(TIMER_REMAINING_TAG)) {
  customElements.define(TIMER_REMAINING_TAG, SimpleThermostatTimerRemaining)
}
