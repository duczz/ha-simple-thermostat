import { html, nothing } from 'lit'
import { CardConfig } from '../config/card'
import { BannerConfig, HASS, LooseObject } from '../types'

interface RenderBannersArgs {
  config: CardConfig
  hass: HASS
  entity: LooseObject
}

export default function renderBanners({ config, hass, entity }: RenderBannersArgs) {
  const activeBanners: Array<BannerConfig> = []

  // Benutzerdefinierte Banner auswerten
  if (Array.isArray(config.banners)) {
    for (const banner of config.banners) {
      const targetEntityId = banner.entity || config.entity
      if (!targetEntityId) continue

      const stateObj = hass.states?.[targetEntityId]
      if (!stateObj) continue // Fail-safe für nicht existierende Entitäten

      // Wert extrahieren (State oder Attribut)
      let rawValue = banner.attribute ? stateObj.attributes?.[banner.attribute] : stateObj.state
      if (rawValue === undefined || rawValue === null) continue

      let trigger = true
      const numValue = Number(rawValue)

      // AND-Verknüpfung aller definierten Bedingungen
      if (banner.state !== undefined) {
        const states = Array.isArray(banner.state) ? banner.state : [banner.state]
        if (!states.map(String).includes(String(rawValue))) trigger = false
      }

      if (banner.state_not !== undefined) {
        const notStates = Array.isArray(banner.state_not) ? banner.state_not : [banner.state_not]
        if (notStates.map(String).includes(String(rawValue))) trigger = false
      }

      // Numerische Bedingungen gelten bei nicht-numerischem Wert (z.B.
      // "unavailable") als NICHT erfüllt — sonst feuert ein Battery-Banner
      // sobald das Attribut unavailable wird.
      if (banner.below !== undefined && (Number.isNaN(numValue) || numValue >= banner.below)) trigger = false
      if (banner.above !== undefined && (Number.isNaN(numValue) || numValue <= banner.above)) trigger = false

      // Wenn alle definierten Bedingungen erfüllt sind
      if (trigger) {
        // Dynamischen Text-Platzhalter {{value}} ersetzen (String() schützt
        // vor numerischen YAML-Werten wie `text: 5`)
        const rawText = String(banner.text || banner.entity || targetEntityId)
        const displayText = rawText.replace(/\{\{value\}\}/g, String(rawValue))

        activeBanners.push({
          ...banner,
          text: displayText,
        })
      }
    }
  }

  if (activeBanners.length === 0) return nothing

  // Banners render in configured order (which the visual editor's ▲/▼ buttons
  // control) — no automatic severity sorting, so a manual reorder is honoured.

  return html`
    <div class="st-banners">
      ${activeBanners.map(
    (banner) => html`
          <div class="st-banner st-banner-${banner.type || 'warning'}">
            ${banner.icon ? html`<ha-icon .icon=${banner.icon}></ha-icon>` : nothing}
            <span>${banner.text}</span>
          </div>
        `
  )}
    </div>
  `
}
