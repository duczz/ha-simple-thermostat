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
  const {
    state,
    attributes: { hvac_action: action },
  } = entity

  const adapter = getAdapter(config?.entity)
  const adapterCurrent = adapter.getCurrentValue(entity.attributes)

  // External temperature entity override (e.g. a room thermometer)
  const extTempId =
    config?.current_value_entity ?? config?.current_temperature_entity
  const extTempState = extTempId ? hass.states?.[extTempId]?.state : undefined
  const current = extTempState !== undefined ? extTempState : adapterCurrent

  const showLabels = config?.layout?.sensors?.labels ?? true
  const domain = adapter.getLocalizationDomain()
  let stateString =
    hass.formatEntityState?.(entity) ??
    localize(state, `component.${domain}.state._.`)
  if (action) {
    const actionLabel =
      localize(
        action,
        `component.${domain}.entity_component._.state_attributes.hvac_action.state.`
      ) || localize(action, `state_attributes.${domain}.hvac_action.`)
    stateString = [actionLabel, ` (${stateString})`].join('')
  }
  const sensorHtml = [
    renderInfoItem({
      hide: _hide.temperature,
      state: `${formatNumber(current, config)}${unit || ''}`,
      hass,
      details: {
        heading: showLabels
          ? config?.label?.temperature ?? localize(`ui.card.${domain}.currently`)
          : false,
      },
    }),
    renderInfoItem({
      hide: _hide.state,
      state: stateString,
      hass,
      details: {
        heading: showLabels
          ? config?.label?.state ??
            localize('ui.panel.lovelace.editor.card.generic.state')
          : false,
      },
    }),
    ...sensors.map(({ name, state, ...rest }) => {
      return renderInfoItem({
        state,
        hass,
        localize,
        openEntityPopover,
        details: {
          ...rest,
          heading: showLabels && name,
        },
      })
    }),
  ].filter(Boolean)

  return wrapSensors(config, sensorHtml)
}
