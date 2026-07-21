import { LooseObject } from '../types'
import { EntityAdapter, Range, SetpointService } from './types'

export const humidifierAdapter: EntityAdapter = {
  getSetpoints(attributes: LooseObject): Record<string, any> {
    return {
      humidity: attributes?.humidity,
    }
  },

  getRange(attributes: LooseObject): Range {
    return {
      min: attributes?.min_humidity ?? 0,
      max: attributes?.max_humidity ?? 100,
      step: 1,
    }
  },

  getCurrentValue(attributes: LooseObject) {
    return attributes?.current_humidity ?? null
  },

  getCurrentValueIcon(): string {
    return 'mdi:water-percent'
  },

  getSetpointUnit(): string | undefined {
    return '%'
  },

  getCurrentValueTemplate(): string {
    return '{{current_humidity|formatNumber}}'
  },

  getSetpointService(): SetpointService {
    return { domain: 'humidifier', service: 'set_humidity' }
  },

  getModeService(type: string): string {
    if (type === 'mode') return 'humidifier.set_mode'
    return `humidifier.set_${type}`
  },

  getModePayloadKey(type: string): string {
    if (type === 'mode') return 'mode'
    return type
  },

  getModeAttribute(type: string): string {
    if (type === 'mode') return 'available_modes'
    return `${type}_modes`
  },

  getDefaultControl(): string[] {
    return ['mode']
  },

  getLocalizationDomain(): string {
    return 'humidifier'
  },
}
