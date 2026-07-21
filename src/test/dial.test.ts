// @vitest-environment jsdom
import { render } from 'lit'
import SimpleThermostat from '../main'

const TAG = 'simple-thermostat-dial-test'
if (!customElements.get(TAG)) customElements.define(TAG, SimpleThermostat as any)

// Stub the native HA dial element so customElements.get(...) resolves in tests
// that exercise the "element available" path.
const DIAL = 'ha-control-circular-slider'
if (!customElements.get(DIAL)) {
  customElements.define(DIAL, class extends HTMLElement {})
}

const climateEntity = (overrides: any = {}) => ({
  entity_id: 'climate.test',
  state: 'heat',
  ...overrides,
  attributes: {
    temperature: 21,
    current_temperature: 20,
    min_temp: 7,
    max_temp: 35,
    hvac_modes: ['off', 'heat'],
    ...(overrides.attributes ?? {}),
  },
})

const dualEntity = () => ({
  entity_id: 'climate.dual',
  state: 'heat_cool',
  attributes: {
    target_temp_low: 19,
    target_temp_high: 23,
    current_temperature: 21,
    min_temp: 7,
    max_temp: 35,
    hvac_modes: ['off', 'heat_cool'],
  },
})

const humidifierEntity = () => ({
  entity_id: 'humidifier.test',
  state: 'on',
  attributes: {
    humidity: 55,
    current_humidity: 48,
    min_humidity: 30,
    max_humidity: 70,
  },
})

const fanEntity = () => ({
  entity_id: 'fan.test',
  state: 'on',
  attributes: {
    percentage: 40,
  },
})

const makeHass = (states: Record<string, any>): any => ({
  states,
  localize: () => '',
  formatEntityState: (s: any) => String(s?.state ?? ''),
  formatEntityAttributeValue: () => '',
  config: { unit_system: { temperature: '°C' } },
  locale: { language: 'en', number_format: 'language' },
  // No-op service call so the debounced setTemperature can fire under fake timers.
  performAction: () => {},
  callService: () => {},
})

const createCard = (config: any, hass?: any) => {
  const el = document.createElement(TAG) as any
  el.setConfig(config)
  if (hass) el.hass = hass
  return el
}

const renderCard = (el: any) => {
  const c = document.createElement('div')
  render(el.render(), c)
  return c
}

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()
})

test('setpoint_style: dial renders the native circular slider for a single setpoint', () => {
  const el = createCard(
    { entity: 'climate.test', setpoint_style: 'dial' },
    makeHass({ 'climate.test': climateEntity() })
  )
  const c = renderCard(el)
  expect(c.querySelector('ha-control-circular-slider')).not.toBeNull()
  // the number display must not be used at the same time
  expect(c.querySelector('.current--value')).toBeNull()
})

test('default (no setpoint_style) keeps the number display', () => {
  const el = createCard(
    { entity: 'climate.test' },
    makeHass({ 'climate.test': climateEntity() })
  )
  const c = renderCard(el)
  expect(c.querySelector('ha-control-circular-slider')).toBeNull()
  expect(c.querySelector('.current--value')).not.toBeNull()
})

test('dual (heat_cool) setpoints render a single dual dial with both targets', () => {
  const el = createCard(
    { entity: 'climate.dual', setpoint_style: 'dial' },
    makeHass({ 'climate.dual': dualEntity() })
  )
  // sanity: two setpoint values are present
  expect(Object.keys(el._values).length).toBe(2)
  const c = renderCard(el)
  // exactly one ring (two handles), not two separate dials
  expect(c.querySelectorAll('ha-control-circular-slider').length).toBe(1)
  expect(c.querySelector('.dial-dual-targets')).not.toBeNull()
  expect(c.querySelector('.current--value')).toBeNull()
})

test('the dual dial commits low and high handles independently', () => {
  const el = createCard(
    { entity: 'climate.dual', setpoint_style: 'dial' },
    makeHass({ 'climate.dual': dualEntity() })
  )
  const c = renderCard(el)
  const slider = c.querySelector('ha-control-circular-slider')!
  slider.dispatchEvent(new CustomEvent('low-changing', { detail: { value: 18 } }))
  expect(el._values.target_temp_low).toBe(18)
  slider.dispatchEvent(new CustomEvent('high-changed', { detail: { value: 25 } }))
  expect(el._values.target_temp_high).toBe(25)
})

test('falls back to the number display when the dial element is not registered', () => {
  vi.spyOn(customElements, 'get').mockReturnValue(undefined)
  const el = createCard(
    { entity: 'climate.test', setpoint_style: 'dial' },
    makeHass({ 'climate.test': climateEntity() })
  )
  const c = renderCard(el)
  expect(c.querySelector('ha-control-circular-slider')).toBeNull()
  expect(c.querySelector('.current--value')).not.toBeNull()
})

test('dial mode renders +/- buttons plus the action label and current temperature', () => {
  const el = createCard(
    { entity: 'climate.test', setpoint_style: 'dial' },
    makeHass({
      'climate.test': climateEntity({
        attributes: { hvac_action: 'heating', current_temperature: 20 },
      }),
    })
  )
  const c = renderCard(el)
  expect(c.querySelectorAll('.dial-buttons ha-outlined-icon-button').length).toBe(2)
  expect(c.querySelector('.dial-action')).not.toBeNull()
  expect(c.querySelector('.dial-current')).not.toBeNull()
})

test('dial_action_labels overrides the center action label', () => {
  const el = createCard(
    {
      entity: 'climate.test',
      setpoint_style: 'dial',
      dial_action_labels: { heating: 'Heizt' },
    },
    makeHass({
      'climate.test': climateEntity({ attributes: { hvac_action: 'heating' } }),
    })
  )
  const c = renderCard(el)
  expect(c.querySelector('.dial-action')?.textContent).toContain('Heizt')
})

test('humidifier dial uses the humidity icon, % unit and current_humidity', () => {
  const el = createCard(
    { entity: 'humidifier.test', setpoint_style: 'dial' },
    makeHass({ 'humidifier.test': humidifierEntity() })
  )
  const c = renderCard(el)
  expect(c.querySelector('ha-control-circular-slider')).not.toBeNull()
  expect(c.querySelector('.current--unit')?.textContent).toContain('%')
  const currentIcon = c.querySelector('.dial-current ha-icon') as any
  expect(currentIcon?.icon).toBe('mdi:water-percent')
})

test('fan dial shows % and hides the current line (current == setpoint)', () => {
  const el = createCard(
    { entity: 'fan.test', setpoint_style: 'dial' },
    makeHass({ 'fan.test': fanEntity() })
  )
  const c = renderCard(el)
  expect(c.querySelector('ha-control-circular-slider')).not.toBeNull()
  expect(c.querySelector('.current--unit')?.textContent).toContain('%')
  // the fan's "current" is just the percentage → no duplicate current line
  expect(c.querySelector('.dial-current')).toBeNull()
})

test('number style shows the renamed/localized off label instead of a hardcoded OFF', () => {
  const el = createCard(
    { entity: 'climate.test', control: { hvac: { off: { name: 'Ausgeschaltet' } } } },
    makeHass({ 'climate.test': climateEntity({ state: 'off' }) })
  )
  const c = renderCard(el)
  const val = c.querySelector('.current--value')
  expect(val?.textContent).toContain('Ausgeschaltet')
  expect(val?.textContent).not.toContain('OFF')
})

test('a renamed mode shows in the dial center when no hvac_action is active', () => {
  const el = createCard(
    {
      entity: 'climate.test',
      setpoint_style: 'dial',
      control: { hvac: { cool: { name: 'Kühlen' } } },
    },
    // no hvac_action → the dial shows the mode itself
    makeHass({ 'climate.test': climateEntity({ state: 'cool' }) })
  )
  const c = renderCard(el)
  expect(c.querySelector('.dial-action')?.textContent).toContain('Kühlen')
})

test('the renamed mode shows while actively working (cooling)', () => {
  const el = createCard(
    {
      entity: 'climate.test',
      setpoint_style: 'dial',
      control: { hvac: { cool: { name: 'Kühlen' } } },
    },
    makeHass({
      'climate.test': climateEntity({ state: 'cool', attributes: { hvac_action: 'cooling' } }),
    })
  )
  const c = renderCard(el)
  expect(c.querySelector('.dial-action')?.textContent).toContain('Kühlen')
})

test('idle shows the live action, not the mode name', () => {
  const el = createCard(
    {
      entity: 'climate.test',
      setpoint_style: 'dial',
      control: { hvac: { cool: { name: 'Kühlen' } } },
      dial_action_labels: { idle: 'Leerlauf' },
    },
    makeHass({
      'climate.test': climateEntity({ state: 'cool', attributes: { hvac_action: 'idle' } }),
    })
  )
  const c = renderCard(el)
  expect(c.querySelector('.dial-action')?.textContent).toContain('Leerlauf')
  expect(c.querySelector('.dial-action')?.textContent).not.toContain('Kühlen')
})

test('the dial ring is colored by the current HVAC mode', () => {
  const el = createCard(
    { entity: 'climate.test', setpoint_style: 'dial' },
    makeHass({ 'climate.test': climateEntity({ state: 'heat' }) })
  )
  const c = renderCard(el)
  const slider = c.querySelector('ha-control-circular-slider') as HTMLElement
  expect(slider.getAttribute('style')).toContain('--control-circular-slider-color: var(--heat-color)')
})

test('the dual dial colors low and high arcs with the heat/cool mode colors', () => {
  const el = createCard(
    { entity: 'climate.dual', setpoint_style: 'dial' },
    makeHass({ 'climate.dual': dualEntity() })
  )
  const c = renderCard(el)
  const slider = c.querySelector('ha-control-circular-slider') as HTMLElement
  const style = slider.getAttribute('style') || ''
  expect(style).toContain('--control-circular-slider-low-color: var(--heat-color)')
  expect(style).toContain('--control-circular-slider-high-color: var(--cool-color)')
})

test('dial mode shows the off state instead of the setpoint when the entity is off', () => {
  const el = createCard(
    { entity: 'climate.test', setpoint_style: 'dial' },
    makeHass({ 'climate.test': climateEntity({ state: 'off' }) })
  )
  const c = renderCard(el)
  // the big number is replaced by the localized state label
  expect(c.querySelector('.dial-off')).not.toBeNull()
  expect(c.querySelector('.dial-int')).toBeNull()
  // the action label is suppressed so it doesn't duplicate "Off"
  expect(c.querySelector('.dial-action')).toBeNull()
})

test('the +/- buttons in dial mode change the setpoint', () => {
  const el = createCard(
    { entity: 'climate.test', setpoint_style: 'dial' },
    makeHass({ 'climate.test': climateEntity() })
  )
  const c = renderCard(el)
  const [minus, plus] = c.querySelectorAll('.dial-buttons ha-outlined-icon-button')
  ;(plus as HTMLElement).click()
  expect(el._values.temperature).toBe(21 + el.stepSize)
  ;(minus as HTMLElement).click()
  expect(el._values.temperature).toBe(21)
})

test('holding a +/- button repeats the step until release', () => {
  vi.useFakeTimers()
  const el = createCard(
    { entity: 'climate.test', setpoint_style: 'dial' },
    makeHass({ 'climate.test': climateEntity() })
  )
  const c = renderCard(el)
  const plus = c.querySelectorAll('.dial-buttons ha-outlined-icon-button')[1] as HTMLElement
  plus.dispatchEvent(new Event('pointerdown'))
  // nothing yet before the initial delay
  expect(el._values.temperature).toBe(21)
  vi.advanceTimersByTime(500) // delay elapses → first repeat step
  vi.advanceTimersByTime(300) // → second
  vi.advanceTimersByTime(300) // → third
  plus.dispatchEvent(new Event('pointerup'))
  vi.advanceTimersByTime(600) // no further steps after release
  expect(el._values.temperature).toBe(21 + 3 * el.stepSize)
})

test('a click right after a hold does not add an extra step', () => {
  vi.useFakeTimers()
  const el = createCard(
    { entity: 'climate.test', setpoint_style: 'dial' },
    makeHass({ 'climate.test': climateEntity() })
  )
  const c = renderCard(el)
  const plus = c.querySelectorAll('.dial-buttons ha-outlined-icon-button')[1] as HTMLElement
  plus.dispatchEvent(new Event('pointerdown'))
  vi.advanceTimersByTime(500) // one repeat step
  plus.dispatchEvent(new Event('pointerup'))
  plus.dispatchEvent(new Event('click')) // the trailing click must be swallowed
  expect(el._values.temperature).toBe(21 + el.stepSize)
})

test('dragging the dial (value-changing) live-updates the center display before release', () => {
  const el = createCard(
    { entity: 'climate.test', setpoint_style: 'dial' },
    makeHass({ 'climate.test': climateEntity() })
  )
  const c = renderCard(el)
  const slider = c.querySelector('ha-control-circular-slider')!
  // value-changing fires continuously during the drag (before release)
  slider.dispatchEvent(new CustomEvent('value-changing', { detail: { value: 26 } }))
  expect(el._values.temperature).toBe(26)
})

test('dragging the dial (value-changed) commits the new target via setTemperature', () => {
  const el = createCard(
    { entity: 'climate.test', setpoint_style: 'dial' },
    makeHass({ 'climate.test': climateEntity() })
  )
  const c = renderCard(el)
  const slider = c.querySelector('ha-control-circular-slider')!
  slider.dispatchEvent(new CustomEvent('value-changed', { detail: { value: 24 } }))
  expect(el._values.temperature).toBe(24)
})
