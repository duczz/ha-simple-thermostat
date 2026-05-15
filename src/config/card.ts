import { HeaderConfig } from './header'
import { LooseObject, ConfigSensor, TemplatedSensor } from '../types'
import { Service } from './service'
import { Setpoints } from './setpoints'

export enum MODES {
  HVAC = 'hvac',
  FAN = 'fan',
  PRESET = 'preset',
  SWING = 'swing',
}

export type ModeValue = {
  name?: string | false
  icon?: string | false
  include?: boolean
}

export type ModeControlObject = Record<string, boolean | ModeValue> & {
  _name: string
  _hide_when_off: boolean
}

export type ModeControlValue = boolean | ModeControlObject
type ModeControl = {
  hvac: ModeControlValue
  fan: ModeControlValue
  preset: ModeControlValue
  swing: ModeControlValue
}

interface CardConfig {
  entity?: string
  current_value_entity?: string
  current_temperature_entity?: string
  header?: false | HeaderConfig
  control?: false | ModeControl | string[]
  sensors?: false | Array<ConfigSensor & TemplatedSensor>
  version?: 2 | 3
  setpoints?: false | Setpoints
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
      type?: 'table' | 'list'
      labels?: boolean
    }
    step?: 'row' | 'column'
  }
  unit?: boolean | string
  fallback?: string
  styles?: string
  service?: Service
  hide?: {
    temperature?: boolean
    state?: boolean
  }
  label?: {
    temperature?: string
    state?: string
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
