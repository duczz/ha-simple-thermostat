import { HeaderConfig } from './header'
import { LooseObject, ConfigSensor, TemplatedSensor, BannerConfig } from '../types'
import { Service } from './service'
import { Setpoints } from './setpoints'

export enum MODES {
  HVAC = 'hvac',
  FAN = 'fan',
  PRESET = 'preset',
  SWING = 'swing',
  SWING_HORIZONTAL = 'swing_horizontal',
  SWING_VERTICAL = 'swing_vertical',
  VANE_HORIZONTAL = 'vane_horizontal',
  VANE_VERTICAL = 'vane_vertical',
}

export type ModeValue = {
  name?: string | false
  icon?: string | false
  include?: boolean
}

export type ModeControlObject = Record<string, boolean | ModeValue> & {
  _name: string
  _hide_when_off: boolean
  entity?: string
}

export type ModeControlValue = boolean | ModeControlObject
type ModeControl = {
  hvac: ModeControlValue
  fan: ModeControlValue
  preset: ModeControlValue
  swing: ModeControlValue
  swing_horizontal: ModeControlValue
  swing_vertical: ModeControlValue
  vane_horizontal: ModeControlValue
  vane_vertical: ModeControlValue
}

interface CardConfig {
  entity?: string
  current_value_entity?: string
  current_temperature_entity?: string
  header?: false | HeaderConfig
  control?: false | ModeControl | string[]
  sensors?: false | Array<ConfigSensor & TemplatedSensor>
  entities?: false | Array<ConfigSensor & TemplatedSensor>
  version?: 2 | 3
  banners?: false | Array<BannerConfig>
  setpoints?: false | Setpoints
  hide_setpoint?: boolean
  // 'number' (default): big value with +/- buttons. 'dial': the native HA
  // circular slider (ha-control-circular-slider) — drag the ring to set the
  // target. Falls back to 'number' if the element isn't available.
  setpoint_style?: 'number' | 'dial'
  // Override the dial's center action label per hvac_action (e.g.
  // { heating: 'Heizt' }) or per entity state as a fallback. Absent keys fall
  // back to Home Assistant's own translation.
  dial_action_labels?: Record<string, string>
  decimals?: number
  step_size?: number
  variables?: LooseObject
  layout?: {
    mode?: {
      names?: boolean
      icons?: boolean
      headings?: boolean
    }
    sensors?: {
      type?: 'table' | 'list' | 'chips' | 'badges'
      labels?: boolean
    }
    step?: 'row' | 'column' | 'right'
  }
  unit?: boolean | string
  fallback?: string
  styles?: string
  service?: Service
  hide?: {
    temperature?: boolean
    state?: boolean
  }
  icon?: {
    temperature?: string
    state?: string
  }
  label?: {
    temperature?: string
    state?: string
  }
  color?: {
    temperature?: string
    state?: string
    [key: string]: string | undefined
  }
  text_color?: {
    temperature?: string
    state?: string
    [key: string]: string | undefined
  }
  state_color?: {
    temperature?: Record<string, string>
    state?: Record<string, string>
    [key: string]: Record<string, string> | undefined
  }
  state_text_color?: {
    temperature?: Record<string, string>
    state?: Record<string, string>
    [key: string]: Record<string, string> | undefined
  }
  tap_action?: TapAction
  hold_action?: TapAction
  double_tap_action?: TapAction
}

export type TapAction =
  | { action: 'more-info' }
  | { action: 'none' }
  | { action: 'navigate'; navigation_path: string }
  | { action: 'url'; url_path: string }
  | { action: 'toggle' }
  | { action: 'call-service'; service: string; service_data?: LooseObject }

export { CardConfig }
