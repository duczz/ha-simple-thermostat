// @vitest-environment jsdom
import SimpleThermostatEditor, { buildSchema } from '../editor'

const TAG = 'simple-thermostat-editor-test'
if (!customElements.get(TAG)) {
  customElements.define(TAG, SimpleThermostatEditor as any)
}

// Recursively find the first schema node with the given name.
const findField = (schema: any[], name: string): any => {
  for (const node of schema) {
    if (node.name === name) return node
    if (Array.isArray(node.schema)) {
      const found = findField(node.schema, name)
      if (found) return found
    }
  }
  return undefined
}

// Flattens a schema tree (grids, expandables, ...) into the field-name order
// ha-form would actually render them in.
const flattenFieldNames = (schema: any[]): string[] =>
  schema.flatMap((node) =>
    Array.isArray(node.schema) ? flattenFieldNames(node.schema) : node.name ? [node.name] : []
  )

const createEditor = (config: any) => {
  const el = document.createElement(TAG) as any
  el.setConfig(config)
  return el
}

describe('buildSchema (#12 entity domains, #25a step_size)', () => {
  test('entity picker allows climate, fan and humidifier', () => {
    const entityField = findField(buildSchema({}), 'entity')
    expect(entityField.selector.entity.domain).toEqual(['climate', 'fan', 'humidifier'])
  })

  test('swing override entity pickers are limited to the domains the card can read', () => {
    const schema = buildSchema({})
    const vertical = findField(schema, 'control.swing_vertical.entity')
    const horizontal = findField(schema, 'control.swing_horizontal.entity')
    const domains = ['select', 'input_select', 'switch', 'input_boolean']
    expect(vertical.selector.entity.domain).toEqual(domains)
    expect(horizontal.selector.entity.domain).toEqual(domains)
  })

  test('a custom step_size gets its own dropdown option', () => {
    const field = findField(buildSchema({ step_size: 2 }), 'step_size')
    const values = field.selector.select.options.map((o: any) => o.value)
    expect(values).toContain('2')
  })

  test('preset step_size values are not duplicated', () => {
    const field = findField(buildSchema({ step_size: 0.5 }), 'step_size')
    const values = field.selector.select.options.map((o: any) => o.value)
    expect(values.filter((v: string) => v === '0.5')).toHaveLength(1)
  })

  test('Setpoint section holds the setpoint + step fields', () => {
    const section = buildSchema({}).find((s: any) => s.title === 'Setpoint')
    expect(section).toBeDefined()
    expect(flattenFieldNames(section!.schema)).toEqual([
      'hide_setpoint',
      'setpoint_style',
      'layout.step',
      'step_size',
    ])
  })

  test('Mode controls section: show, then hide-when-off, swing variants, then display', () => {
    const section = buildSchema({}).find((s: any) => s.title === 'Mode controls')
    expect(section).toBeDefined()
    expect(flattenFieldNames(section!.schema)).toEqual([
      'show_preset',
      'show_fan',
      'show_swing',
      'control.preset._hide_when_off',
      'control.fan._hide_when_off',
      'control.swing._hide_when_off',
      'show_swing_vertical',
      'show_swing_horizontal',
      'control.swing_vertical.entity',
      'control.swing_horizontal.entity',
      'layout.mode.names',
      'layout.mode.icons',
      'layout.mode.headings',
    ])
  })
})

describe('mode labels editor', () => {
  const fireCapture = (el: any) => {
    let captured: any
    el.addEventListener('config-changed', (e: any) => (captured = e.detail.config))
    return () => captured
  }

  test('setting a name writes control.<type>.<value>.name', () => {
    const el = createEditor({ entity: 'climate.test' })
    const getFired = fireCapture(el)
    el._setModeLabels('hvac', 'cool', { name: 'Kühlen', icon: '' })
    expect(getFired().control.hvac.cool).toEqual({ name: 'Kühlen' })
  })

  test('setting an icon keeps an existing name', () => {
    const el = createEditor({ entity: 'climate.test', control: { hvac: { cool: { name: 'Kühlen' } } } })
    const getFired = fireCapture(el)
    el._setModeLabels('hvac', 'cool', { name: 'Kühlen', icon: 'mdi:snowflake' })
    expect(getFired().control.hvac.cool).toEqual({ name: 'Kühlen', icon: 'mdi:snowflake' })
  })

  test('clearing both fields removes the value and prunes empty control', () => {
    const el = createEditor({ entity: 'climate.test', control: { hvac: { cool: { name: 'Kühlen' } } } })
    const getFired = fireCapture(el)
    el._setModeLabels('hvac', 'cool', { name: '', icon: '' })
    expect(getFired().control).toBeUndefined()
  })

  test('editing a label preserves other types and their _hidden state', () => {
    const el = createEditor({
      entity: 'climate.test',
      control: { hvac: {}, preset: { _hidden: true } },
    })
    const getFired = fireCapture(el)
    el._setModeLabels('hvac', 'heat', { name: 'Heizen', icon: '' })
    const control = getFired().control
    expect(control.hvac.heat).toEqual({ name: 'Heizen' })
    expect(control.preset).toEqual({ _hidden: true })
  })

  test('only mode types the entity exposes are listed', () => {
    const el = createEditor({ entity: 'climate.test' })
    el.hass = {
      states: {
        'climate.test': {
          attributes: { hvac_modes: ['off', 'heat', 'cool'], preset_modes: ['eco'] },
        },
      },
    }
    const groups = el._getModeLabelGroups()
    const types = groups.map((g: any) => g.type)
    expect(types).toContain('hvac')
    expect(types).toContain('preset')
    expect(types).not.toContain('fan')
    expect(groups.find((g: any) => g.type === 'hvac').values).toEqual(['off', 'heat', 'cool'])
  })
})

describe('reorder sensors and banners', () => {
  const fireCapture = (el: any) => {
    let captured: any
    el.addEventListener('config-changed', (e: any) => (captured = e.detail.config))
    return () => captured
  }

  test('_moveBanner swaps two banners and their collapse state', () => {
    const el = createEditor({ entity: 'climate.test', banners: [{ text: 'a' }, { text: 'b' }, { text: 'c' }] })
    el._collapsedBanners = { 0: true, 1: false, 2: true }
    const getFired = fireCapture(el)
    el._moveBanner(0, 1)
    expect(getFired().banners.map((b: any) => b.text)).toEqual(['b', 'a', 'c'])
    expect(el._collapsedBanners).toEqual({ 0: false, 1: true, 2: true })
  })

  test('_addBannerSorted inserts a new banner at its severity position', () => {
    const el = createEditor({ entity: 'climate.test', banners: [{ type: 'info', text: 'i' }, { type: 'success', text: 's' }] })
    const getFired = fireCapture(el)
    el._addBannerSorted({ type: 'error', text: 'e' })
    // error (highest severity) is placed before info and success
    expect(getFired().banners.map((b: any) => b.type)).toEqual(['error', 'info', 'success'])
  })

  test('_addBannerSorted appends the lowest severity at the end', () => {
    const el = createEditor({ entity: 'climate.test', banners: [{ type: 'error', text: 'e' }, { type: 'warning', text: 'w' }] })
    const getFired = fireCapture(el)
    el._addBannerSorted({ type: 'success', text: 's' })
    expect(getFired().banners.map((b: any) => b.type)).toEqual(['error', 'warning', 'success'])
  })

  test('_moveBanner is a no-op at the top boundary', () => {
    const el = createEditor({ entity: 'climate.test', banners: [{ text: 'a' }, { text: 'b' }] })
    const getFired = fireCapture(el)
    el._moveBanner(0, -1)
    expect(getFired()).toBeUndefined()
  })

  test('_moveSensor reorders custom sensors, skipping the built-in ones', () => {
    const el = createEditor({ entity: 'climate.test', sensors: [{ entity: 'sensor.a' }, { entity: 'sensor.b' }] })
    const getFired = fireCapture(el)
    const virtualCount = el._getVirtualSensors().length
    el._moveSensor(virtualCount, 1) // move the first custom sensor down
    expect(getFired().sensors.map((s: any) => s.entity)).toEqual(['sensor.b', 'sensor.a'])
  })

  test('_moveSensor does not move a built-in (virtual) sensor', () => {
    const el = createEditor({ entity: 'climate.test', sensors: [{ entity: 'sensor.a' }] })
    const getFired = fireCapture(el)
    el._moveSensor(0, 1) // index 0 is the built-in temperature sensor
    expect(getFired()).toBeUndefined()
  })
})

describe('editor does not mutate the shared config (#14)', () => {
  const fireCapture = (el: any) => {
    let captured: any
    el.addEventListener('config-changed', (e: any) => (captured = e.detail.config))
    return () => captured
  }

  test('_restoreSensor clones hide instead of mutating it', () => {
    const config = { entity: 'climate.test', hide: Object.freeze({ temperature: true }) }
    Object.freeze(config)
    const el = createEditor(config)
    const getFired = fireCapture(el)

    expect(() => el._restoreSensor('temperature')).not.toThrow()
    expect(getFired().hide.temperature).toBe(false)
    // original untouched
    expect(config.hide.temperature).toBe(true)
  })

  test('_removeSensor (virtual) clones hide instead of mutating it', () => {
    const config = { entity: 'climate.test', hide: Object.freeze({}) }
    Object.freeze(config)
    const el = createEditor(config)
    const getFired = fireCapture(el)

    // index 0 == first virtual sensor (temperature)
    expect(() => el._removeSensor(0)).not.toThrow()
    expect(getFired().hide.temperature).toBe(true)
    expect(config.hide).toEqual({})
  })
})

describe('editor collapse state shifts on delete (#22)', () => {
  test('_removeBanner shifts the collapsed-banner map', () => {
    const config = {
      entity: 'climate.test',
      banners: [{ text: 'a' }, { text: 'b' }, { text: 'c' }],
    }
    const el = createEditor(config)
    el._collapsedBanners = { 0: true, 1: false, 2: true }
    el._removeBanner(1)
    // index 2 (was 'c') shifts down to 1
    expect(el._collapsedBanners).toEqual({ 0: true, 1: true })
  })
})

describe('#15: header.faults survive a show_header off/on round trip', () => {
  test('faults are restored after toggling the header off then on', () => {
    const config = {
      entity: 'climate.test',
      header: { faults: [{ entity: 'binary_sensor.low_battery' }] },
    }
    const el = createEditor(config)

    // Turn the header off
    const offResult = el._applyFormChange({ ...el._buildFormData(), show_header: false })
    expect(offResult.header).toBe(false)

    // Simulate HA committing the saved config back to the editor (the real
    // lifecycle: config-changed -> lovelace -> setConfig)
    el.setConfig(offResult)

    // Turn the header back on
    const onResult = el._applyFormChange({ ...el._buildFormData(), show_header: true })
    expect(onResult.header.faults).toEqual([{ entity: 'binary_sensor.low_battery' }])
  })

  test('name, icon, and toggle survive the same round trip (not just faults)', () => {
    // Regression: _buildFormData() used to read name/icon/toggle only from
    // `this.config.header`, which is `false` while hidden — so those fields
    // silently went back in as empty and got wiped on re-enable, even though
    // the header object itself was being restored from the cache.
    const config = {
      entity: 'climate.test',
      header: {
        name: 'Wohnzimmer',
        icon: 'mdi:sofa',
        toggle: { entity: 'switch.pump', name: 'Pump' },
        faults: [{ entity: 'binary_sensor.low_battery' }],
      },
    }
    const el = createEditor(config)

    const offResult = el._applyFormChange({ ...el._buildFormData(), show_header: false })
    el.setConfig(offResult)

    const onResult = el._applyFormChange({ ...el._buildFormData(), show_header: true })
    expect(onResult.header.name).toBe('Wohnzimmer')
    expect(onResult.header.icon).toBe('mdi:sofa')
    expect(onResult.header.toggle.entity).toBe('switch.pump')
    expect(onResult.header.toggle.name).toBe('Pump')
    expect(onResult.header.faults).toEqual([{ entity: 'binary_sensor.low_battery' }])
  })

  test('the user can still intentionally clear the name while the header stays on', () => {
    const config = { entity: 'climate.test', header: { name: 'Wohnzimmer', icon: 'mdi:sofa' } }
    const el = createEditor(config)
    const cleared = el._applyFormChange({ ...el._buildFormData(), name: '' })
    expect(cleared.header.name).toBeUndefined()
    expect(cleared.header.icon).toBe('mdi:sofa')
  })

  test('an intentional clear is not resurrected by the cache on a later toggle cycle', () => {
    const config = {
      entity: 'climate.test',
      header: { name: 'Wohnzimmer', faults: [{ entity: 'binary_sensor.x' }] },
    }
    const el = createEditor(config)

    const cleared = el._applyFormChange({ ...el._buildFormData(), name: '' })
    el.setConfig(cleared)

    const off = el._applyFormChange({ ...el._buildFormData(), show_header: false })
    el.setConfig(off)
    const on = el._applyFormChange({ ...el._buildFormData(), show_header: true })

    expect(on.header.name).toBeUndefined()
    expect(on.header.faults).toEqual([{ entity: 'binary_sensor.x' }])
  })

  test('cache survives an unrelated edit made while the header is off', () => {
    const config = {
      entity: 'climate.test',
      header: { faults: [{ entity: 'binary_sensor.low_battery' }] },
    }
    const el = createEditor(config)

    const offResult = el._applyFormChange({ ...el._buildFormData(), show_header: false })
    el.setConfig(offResult)

    // Editor stays open, user changes something unrelated (decimals) while
    // the header is off — the cache must not be overwritten with `false`.
    const unrelatedResult = el._applyFormChange({ ...el._buildFormData(), decimals: 2 })
    el.setConfig(unrelatedResult)

    const onResult = el._applyFormChange({ ...el._buildFormData(), show_header: true })
    expect(onResult.header.faults).toEqual([{ entity: 'binary_sensor.low_battery' }])
  })

  test('no cached header (never had one) — re-enabling produces no leftover header key, no crash', () => {
    const config = { entity: 'climate.test', header: false }
    const el = createEditor(config)
    expect(() =>
      el._applyFormChange({ ...el._buildFormData(), show_header: true })
    ).not.toThrow()
    const onResult = el._applyFormChange({ ...el._buildFormData(), show_header: true })
    expect(onResult.header).toBeUndefined()
  })
})

// The `expandable` sections used to be handed to one big <ha-form>, which drew
// them inside its own shadow DOM — unreachable for our spacing and panel chrome
// (gotcha #10). They are now rendered as our own panels in the light DOM. These
// tests pin that structure: the previous logic-only suite stayed green through
// the whole refactor, so it proved nothing about the rendering.
describe('editor renders every section as its own panel', () => {
  const renderEditor = async (config: any) => {
    const el = createEditor(config)
    el.hass = { states: {} }
    document.body.appendChild(el)
    await el.updateComplete
    return el
  }

  const cardConfig = (el: any) => el.shadowRoot.querySelector('.card-config')

  // jsdom does not honour `:scope` in element.querySelector*, so direct children
  // are filtered by tag name instead.
  const childrenNamed = (parent: any, tag: string): any[] =>
    [...parent.children].filter((c: any) => c.localName === tag)

  const childBySlot = (parent: any, slot: string): any =>
    [...parent.children].find((c: any) => c.getAttribute('slot') === slot)

  test('no ha-form is left as a direct child of .card-config', async () => {
    const el = await renderEditor({ entity: 'climate.test' })
    expect(childrenNamed(cardConfig(el), 'ha-form')).toHaveLength(0)
  })

  test('every schema section becomes a top-level panel with its title', async () => {
    const config = { entity: 'climate.test' }
    const el = await renderEditor(config)
    const titles = childrenNamed(cardConfig(el), 'ha-expansion-panel')
      .map((p) => childBySlot(p, 'header'))
      .filter(Boolean)
      .map((h) => h.textContent.trim())

    const sections = buildSchema(config) as any[]
    expect(sections.length).toBeGreaterThan(0) // guards against a vacuous pass
    for (const section of sections) {
      expect(titles).toContain(section.title)
    }
    // Our own panels (Banners, Sensors, Custom CSS, ...) sit alongside them.
    expect(titles.length).toBeGreaterThan(sections.length)
  })

  test('section panels put their icon in the leading-icon slot, like HA does', async () => {
    const el = await renderEditor({ entity: 'climate.test' })
    const panels = childrenNamed(cardConfig(el), 'ha-expansion-panel')
    expect(panels.length).toBeGreaterThan(0)
    for (const panel of panels) {
      expect(childBySlot(panel, 'leading-icon')).toBeDefined()
      expect(childBySlot(panel, 'header')?.getAttribute('role')).toBe('heading')
    }
  })

  test('each section still receives the complete form data, not just its own fields', async () => {
    const config = { entity: 'climate.test' }
    const el = await renderEditor(config)
    const forms = [...cardConfig(el).querySelectorAll('ha-expansion-panel > .panel-content > ha-form')]
    expect(forms.length).toBeGreaterThan(1)
    for (const form of forms as any[]) {
      expect(form.data).toEqual(el._buildFormData())
    }
  })
})
