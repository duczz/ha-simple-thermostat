export type LooseObject = Record<string, any>

export interface ConfigSensor {
  entity: string
  id?: string
  name?: string
  icon?: string
  attribute?: string
  unit?: string
  decimals?: number
  template?: string
  show?: boolean
  type?: 'relativetime' | 'template'
  color?: string
  text_color?: string
  state_color?: Record<string, string>
  state_text_color?: Record<string, string>
  display_as?: 'state' | 'switch' | 'slider' | 'select'
}

export interface TemplatedSensor {
  template: string
  label?: string | false
  entity?: string
}

export interface PreparedSensor {
  id: string
  label: string | false
  icon?: string | boolean
  entityId: string
  template: string
  show: boolean
  context: LooseObject | undefined
  display_as?: 'state' | 'switch' | 'slider' | 'select'
}

export interface Sensor extends ConfigSensor {
  state: any
}

export interface HASS {
  states?: Record<string, any>
  [key: string]: any
}

export enum HVAC_MODES {
  OFF = 'off',
  HEAT = 'heat',
  COOL = 'cool',
  HEAT_COOL = 'heat_cool',
  AUTO = 'auto',
  DRY = 'dry',
  FAN_ONLY = 'fan_only',
}

export interface ControlModeOption {
  value: string
  name?: string | false
  icon?: string
}
export interface ControlMode {
  type: string
  mode: any
  name?: string | boolean
  hide_when_off?: boolean
  list: Array<ControlModeOption>
}

export interface BannerConfig {
  entity?: string
  attribute?: string
  state?: string | string[]
  state_not?: string | string[]
  below?: number
  above?: number
  text?: string
  type?: 'warning' | 'error' | 'info' | 'success'
  icon?: string
}
