import { getTrackedEntities } from '../config/trackedEntities'

describe('getTrackedEntities helper', () => {
  test('tracks primary entity and nothing else by default', () => {
    const config = { entity: 'climate.living_room' }
    const tracked = getTrackedEntities(config)
    expect(tracked).toEqual(['climate.living_room'])
  })

  test('tracks external temperature entities', () => {
    const config = {
      entity: 'climate.living_room',
      current_value_entity: 'sensor.living_room_temp',
    }
    const tracked = getTrackedEntities(config)
    expect(tracked).toContain('climate.living_room')
    expect(tracked).toContain('sensor.living_room_temp')
    expect(tracked).toHaveLength(2)
  })

  test('tracks header toggle entity', () => {
    const config = {
      entity: 'climate.living_room',
      header: {
        toggle: {
          entity: 'switch.living_room_ac_power',
        },
      },
    }
    const tracked = getTrackedEntities(config)
    expect(tracked).toContain('climate.living_room')
    expect(tracked).toContain('switch.living_room_ac_power')
    expect(tracked).toHaveLength(2)
  })

  test('tracks configured entities and sensors arrays', () => {
    const config = {
      entity: 'climate.living_room',
      sensors: [
        { entity: 'sensor.outdoor_temp' },
        { entity: 'sensor.window_state' },
      ],
    } as any
    const tracked = getTrackedEntities(config)
    expect(tracked).toContain('climate.living_room')
    expect(tracked).toContain('sensor.outdoor_temp')
    expect(tracked).toContain('sensor.window_state')
    expect(tracked).toHaveLength(3)
  })

  test('tracks header fault entities', () => {
    const config = {
      entity: 'climate.living_room',
      header: {
        faults: [
          { entity: 'binary_sensor.fault_1' },
          { entity: 'binary_sensor.fault_2', icon: 'mdi:alert', hide_inactive: true },
        ],
      },
    } as any
    const tracked = getTrackedEntities(config)
    expect(tracked).toContain('climate.living_room')
    expect(tracked).toContain('binary_sensor.fault_1')
    expect(tracked).toContain('binary_sensor.fault_2')
    expect(tracked).toHaveLength(3)
  })

  test('tracks banner entities', () => {
    const config = {
      entity: 'climate.living_room',
      banners: [
        { entity: 'binary_sensor.window', state: 'on' },
        { attribute: 'battery_level', below: 20 },
      ],
    } as any
    const tracked = getTrackedEntities(config)
    expect(tracked).toContain('binary_sensor.window')
    expect(tracked).toHaveLength(2)
  })

  test('sensors wins over entities alias when both are present', () => {
    const config = {
      entity: 'climate.living_room',
      entities: [{ entity: 'sensor.legacy' }],
      sensors: [{ entity: 'sensor.editor_managed' }],
    } as any
    const tracked = getTrackedEntities(config)
    expect(tracked).toContain('sensor.editor_managed')
    expect(tracked).not.toContain('sensor.legacy')
  })

  test('deduplicates entities in the tracking list', () => {
    const config = {
      entity: 'climate.living_room',
      current_value_entity: 'climate.living_room', // same
      sensors: [
        { entity: 'climate.living_room' },
        { entity: 'sensor.outdoor_temp' },
        { entity: 'sensor.outdoor_temp' }, // duplicate
      ],
    } as any
    const tracked = getTrackedEntities(config)
    expect(tracked).toEqual(['climate.living_room', 'sensor.outdoor_temp'])
  })
})
