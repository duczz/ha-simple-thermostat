import SimpleThermostat from '../main'

describe('SimpleThermostat state tracking', () => {
  let card: SimpleThermostat

  beforeEach(() => {
    card = new SimpleThermostat()
  })

  test('tracks primary entity and nothing else by default', () => {
    card.config = { entity: 'climate.living_room' }
    const tracked = card._getTrackedEntities()
    expect(tracked).toEqual(['climate.living_room'])
  })

  test('tracks external temperature entities', () => {
    card.config = {
      entity: 'climate.living_room',
      current_value_entity: 'sensor.living_room_temp',
    }
    const tracked = card._getTrackedEntities()
    expect(tracked).toContain('climate.living_room')
    expect(tracked).toContain('sensor.living_room_temp')
    expect(tracked).toHaveLength(2)
  })

  test('tracks header toggle entity', () => {
    card.config = {
      entity: 'climate.living_room',
      header: {
        toggle: {
          entity: 'switch.living_room_ac_power',
        },
      },
    }
    const tracked = card._getTrackedEntities()
    expect(tracked).toContain('climate.living_room')
    expect(tracked).toContain('switch.living_room_ac_power')
    expect(tracked).toHaveLength(2)
  })

  test('tracks configured entities and sensors arrays', () => {
    card.config = {
      entity: 'climate.living_room',
      entities: [
        'sensor.outdoor_temp',
        { entity: 'sensor.window_state' },
      ],
    }
    const tracked = card._getTrackedEntities()
    expect(tracked).toContain('climate.living_room')
    expect(tracked).toContain('sensor.outdoor_temp')
    expect(tracked).toContain('sensor.window_state')
    expect(tracked).toHaveLength(3)
  })

  test('deduplicates entities in the tracking list', () => {
    card.config = {
      entity: 'climate.living_room',
      current_value_entity: 'climate.living_room', // same
      entities: [
        'climate.living_room',
        'sensor.outdoor_temp',
        'sensor.outdoor_temp', // duplicate
      ],
    }
    const tracked = card._getTrackedEntities()
    expect(tracked).toEqual(['climate.living_room', 'sensor.outdoor_temp'])
  })
})
