// @vitest-environment jsdom
import { render } from 'lit'
import SimpleThermostat from '../main'

// main.ts does not register the element itself (that happens in
// simple-thermostat.ts), so we can define it under a test tag here.
const TAG = 'simple-thermostat-test'
if (!customElements.get(TAG)) {
  customElements.define(TAG, SimpleThermostat as any)
}

const climateEntity = (overrides: any = {}) => ({
  entity_id: 'climate.test',
  state: 'heat',
  ...overrides,
  attributes: {
    friendly_name: 'Test Climate',
    temperature: 21,
    current_temperature: 20,
    min_temp: 7,
    max_temp: 35,
    hvac_modes: ['off', 'heat'],
    ...(overrides.attributes ?? {}),
  },
})

const makeHass = (states: Record<string, any>): any => ({
  states,
  localize: () => '',
  formatEntityState: (s: any) => String(s?.state ?? ''),
  formatEntityAttributeValue: () => '',
  config: { unit_system: { temperature: '°C' } },
  locale: { language: 'en', number_format: 'language' },
})

const createCard = (config: any, hass?: any) => {
  const el = document.createElement(TAG) as any
  el.setConfig(config)
  if (hass) el.hass = hass
  return el
}

afterEach(() => {
  vi.useRealTimers()
})

describe('updateFromHass basics', () => {
  test('computes entity, values and modes', () => {
    const el = createCard(
      { entity: 'climate.test' },
      makeHass({ 'climate.test': climateEntity() })
    )
    expect(el.entity).toBeDefined()
    expect(el._values).toEqual({ temperature: 21 })
    expect(el.modes.length).toBe(1)
    expect(el.modes[0].type).toBe('hvac')
  })

  test('does not crash when the entity has no attributes object', () => {
    const bare = { entity_id: 'climate.test', state: 'heat' }
    const el = createCard(
      { entity: 'climate.test' },
      makeHass({ 'climate.test': bare })
    )
    expect(el.entity).toBeDefined()

    // Render must not throw either (header, sensors, setpoints)
    const container = document.createElement('div')
    expect(() => render(el.render(), container)).not.toThrow()
  })

  test('does not crash when hass (with real states) arrives before setConfig', () => {
    // LitElement performs one render pass right after connectedCallback
    // regardless of property changes, so render() can run with `this.config`
    // still undefined if some dashboard/editor code path assigns `hass`
    // before ever calling `setConfig` (found while reviewing the card's
    // lifecycle handling).
    const el = document.createElement(TAG) as any
    el.hass = makeHass({ 'climate.test': climateEntity() }) // setConfig never called
    expect(() => el.render()).not.toThrow()
  })
})

describe('sensors config handling', () => {
  test('sensors wins over the entities alias when both are present', () => {
    const hass = makeHass({
      'climate.test': climateEntity(),
      'sensor.legacy': { entity_id: 'sensor.legacy', state: '1', attributes: {} },
      'sensor.editor': { entity_id: 'sensor.editor', state: '2', attributes: {} },
    })
    const el = createCard(
      {
        entity: 'climate.test',
        entities: [{ entity: 'sensor.legacy' }],
        sensors: [{ entity: 'sensor.editor' }],
      },
      hass
    )
    expect(el.sensors).toHaveLength(1)
    expect(el.sensors[0].entity).toBe('sensor.editor')
  })

  test('showSensors recovers after sensors: false is removed from the config', () => {
    const hass = makeHass({
      'climate.test': climateEntity(),
      'sensor.a': { entity_id: 'sensor.a', state: '1', attributes: {} },
    })
    const el = createCard({ entity: 'climate.test', sensors: false }, hass)
    expect(el.showSensors).toBe(false)

    el.setConfig({ entity: 'climate.test', sensors: [{ entity: 'sensor.a' }] })
    expect(el.showSensors).toBe(true)
    expect(el.sensors).toHaveLength(1)
  })

  test('removing the last sensor clears previously computed sensors', () => {
    const hass = makeHass({
      'climate.test': climateEntity(),
      'sensor.a': { entity_id: 'sensor.a', state: '1', attributes: {} },
    })
    const el = createCard(
      { entity: 'climate.test', sensors: [{ entity: 'sensor.a' }] },
      hass
    )
    expect(el.sensors).toHaveLength(1)

    el.setConfig({ entity: 'climate.test' })
    expect(el.sensors).toHaveLength(0)
  })

  test('v3: display_as is passed through to prepared sensors', () => {
    const hass = makeHass({
      'climate.test': climateEntity(),
      'input_number.fan': {
        entity_id: 'input_number.fan',
        state: '50',
        attributes: { min: 0, max: 100 },
      },
    })
    const el = createCard(
      {
        entity: 'climate.test',
        version: 3,
        sensors: [
          { entity: 'input_number.fan', display_as: 'slider', template: '{{state.raw}}' },
        ],
      },
      hass
    )
    const custom = el.sensors.find((s: any) => s.entityId === 'input_number.fan')
    expect(custom).toBeDefined()
    expect(custom.display_as).toBe('slider')
  })
})

describe('step size', () => {
  test('resets to adapter/default step when step_size is removed', () => {
    const hass = makeHass({ 'climate.test': climateEntity() })
    const el = createCard({ entity: 'climate.test', step_size: 2 }, hass)
    expect(el.stepSize).toBe(2)

    el.setConfig({ entity: 'climate.test' })
    expect(el.stepSize).toBe(0.5)
  })

  test('uses target_temp_step from the entity when present', () => {
    const hass = makeHass({
      'climate.test': climateEntity({ attributes: { target_temp_step: 1 } }),
    })
    const el = createCard({ entity: 'climate.test' }, hass)
    expect(el.stepSize).toBe(1)
  })
})

describe('entity grace period', () => {
  test('keeps the last known state for 5s when the entity disappears', () => {
    vi.useFakeTimers()
    const el = createCard(
      { entity: 'climate.test' },
      makeHass({ 'climate.test': climateEntity() })
    )
    expect(el.entity).toBeDefined()

    el.hass = makeHass({})
    expect(el.entity).toBeDefined() // grace period active

    vi.advanceTimersByTime(SimpleThermostat.ENTITY_GRACE_MS + 1)
    expect(el.entity).toBeUndefined() // error state after grace
  })

  test('cancels the grace timer when the entity reappears', () => {
    vi.useFakeTimers()
    const entity = climateEntity()
    const el = createCard(
      { entity: 'climate.test' },
      makeHass({ 'climate.test': entity })
    )

    el.hass = makeHass({})
    vi.advanceTimersByTime(3000)
    el.hass = makeHass({ 'climate.test': { ...entity } })
    vi.advanceTimersByTime(60000)
    expect(el.entity).toBeDefined()
  })

  test('a never-seen entity errors immediately (no grace)', () => {
    vi.useFakeTimers()
    const el = createCard({ entity: 'climate.missing' }, makeHass({}))
    expect(el.entity).toBeUndefined()
    vi.advanceTimersByTime(60000)
    expect(el.entity).toBeUndefined()
  })
})

describe('#23: pending setTemperature is flushed on disconnect, not dropped', () => {
  test('a change made just before navigating away is still sent to HA', () => {
    vi.useFakeTimers()
    const performAction = vi.fn()
    const hass = makeHass({ 'climate.test': climateEntity() })
    hass.performAction = performAction
    const el = createCard({ entity: 'climate.test' }, hass)
    document.body.appendChild(el) // real DOM attach so dis/connectedCallback fire

    el.setTemperature(0.5, 'temperature')
    expect(performAction).not.toHaveBeenCalled() // debounce (500ms) hasn't fired yet

    el.remove() // disconnectedCallback schedules cleanup after 300ms grace
    vi.advanceTimersByTime(300)

    expect(performAction).toHaveBeenCalledTimes(1)
    expect(performAction).toHaveBeenCalledWith({
      action: 'climate.set_temperature',
      data: { entity_id: 'climate.test', temperature: 21.5 },
    })
  })

  test('the flushed call is not sent a second time when the debounce would have fired', () => {
    vi.useFakeTimers()
    const performAction = vi.fn()
    const hass = makeHass({ 'climate.test': climateEntity() })
    hass.performAction = performAction
    const el = createCard({ entity: 'climate.test' }, hass)
    document.body.appendChild(el)

    el.setTemperature(0.5, 'temperature')
    el.remove()
    vi.advanceTimersByTime(300) // flush fires here

    vi.advanceTimersByTime(500) // original debounce window fully elapses
    expect(performAction).toHaveBeenCalledTimes(1)
  })

  test('reconnecting within the grace period cancels the cleanup — no flush, debounce fires normally', () => {
    vi.useFakeTimers()
    const performAction = vi.fn()
    const hass = makeHass({ 'climate.test': climateEntity() })
    hass.performAction = performAction
    const el = createCard({ entity: 'climate.test' }, hass)
    document.body.appendChild(el)

    el.setTemperature(0.5, 'temperature')
    document.body.removeChild(el)
    document.body.appendChild(el) // reconnect before the 300ms grace elapses

    vi.advanceTimersByTime(300)
    expect(performAction).not.toHaveBeenCalled() // no premature flush

    vi.advanceTimersByTime(500) // normal debounce fires
    expect(performAction).toHaveBeenCalledTimes(1)
  })

  test('no pending change means disconnect does not call the service', () => {
    vi.useFakeTimers()
    const performAction = vi.fn()
    const hass = makeHass({ 'climate.test': climateEntity() })
    hass.performAction = performAction
    const el = createCard({ entity: 'climate.test' }, hass)
    document.body.appendChild(el)

    el.remove()
    vi.advanceTimersByTime(1000)
    expect(performAction).not.toHaveBeenCalled()
  })
})

describe('setpoint steppers while the entity is off', () => {
  // Renders the number-style setpoint and returns the +/- buttons.
  const steppers = (config: any, hass: any) => {
    const el = createCard(config, hass)
    const container = document.createElement('div')
    render(el.render(), container)
    return Array.from(container.querySelectorAll('.thermostat-trigger'))
  }

  test('climate: both buttons are disabled when the entity is off', () => {
    // set_temperature is a no-op on an off climate entity, and the display
    // already shows the off label instead of a value.
    const buttons = steppers(
      { entity: 'climate.test' },
      makeHass({ 'climate.test': climateEntity({ state: 'off' }) })
    )
    expect(buttons.length).toBe(2)
    expect(buttons.every((b) => b.hasAttribute('disabled'))).toBe(true)
  })

  test('climate: buttons stay enabled while the entity is on', () => {
    const buttons = steppers(
      { entity: 'climate.test' },
      makeHass({ 'climate.test': climateEntity() }) // state: heat, 21 °C within 7-35
    )
    expect(buttons.length).toBe(2)
    expect(buttons.some((b) => b.hasAttribute('disabled'))).toBe(false)
  })

  test('fan: buttons stay enabled when off — set_percentage also turns it on', () => {
    const fan = {
      entity_id: 'fan.test',
      state: 'off',
      attributes: { friendly_name: 'Test Fan', percentage: 40 },
    }
    const buttons = steppers(
      { entity: 'fan.test' },
      makeHass({ 'fan.test': fan })
    )
    expect(buttons.length).toBe(2)
    expect(buttons.some((b) => b.hasAttribute('disabled'))).toBe(false)
  })
})
