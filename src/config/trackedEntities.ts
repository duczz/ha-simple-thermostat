import { CardConfig } from './card'
import { isObject } from '../utils'

export function getTrackedEntities(config: CardConfig): string[] {
  const list = new Set<string>()
  if (config?.entity) {
    list.add(config.entity)
  }

  const extTempId =
    config?.current_value_entity ?? config?.current_temperature_entity
  if (extTempId) {
    list.add(extTempId)
  }

  if (isObject(config?.header)) {
    if (
      isObject(config.header?.toggle) &&
      typeof config.header.toggle.entity === 'string'
    ) {
      list.add(config.header.toggle.entity)
    }
    if (Array.isArray(config.header?.faults)) {
      config.header.faults.forEach((fault) => {
        if (isObject(fault) && typeof fault.entity === 'string') {
          list.add(fault.entity)
        }
      })
    }
  }

  if (isObject(config?.control)) {
    Object.values(config.control).forEach((modeControl) => {
      if (isObject(modeControl) && typeof modeControl.entity === 'string') {
        list.add(modeControl.entity)
      }
    })
  }

  // `sensors` wins over the `entities` alias when both are present — the
  // visual editor writes `sensors`, so its changes must take effect even if
  // a legacy `entities` key is still in the YAML (same order as main.ts).
  const configSensors = config?.sensors ?? config?.entities
  if (Array.isArray(configSensors)) {
    configSensors.forEach((sensor) => {
      if (isObject(sensor) && typeof sensor.entity === 'string') {
        list.add(sensor.entity)
      } else if (typeof sensor === 'string') {
        list.add(sensor)
      }
    })
  }

  if (Array.isArray(config?.banners)) {
    config.banners.forEach((banner) => {
      if (typeof (banner as any).entity === 'string') list.add((banner as any).entity)
    })
  }

  return Array.from(list)
}
