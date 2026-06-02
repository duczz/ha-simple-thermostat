import { LooseObject } from '../types'
import { EntityAdapter, Range, SetpointService } from './types'

export const fanAdapter: EntityAdapter = {
  getSetpoints(attributes: LooseObject): Record<string, any> {
    return {
      percentage: attributes?.percentage,
    }
  },

  getRange(_attributes: LooseObject): Range {
    return { min: 0, max: 100, step: 1 }
  },

  getCurrentValue(attributes: LooseObject) {
    return attributes?.percentage ?? null
  },

  getCurrentValueTemplate(): string {
    return '{{percentage|formatNumber}}'
  },

  getSetpointService(): SetpointService {
    return { domain: 'fan', service: 'set_percentage' }
  },

  getModeService(type: string): string {
    if (type === 'direction') return 'fan.set_direction'
    if (type === 'oscillating') return 'fan.oscillate'
    return `fan.set_${type}_mode`
  },

  getModePayloadKey(type: string): string {
    if (type === 'direction') return 'direction'
    if (type === 'oscillating') return 'oscillating'
    return `${type}_mode`
  },

  getModeAttribute(type: string): string {
    if (type === 'direction') return 'direction'
    if (type === 'oscillating') return 'oscillating'
    return `${type}_modes`
  },

  getDefaultControl(): string[] {
    return ['preset', 'direction', 'oscillating']
  },

  transformModePayloadValue(type: string, value: string) {
    if (type === 'oscillating') return value === 'true'
    return value
  },

  getLocalizationDomain(): string {
    return 'fan'
  },
}
