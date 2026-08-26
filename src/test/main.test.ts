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

  test('a pending setpoint stays with the entity it was made for when the config switches', () => {
    vi.useFakeTimers()
    const performAction = vi.fn()
    const hass = makeHass({
      'climate.a': climateEntity({ entity_id: 'climate.a' }),
      'climate.b': climateEntity({
        entity_id: 'climate.b',
        attributes: { temperature: 30 },
      }),
    })
    hass.performAction = performAction
    const el = createCard({ entity: 'climate.a' }, hass)
    document.body.appendChild(el)

    el.setTemperature(0.5, 'temperature') // 21 -> 21.5, on climate.a
    expect(performAction).not.toHaveBeenCalled() // still inside the 500ms window

    // The visual editor reuses the same element and calls setConfig again when
    // the user picks a different entity — the queued call must not follow it.
    el.setConfig({ entity: 'climate.b' })
    vi.advanceTimersByTime(500)

    expect(performAction).toHaveBeenCalledTimes(1)
    expect(performAction).toHaveBeenCalledWith({
      action: 'climate.set_temperature',
      data: { entity_id: 'climate.a', temperature: 21.5 },
    })
  })

  test('adjusting the new entity right after the swap does not swallow the queued change', () => {
    vi.useFakeTimers()
    const performAction = vi.fn()
    const hass = makeHass({
      'climate.a': climateEntity({ entity_id: 'climate.a' }),
      'climate.b': climateEntity({
        entity_id: 'climate.b',
        attributes: { temperature: 30 },
      }),
    })
    hass.performAction = performAction
    const el = createCard({ entity: 'climate.a' }, hass)
    document.body.appendChild(el)

    el.setTemperature(0.5, 'temperature') // A: 21 -> 21.5, queued
    el.setConfig({ entity: 'climate.b' })
    el.setTemperature(0.5, 'temperature') // B: 30 -> 30.5, would replace the queue
    vi.advanceTimersByTime(500)

    expect(performAction).toHaveBeenCalledTimes(2)
    expect(performAction).toHaveBeenNthCalledWith(1, {
      action: 'climate.set_temperature',
      data: { entity_id: 'climate.a', temperature: 21.5 },
    })
    expect(performAction).toHaveBeenNthCalledWith(2, {
      action: 'climate.set_temperature',
      data: { entity_id: 'climate.b', temperature: 30.5 },
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

describe('dual setpoints cannot be stepped past each other', () => {
  // heat_cool entity: low and high are rendered as two number-style steppers.
  const dualEntity = (low: number, high: number) => ({
    entity_id: 'climate.dual',
    state: 'heat_cool',
    attributes: {
      friendly_name: 'Dual',
      target_temp_low: low,
      target_temp_high: high,
      current_temperature: 22,
      min_temp: 7,
      max_temp: 35,
      hvac_modes: ['off', 'heat_cool'],
    },
  })

  // Returns the four buttons in render order: low+, low-, high+, high-
  const buttons = (low: number, high: number) => {
    const el = createCard(
      { entity: 'climate.dual' },
      makeHass({ 'climate.dual': dualEntity(low, high) })
    )
    const container = document.createElement('div')
    render(el.render(), container)
    const all = Array.from(container.querySelectorAll('.thermostat-trigger'))
    return {
      el,
      lowUp: all[0],
      lowDown: all[1],
      highUp: all[2],
      highDown: all[3],
    }
  }

  test('low cannot be raised to meet high once they are equal', () => {
    // HA Core rejects target_temp_low > target_temp_high outright, so the UI
    // must not offer the step that produces it.
    const b = buttons(24, 24)
    expect(b.lowUp.hasAttribute('disabled')).toBe(true)
    expect(b.highDown.hasAttribute('disabled')).toBe(true)
    // The other direction stays open — the range can still be widened.
    expect(b.lowDown.hasAttribute('disabled')).toBe(false)
    expect(b.highUp.hasAttribute('disabled')).toBe(false)
  })

  test('equal values are allowed — the bound is inclusive, matching HA', () => {
    const b = buttons(23.5, 24)
    expect(b.lowUp.hasAttribute('disabled')).toBe(false) // 23.5 -> 24 is legal
    expect(b.el._stepSetpoint('target_temp_low', 1, 7, 35)).toBe(true)
    expect(b.el._values.target_temp_low).toBe(24)
  })

  test('a well-separated range leaves every button usable', () => {
    const b = buttons(20, 24)
    for (const key of ['lowUp', 'lowDown', 'highUp', 'highDown'] as const) {
      expect(b[key].hasAttribute('disabled')).toBe(false)
    }
  })

  test('an already-invalid range from HA stays escapable, not locked', () => {
    // Some integration reports low > high. The user must be able to correct it.
    const b = buttons(25, 24)
    expect(b.lowUp.hasAttribute('disabled')).toBe(true) // no worse
    expect(b.highDown.hasAttribute('disabled')).toBe(true) // no worse
    expect(b.lowDown.hasAttribute('disabled')).toBe(false) // but recoverable
    expect(b.highUp.hasAttribute('disabled')).toBe(false)
  })

  test('the step function refuses what the disabled button hides', () => {
    // Press-and-hold drives _stepSetpoint directly, so both layers must agree.
    const b = buttons(24, 24)
    expect(b.el._stepSetpoint('target_temp_low', 1, 7, 35)).toBe(false)
    expect(b.el._stepSetpoint('target_temp_high', -1, 7, 35)).toBe(false)
    expect(b.el._stepSetpoint('target_temp_low', -1, 7, 35)).toBe(true)
  })

  test('single-setpoint entities are unaffected — no sibling to clamp against', () => {
    const el = createCard(
      { entity: 'climate.test' },
      makeHass({ 'climate.test': climateEntity() }) // temperature: 21, 7-35
    )
    expect(el._stepSetpoint('temperature', 1, 7, 35)).toBe(true)
    expect(el._values.temperature).toBe(21.5)
  })
})

describe('_trackedStateRefs is pruned when the config stops tracking an entity', () => {
  const sensor = { entity_id: 'sensor.extra', state: '25', attributes: {} }

  test('a sensor dropped from the config loses its stored ref', () => {
    const el = createCard(
      { entity: 'climate.test', sensors: [{ entity: 'sensor.extra' }] },
      makeHass({ 'climate.test': climateEntity(), 'sensor.extra': sensor })
    )
    expect(Object.keys(el._trackedStateRefs).sort()).toEqual([
      'climate.test',
      'sensor.extra',
    ])

    el.setConfig({ entity: 'climate.test' })
    el.hass = makeHass({ 'climate.test': climateEntity(), 'sensor.extra': sensor })

    expect(Object.keys(el._trackedStateRefs)).toEqual(['climate.test'])
  })

  test('swapping one entity for another leaves no stale ref behind', () => {
    const other = { entity_id: 'sensor.other', state: '30', attributes: {} }
    const states = {
      'climate.test': climateEntity(),
      'sensor.extra': sensor,
      'sensor.other': other,
    }
    const el = createCard(
      { entity: 'climate.test', sensors: [{ entity: 'sensor.extra' }] },
      makeHass(states)
    )

    // Same entity count, different membership — a length-based guard would
    // miss this, which is why the prune runs unconditionally.
    el.setConfig({ entity: 'climate.test', sensors: [{ entity: 'sensor.other' }] })
    el.hass = makeHass(states)

    expect(Object.keys(el._trackedStateRefs).sort()).toEqual([
      'climate.test',
      'sensor.other',
    ])
  })
})

describe('_callAction does not leave rejected service calls unhandled', () => {
  test('a rejected performAction is caught and logged, not thrown', async () => {
    const err = new Error('service refused')
    const hass = makeHass({ 'climate.test': climateEntity() })
    hass.performAction = vi.fn().mockRejectedValue(err)
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const el = createCard({ entity: 'climate.test' }, hass)

    expect(() =>
      el._callAction('climate.set_hvac_mode', {
        entity_id: 'climate.test',
        hvac_mode: 'off',
      })
    ).not.toThrow()

    await Promise.resolve()
    await Promise.resolve()

    expect(spy).toHaveBeenCalledWith(
      'simple-thermostat: climate.set_hvac_mode failed',
      err
    )
    spy.mockRestore()
  })

  test('a mock returning undefined (no promise) is tolerated', () => {
    const hass = makeHass({ 'climate.test': climateEntity() })
    hass.performAction = vi.fn() // returns undefined, like the other tests here
    const el = createCard({ entity: 'climate.test' }, hass)

    expect(() =>
      el._callAction('climate.set_hvac_mode', {
        entity_id: 'climate.test',
        hvac_mode: 'off',
      })
    ).not.toThrow()
    expect(hass.performAction).toHaveBeenCalledTimes(1)
  })
})
