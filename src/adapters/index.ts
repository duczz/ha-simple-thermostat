import { EntityAdapter } from './types'
import { climateAdapter } from './climate'
import { fanAdapter } from './fan'
import { humidifierAdapter } from './humidifier'

const adapters: Record<string, EntityAdapter> = {
  climate: climateAdapter,
  fan: fanAdapter,
  humidifier: humidifierAdapter,
}

/** Returns the adapter for the given entity domain, falling back to climate. */
export function getAdapter(entityId: string | undefined): EntityAdapter {
  if (!entityId) return climateAdapter
  const domain = entityId.split('.')[0]
  return adapters[domain] ?? climateAdapter
}

export type { EntityAdapter, Range, SetpointService } from './types'
