import { LooseObject } from '../types'

export interface Range {
  min: number | null
  max: number | null
  step: number | null
}

export interface SetpointService {
  domain: string
  service: string
}

export interface EntityAdapter {
  /** Return the setpoint values for this entity (e.g. {temperature: 22} or {target_temp_low: 18, target_temp_high: 24}). */
  getSetpoints(attributes: LooseObject): Record<string, any>

  /** Return min / max / step for setpoint adjustments. */
  getRange(attributes: LooseObject): Range

  /** Return the current measured value (e.g. current_temperature, current_humidity, percentage). */
  getCurrentValue(attributes: LooseObject): number | string | null

  /** MDI icon shown next to the current value in the dial center (thermometer / humidity / fan). */
  getCurrentValueIcon(): string

  /** Natural setpoint unit for this domain: `'%'` for fan/humidifier, or
   * `undefined` for climate (which uses the HA temperature system unit). */
  getSetpointUnit(): string | undefined

  /** The Squirrelly template snippet to render the current value (used by v3 sensors). */
  getCurrentValueTemplate(): string

  /** Default service when applying a setpoint change. */
  getSetpointService(): SetpointService

  /** Build the service action string for setting a given mode type. */
  getModeService(type: string): string

  /** Build the payload key for the given mode type (e.g. `hvac_mode`, `preset_mode`). */
  getModePayloadKey(type: string): string

  /** Return the entity attribute that lists allowed values for a mode type (e.g. `hvac_modes`, `available_modes`). */
  getModeAttribute(type: string): string

  /** Return the default mode types shown when no `control` config is set. */
  getDefaultControl(): string[]

  /** Optional value transform when sending a mode payload (e.g. fan `oscillating` expects boolean from a 'true'/'false' string). */
  transformModePayloadValue?(type: string, value: string): any

  /** Entity domain used for HA translation keys (`component.<domain>.state.*`, `ui.card.<domain>.*`). */
  getLocalizationDomain(): string
}
