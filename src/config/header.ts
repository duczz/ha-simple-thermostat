import { HASS, LooseObject } from '../types'

const CUSTOM_FAN_ICON_PATH =
  'M13 19C13 17.59 13.5 16.3 14.3 15.28C14.17 14.97 14.03 14.65 13.86 14.34C14.26 14 14.57 13.59 14.77 13.11C15.26 13.21 15.78 13.39 16.25 13.67C17.07 13.25 18 13 19 13C20.05 13 21.03 13.27 21.89 13.74C21.95 13.37 22 12.96 22 12.5C22 8.92 18.03 8.13 14.33 10.13C14 9.73 13.59 9.42 13.11 9.22C13.3 8.29 13.74 7.24 14.73 6.75C17.09 5.57 17 2 12.5 2C8.93 2 8.14 5.96 10.13 9.65C9.72 9.97 9.4 10.39 9.21 10.87C8.28 10.68 7.23 10.25 6.73 9.26C5.56 6.89 2 7 2 11.5C2 15.07 5.95 15.85 9.64 13.87C9.96 14.27 10.39 14.59 10.88 14.79C10.68 15.71 10.24 16.75 9.26 17.24C6.9 18.42 7 22 11.5 22C12.31 22 13 21.78 13.5 21.41C13.19 20.67 13 19.86 13 19M12 13C11.43 13 11 12.55 11 12S11.43 11 12 11C12.54 11 13 11.45 13 12S12.54 13 12 13'

const CUSTOM_MODE_ICONS: Record<string, { path: string }> = {
  'st:fan-speed-4': {
    path: 'M16 15V21H19V23H21V15H19V19H18V15H16Z',
  },
  'st:fan-speed-5': {
    path: 'M16 15H21V17H18V18H19C20.11 18 21 18.89 21 20V21C21 22.11 20.11 23 19 23H16V21H19V20H16V15Z',
  },
}

declare global {
  interface Window {
    customIconsets?: Record<
      string,
      (name: string) => Promise<{ path: string; viewBox?: string }>
    >
  }
}

const registerCustomModeIcons = () => {
  window.customIconsets = window.customIconsets || {}
  if (window.customIconsets.st) return

  window.customIconsets.st = async (name: string) => {
    const icon = CUSTOM_MODE_ICONS[`st:${name}`]
    if (!icon) {
      return { path: '' }
    }
    return {
      path: `${CUSTOM_FAN_ICON_PATH}${icon.path}`,
    }
  }
}

registerCustomModeIcons()


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
  auto: 'mdi:fan-auto',
  cool: 'hass:snowflake',
  dry: 'hass:water-percent',
  fan_only: 'hass:fan',
  heat_cool: 'hass:autorenew',
  heat: 'hass:fire',
  off: 'mdi:power',
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
  automatic: 'mdi:fan-auto',
  normal: 'mdi:fan',
  low: 'mdi:fan-speed-1',
  medium: 'mdi:fan-speed-2',
  high: 'mdi:fan-speed-3',
  turbo: 'mdi:fan-alert',
  powerful: 'mdi:fan-plus',
  quiet: 'mdi:fan-minus',
  silent: 'mdi:fan-minus',
  // Fan speed numbers
  '1': 'mdi:fan-speed-1',
  '2': 'mdi:fan-speed-2',
  '3': 'mdi:fan-speed-3',
  '4': 'st:fan-speed-4',
  '5': 'st:fan-speed-5',
  // Swing modes — vertical positions
  vertical: 'mdi:arrow-up-down',
  top: 'mdi:arrow-up',
  'top-middle': 'mdi:arrow-top-right',
  middle: 'mdi:arrow-collapse-vertical',
  'middle-bottom': 'mdi:arrow-bottom-right',
  bottom: 'mdi:arrow-down',
  upper: 'mdi:arrow-up',
  lower: 'mdi:arrow-down',
  // Swing modes — horizontal positions
  horizontal: 'mdi:arrow-left-right',
  left: 'mdi:arrow-left',
  'center-left': 'mdi:arrow-top-left',
  center: 'mdi:arrow-collapse-horizontal',
  'center-right': 'mdi:arrow-top-right',
  right: 'mdi:arrow-right',
  // Swing modes — combined
  both: 'mdi:arrow-all',
  // Vane positions
  swing: 'mdi:arrow-oscillating',
  wide: 'mdi:arrow-expand-horizontal',
  narrow: 'mdi:arrow-collapse-horizontal',
  mid: 'mdi:arrow-collapse-vertical',
  split: 'mdi:arrow-split-vertical',
  // Direction & Oscillation values
  forward: 'mdi:arrow-right-bold',
  reverse: 'mdi:arrow-left-bold',
  'true': 'mdi:arrow-oscillating',
  'false': 'mdi:power',
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
        state: hass.states![entity],
        entity,
      }))
  }
  return []
}
