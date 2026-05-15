import { EntityAdapter } from '../adapters/types'
import { climateAdapter } from '../adapters/climate'

export interface Service {
  domain: string
  service: string
  data?: {
    [key: string]: any
  }
}

export default function parseService(
  config: false | Service,
  adapter: EntityAdapter = climateAdapter
): Service {
  if (!config) {
    return adapter.getSetpointService()
  }
  return config
}
