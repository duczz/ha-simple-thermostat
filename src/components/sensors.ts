import { html } from 'lit'
import formatNumber from '../formatNumber'
import renderInfoItem from './infoItem'
import { wrapSensors } from './templated'
import { getAdapter } from '../adapters'

export default function renderSensors({
  _hide,
  entity,
  unit,
  hass,
  sensors,
  config,
  localize,
  openEntityPopover,
}) {
  const action = entity.attributes?.hvac_action

  const adapter = getAdapter(config?.entity)
  const adapterCurrent = adapter.getCurrentValue(entity.attributes ?? {})

  // External temperature entity override (e.g. a room thermometer)
  const extTempId =
    config?.current_value_entity ?? config?.current_temperature_entity
  const extTempState = extTempId ? hass.states?.[extTempId]?.state : undefined
  const current = extTempState !== undefined ? extTempState : adapterCurrent

  const showLabels = config?.layout?.sensors?.labels ?? true
  const domain = adapter.getLocalizationDomain()
  let stateString = hass.formatEntityState(entity)
  if (action) {
    const actionLabel = hass.formatEntityAttributeValue(entity, 'hvac_action', action)
    if (actionLabel && actionLabel.toLowerCase() !== stateString.toLowerCase()) {
      stateString = [actionLabel, ` (${stateString})`].join('')
    } else {
      stateString = actionLabel || stateString
    }
  }
  const sensorHtml = [
    renderInfoItem({
      hide: _hide.temperature,
      // Pass hass.locale so the current value uses the same decimal
      // separator as the setpoint display (comma locales)
      state: `${formatNumber(current, { ...config, locale: hass?.locale })}${unit || ''}`,
      hass,
      openEntityPopover,
      layoutType: config?.layout?.sensors?.type,
      details: {
        entity: config.entity,
        heading: showLabels
          ? config?.label?.temperature ?? localize(`ui.card.${domain}.currently`)
          : false,
        icon: config?.icon?.temperature,
        color: config?.color?.temperature,
        text_color: (config as any)?.text_color?.temperature,
        state_color: (config as any)?.state_color?.temperature,
        state_text_color: (config as any)?.state_text_color?.temperature,
        rawState: String(current),
      },
    }),
    renderInfoItem({
      hide: _hide.state,
      state: stateString,
      hass,
      openEntityPopover,
      layoutType: config?.layout?.sensors?.type,
      details: {
        entity: config.entity,
        heading: showLabels
          ? config?.label?.state ??
          localize('ui.panel.lovelace.editor.card.generic.state')
          : false,
        icon: config?.icon?.state,
        color: config?.color?.state,
        text_color: (config as any)?.text_color?.state,
        state_color: (config as any)?.state_color?.state,
        state_text_color: (config as any)?.state_text_color?.state,
        rawState: entity.state,
      },
    }),
    ...sensors.map(({ name, state, ...rest }) => {
      return renderInfoItem({
        state,
        hass,
        openEntityPopover,
        layoutType: config?.layout?.sensors?.type,
        details: {
          ...rest,
          heading: showLabels && name,
        },
      })
    }),
  ].filter(Boolean)

  return wrapSensors(config, sensorHtml)
}
