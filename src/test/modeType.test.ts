// @vitest-environment jsdom
import { render } from 'lit'
import SimpleThermostat from '../main'
import renderModeType from '../components/modeType'

const TAG = 'simple-thermostat-modetype-test'
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
    hvac_modes: ['off', 'heat'],
    ...(overrides.attributes ?? {}),
  },
})

// formatEntityState / formatEntityAttributeValue return values that are
// DISTINCT from the raw state key, so a test can tell whether the localization
// path actually ran (vs. the raw key leaking through).
const makeHass = (states: Record<string, any> = {}): any => ({
  states,
  localize: (k: string) => k,
  formatEntityState: (e: any) => 'LOC_' + e.state,
  formatEntityAttributeValue: (_e: any, _attr: string, v: string) => 'ATTR_' + v,
  config: { unit_system: { temperature: '°C' } },
  locale: { language: 'en', number_format: 'language' },
})

const createCard = (config: any, hass: any) => {
  const el = document.createElement(TAG) as any
  el.setConfig(config)
  el.hass = hass
  return el
}

const renderToText = (opts: any) => {
  const container = document.createElement('div')
  render(renderModeType(opts), container)
  return container.textContent?.replace(/\s+/g, ' ').trim() ?? ''
}

describe('mode label localization (regression: raw key must not shadow formatEntityState)', () => {
  test('getModeList leaves name undefined for unconfigured modes', () => {
    const el = createCard(
      { entity: 'climate.test' },
      makeHass({ 'climate.test': climateEntity() })
    )
    const list = el.modes[0].list
    expect(list.length).toBe(2)
    // The bug was `name: modeKey`. Unconfigured modes must carry no name so the
    // renderer can localize; only value is fixed.
    for (const item of list) {
      expect(item.name).toBeUndefined()
      expect(typeof item.value).toBe('string')
    }
  })

  test('a configured custom name still survives', () => {
    const el = createCard(
      { entity: 'climate.test', control: { hvac: { heat: { name: 'Heating' } } } },
      makeHass({ 'climate.test': climateEntity() })
    )
    const heat = el.modes[0].list.find((i: any) => i.value === 'heat')
    expect(heat.name).toBe('Heating')
  })

  test('name: false still survives (icon-only)', () => {
    const el = createCard(
      { entity: 'climate.test', control: { hvac: { heat: { name: false } } } },
      makeHass({ 'climate.test': climateEntity() })
    )
    const heat = el.modes[0].list.find((i: any) => i.value === 'heat')
    expect(heat.name).toBe(false)
  })

  const baseOpts = (listItem: any, type = 'hvac') => ({
    state: 'heat',
    entity: climateEntity(),
    hass: makeHass(),
    mode: { type, hide_when_off: false, mode: 'heat', name: undefined, list: [listItem] },
    modeOptions: {},
    localize: (k: string) => k,
    setMode: () => {},
  })

  test('undefined name renders the localized label, not the raw key (hvac)', () => {
    const text = renderToText(baseOpts({ value: 'heat', icon: undefined, name: undefined }))
    expect(text).toContain('LOC_heat')
    expect(text).not.toBe('heat')
  })

  test('undefined name localizes via attribute for non-hvac modes (fan)', () => {
    const text = renderToText(
      baseOpts({ value: 'low', icon: undefined, name: undefined }, 'fan')
    )
    expect(text).toContain('ATTR_low')
  })

  test('explicit string name overrides localization', () => {
    const text = renderToText(baseOpts({ value: 'heat', icon: undefined, name: 'Custom' }))
    expect(text).toContain('Custom')
    expect(text).not.toContain('LOC_heat')
  })

  test('name: false renders no label (icon-only)', () => {
    const text = renderToText(baseOpts({ value: 'heat', icon: undefined, name: false }))
    expect(text).toBe('')
  })
})

describe('accessibility: mode buttons form a radio group', () => {
  test('role=radiogroup with role=radio items and aria-checked on the active mode', () => {
    const container = document.createElement('div')
    render(
      renderModeType({
        state: 'heat',
        entity: climateEntity(),
        hass: makeHass(),
        mode: {
          type: 'hvac',
          hide_when_off: false,
          mode: 'heat',
          name: undefined,
          list: [
            { value: 'heat', icon: undefined, name: undefined },
            { value: 'off', icon: undefined, name: undefined },
          ],
        },
        modeOptions: {},
        localize: (k: string) => k,
        setMode: () => {},
      } as any),
      container
    )
    expect(container.querySelector('[role="radiogroup"]')).not.toBeNull()
    expect(container.querySelectorAll('[role="radio"]').length).toBe(2)
    const checked = container.querySelector('[role="radio"][aria-checked="true"]')
    expect(checked?.getAttribute('aria-label')).toBe('heat')
    // the inactive mode is explicitly not checked
    expect(container.querySelector('[role="radio"][aria-checked="false"]')?.getAttribute('aria-label')).toBe('off')
  })
})

describe('hide_when_off (off-collapse: a control row disappears while the entity is off)', () => {
  const opts = (hide_when_off: boolean, state: string) => ({
    state,
    entity: climateEntity({ state }),
    hass: makeHass(),
    mode: {
      type: 'fan',
      hide_when_off,
      mode: 'low',
      name: undefined,
      list: [{ value: 'low', icon: undefined, name: undefined }],
    },
    modeOptions: {},
    localize: (k: string) => k,
    setMode: () => {},
  })

  test('with the flag set, the row is hidden when the entity is off', () => {
    expect(renderModeType(opts(true, 'off'))).toBeNull()
  })

  test('with the flag set, the row stays visible when the entity is on', () => {
    expect(renderModeType(opts(true, 'heat'))).not.toBeNull()
  })

  test('without the flag, the row stays visible even when off', () => {
    expect(renderModeType(opts(false, 'off'))).not.toBeNull()
  })
})

describe('hvac bar is always shown unless explicitly hidden (#control-whitelist)', () => {
  test('an object control that omits hvac still shows the hvac bar', () => {
    const el = createCard(
      { entity: 'climate.test', control: { preset: { _hide_when_off: true } } },
      makeHass({
        'climate.test': climateEntity({ attributes: { preset_modes: ['eco', 'comfort'] } }),
      })
    )
    const types = el.modes.map((m: any) => m.type)
    expect(types).toContain('hvac')
    expect(types).toContain('preset')
  })

  test('adding then removing an hvac label does not toggle the bar (control without hvac)', () => {
    // Simulates the state after clearing a mode label: control lists other
    // types but not hvac. The bar must remain.
    const el = createCard(
      { entity: 'climate.test', control: { preset: {}, fan: {} } },
      makeHass({
        'climate.test': climateEntity({
          attributes: { preset_modes: ['eco'], fan_modes: ['low', 'high'] },
        }),
      })
    )
    expect(el.modes.map((m: any) => m.type)).toContain('hvac')
  })

  test('hvac is hoisted to the top even when control lists it last', () => {
    const el = createCard(
      {
        entity: 'climate.test',
        control: { preset: {}, fan: {}, hvac: { cool: { name: 'Kühlen' } } },
      },
      makeHass({
        'climate.test': climateEntity({
          attributes: { preset_modes: ['eco'], fan_modes: ['low', 'high'] },
        }),
      })
    )
    expect(el.modes.map((m: any) => m.type)[0]).toBe('hvac')
  })

  test('control.hvac: false explicitly hides the hvac bar', () => {
    const el = createCard(
      { entity: 'climate.test', control: { hvac: false, preset: {} } },
      makeHass({
        'climate.test': climateEntity({ attributes: { preset_modes: ['eco'] } }),
      })
    )
    expect(el.modes.map((m: any) => m.type)).not.toContain('hvac')
  })
})
