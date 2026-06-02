import { CardConfig } from './card'

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

  if (
    typeof config?.header === 'object' &&
    config.header?.toggle?.entity
  ) {
    list.add(config.header.toggle.entity)
  }

  const configSensors = config?.entities ?? config?.sensors
  if (Array.isArray(configSensors)) {
    configSensors.forEach((sensor) => {
      if (typeof sensor === 'object' && sensor?.entity) {
        list.add(sensor.entity)
      } else if (typeof sensor === 'string') {
        list.add(sensor)
      }
    })
  }

  return Array.from(list)
}
