import { EntityAdapter } from '../adapters/types'
import { climateAdapter } from '../adapters/climate'

export interface Setpoint {
  hide?: boolean
}

export type Setpoints = Record<string, Setpoint>

export default function parseSetpoints(
  setpoints: Setpoints | false | undefined,
  attributes: any,
  adapter: EntityAdapter = climateAdapter
) {
  if (setpoints === false) {
    return {}
  }

  if (setpoints) {
    return Object.entries(setpoints).reduce((result, [name, sp]) => {
      if (sp?.hide) return result
      result[name] = attributes?.[name]
      return result
    }, {} as Record<string, any>)
  }

  return adapter.getSetpoints(attributes)
}
