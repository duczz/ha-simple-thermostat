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

  test('Controls section field order: preset/fan/swing, mode display, then vert/horiz swing', () => {
    const controlsSection = buildSchema({}).find((s: any) => s.title === 'Controls')
    const names = flattenFieldNames(controlsSection!.schema)
    expect(names).toEqual([
      'hide_setpoint',
      'layout.step',
      'step_size',
      'show_preset',
      'show_fan',
      'show_swing',
      'layout.mode.names',
      'layout.mode.icons',
      'layout.mode.headings',
      'show_swing_vertical',
      'show_swing_horizontal',
      'control.swing_vertical.entity',
      'control.swing_horizontal.entity',
    ])
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
