import { HASS, LooseObject } from '../types'

export interface HAState {
  state: string | number
  entity_id: string
  attributes: LooseObject
  last_changed?: string
  last_updated?: string
}

export interface Fault {
  entity: string
  icon?: string
  hide_inactive?: boolean
}

export const STATE_ICONS = {
  auto: 'mdi:radiator',
  cooling: 'mdi:snowflake',
  fan: 'mdi:fan',
  heating: 'mdi:radiator',
  idle: 'mdi:radiator-disabled',
  off: 'mdi:radiator-off',
}

export const MODE_ICONS = {
  // HVAC modes
  auto: 'hass:autorenew',
  cool: 'hass:snowflake',
  dry: 'hass:water-percent',
  fan_only: 'hass:fan',
  heat_cool: 'hass:autorenew',
  heat: 'hass:fire',
  off: 'hass:power',
  // Preset modes
  none: 'mdi:minus-circle-outline',
  eco: 'mdi:leaf',
  away: 'mdi:home-export-outline',
  boost: 'mdi:rocket-launch',
  comfort: 'mdi:sofa',
  home: 'mdi:home',
  sleep: 'mdi:sleep',
  activity: 'mdi:run',
  // Fan modes
  on: 'mdi:fan',
  auto: 'mdi:fan-auto',
  normal: 'mdi:fan',
  low: 'mdi:fan-speed-1',
  medium: 'mdi:fan-speed-2',
  high: 'mdi:fan-speed-3',
  turbo: 'mdi:fan-alert',
  powerful: 'mdi:fan-plus',
  quiet: 'mdi:fan-minus',
  silent: 'mdi:fan-minus',
  // Swing modes
  vertical: 'mdi:arrow-up-down',
  horizontal: 'mdi:arrow-left-right',
  both: 'mdi:arrow-all',
  upper: 'mdi:arrow-up',
  lower: 'mdi:arrow-down',
}

type Icon = string | false | LooseObject
type Name = string | false
export interface HeaderConfig {
  name?: Name
  icon?: Icon
  faults?: Array<Fault>
  toggle?: ToggleConfig
}

export interface HeaderData {
  name?: Name
  icon: Icon
  faults?: Array<Fault>
  toggle?: Toggle | null
}

export interface Toggle {
  entity: HAState
  label: string
  icon: string | false
}
export type ToggleConfig = { entity: string; name?: string | boolean; icon?: string }

export default function parseHeaderConfig(
  config: false | HeaderConfig,
  entity,
  hass: HASS
): false | HeaderData {
  if (config === false) return false

  let name
  if (typeof config?.name === 'string') {
    name = config.name
  } else if (config?.name === false) {
    name = false
  } else {
    name = entity.attributes.friendly_name
  }

  let icon: Icon = entity.attributes.hvac_action ? STATE_ICONS : MODE_ICONS
  if (typeof config?.icon !== 'undefined') {
    icon = config.icon
  }

  return {
    name,
    icon,
    toggle: config?.toggle ? parseToggle(config.toggle, hass) : null,
    faults: parseFaults(config?.faults, hass),
  }
}

function parseToggle(config: ToggleConfig, hass): Toggle | null {
  const entity: HAState = hass.states[config.entity]
  if (!entity) return null

  let label = ''
  if (config?.name === true) {
    label = entity.attributes.friendly_name
  } else {
    label = (config?.name as string) ?? ''
  }

  return { entity, label, icon: config?.icon ?? false }
}

function parseFaults(config: Array<Fault> | undefined, hass: HASS) {
  if (Array.isArray(config)) {
    return config
      .filter(({ entity }) => Boolean(hass.states?.[entity]))
      .map(({ entity, ...rest }: Fault) => ({
        ...rest,
        state: hass.states[entity],
        entity,
      }))
  }
  return []
}
