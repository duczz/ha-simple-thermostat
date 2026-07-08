import { applyFormChange, shiftCollapseState } from '../config/editorForm'

// Mirrors the shape of SimpleThermostatEditor._buildFormData() with everything
// at its true default for a climate entity. Individual tests override just
// the field under test.
//
// show_preset/fan/swing/swing_vertical/swing_horizontal are FALSE here
// because that's what _buildFormData()'s `isModeEnabled` actually computes
// for a climate entity with no `control` config: the adapter's default
// control list is `['hvac']` only, so none of these 5 types are "on" by
// default. (Getting this wrong — assuming all-true was the default — is
// exactly what hid the bug from #16601b48b93/bug report: see the
// "show-toggle regression" describe block below.)
const baseForm = (over: Record<string, any> = {}) => ({
  entity: 'climate.test',
  current_value_entity: '',
  show_header: true,
  decimals: 1,
  unit: '',
  'layout.step': 'row',
  step_size: 'auto',
  fallback: '',
  'hide.temperature': false,
  'hide.state': false,
  'icon.temperature': '',
  'icon.state': '',
  'label.temperature': '',
  'label.state': '',
  sensors: [],
  'layout.sensors.type': 'table',
  'layout.sensors.labels': true,
  'layout.mode.names': true,
  'layout.mode.icons': true,
  'layout.mode.headings': false,
  hide_setpoint: false,
  show_preset: false,
  show_fan: false,
  show_swing: false,
  show_swing_vertical: false,
  show_swing_horizontal: false,
  name: '',
  icon: '',
  'toggle.entity': '',
  'toggle.name': '',
  'toggle.icon': '',
  tap_action: { action: 'more-info' },
  hold_action: { action: 'none' },
  double_tap_action: { action: 'none' },
  ...over,
})

describe('applyFormChange — delete-on-default (#16)', () => {
  test('an all-default form produces a minimal config (only entity)', () => {
    const result = applyFormChange({ entity: 'climate.test' }, baseForm())
    expect(result).toEqual({ entity: 'climate.test' })
  })

  test('default decimals (1) is omitted, a custom value is written', () => {
    expect(applyFormChange({ entity: 'climate.test' }, baseForm()).decimals).toBeUndefined()
    expect(
      applyFormChange({ entity: 'climate.test' }, baseForm({ decimals: 2 })).decimals
    ).toBe(2)
  })

  test('default layout.step (row) omitted, custom written', () => {
    expect(applyFormChange({}, baseForm()).layout).toBeUndefined()
    const result = applyFormChange({}, baseForm({ 'layout.step': 'column' }))
    expect(result.layout.step).toBe('column')
  })

  test('boolean defaults omitted; non-defaults written', () => {
    // defaults: hide_setpoint false, layout.mode.names true, headings false
    const min = applyFormChange({}, baseForm())
    expect(min.hide_setpoint).toBeUndefined()
    expect(min.layout).toBeUndefined()

    const changed = applyFormChange(
      {},
      baseForm({ hide_setpoint: true, 'layout.mode.names': false, 'layout.mode.headings': true })
    )
    expect(changed.hide_setpoint).toBe(true)
    expect(changed.layout.mode.names).toBe(false)
    expect(changed.layout.mode.headings).toBe(true)
  })

  test('empty sensors array is omitted; a non-empty one is kept', () => {
    expect(applyFormChange({}, baseForm({ sensors: [] })).sensors).toBeUndefined()
    const withSensor = applyFormChange({}, baseForm({ sensors: [{ entity: 'sensor.x' }] }))
    expect(withSensor.sensors).toEqual([{ entity: 'sensor.x' }])
  })

  test('default actions omitted, custom actions written', () => {
    const min = applyFormChange({}, baseForm())
    expect(min.tap_action).toBeUndefined()
    expect(min.hold_action).toBeUndefined()
    expect(min.double_tap_action).toBeUndefined()

    const custom = applyFormChange(
      {},
      baseForm({ tap_action: { action: 'toggle' } })
    )
    expect(custom.tap_action).toEqual({ action: 'toggle' })
  })

  test('empty nested containers are pruned', () => {
    const result = applyFormChange(
      { entity: 'climate.test', layout: { step: 'row' }, hide: { temperature: false } },
      baseForm()
    )
    expect(result.layout).toBeUndefined()
    expect(result.hide).toBeUndefined()
  })

  test('preserves unrelated existing keys (e.g. styles)', () => {
    const result = applyFormChange(
      { entity: 'climate.test', styles: '.foo { color: red }' },
      baseForm()
    )
    expect(result.styles).toBe('.foo { color: red }')
  })
})

describe('applyFormChange — step_size', () => {
  test("'auto' removes the key, a preset becomes numeric", () => {
    expect(applyFormChange({}, baseForm({ step_size: 'auto' })).step_size).toBeUndefined()
    expect(applyFormChange({}, baseForm({ step_size: '0.5' })).step_size).toBe(0.5)
  })

  test('a custom numeric string is preserved as a number', () => {
    expect(applyFormChange({}, baseForm({ step_size: '2' })).step_size).toBe(2)
  })
})

describe('applyFormChange — unit false round-trip (#25b)', () => {
  test('an explicit unit:false survives an unrelated change', () => {
    const result = applyFormChange(
      { entity: 'climate.test', unit: false },
      baseForm({ unit: '', decimals: 2 })
    )
    expect(result.unit).toBe(false)
    expect(result.decimals).toBe(2)
  })

  test('a string unit is written; clearing it (no prior false) drops it', () => {
    expect(applyFormChange({}, baseForm({ unit: '°F' })).unit).toBe('°F')
    expect(
      applyFormChange({ entity: 'climate.test', unit: '°C' }, baseForm({ unit: '' })).unit
    ).toBeUndefined()
  })
})

describe('applyFormChange — control / header (regression guards)', () => {
  test('show_header false collapses the header to false', () => {
    const result = applyFormChange({ entity: 'climate.test' }, baseForm({ show_header: false }))
    expect(result.header).toBe(false)
  })

  test('#15: re-enabling the header restores faults from the cached header', () => {
    const cachedHeader = { faults: [{ entity: 'binary_sensor.low_battery' }] }
    const result = applyFormChange(
      { entity: 'climate.test', header: false },
      baseForm({ show_header: true }),
      cachedHeader
    )
    expect(result.header.faults).toEqual([{ entity: 'binary_sensor.low_battery' }])
  })

  test('#15: form field edits are layered on top of the cached header', () => {
    const cachedHeader = { faults: [{ entity: 'binary_sensor.low_battery' }] }
    const result = applyFormChange(
      { entity: 'climate.test', header: false },
      baseForm({ show_header: true, name: 'Living Room' }),
      cachedHeader
    )
    expect(result.header.faults).toEqual([{ entity: 'binary_sensor.low_battery' }])
    expect(result.header.name).toBe('Living Room')
  })

  test('#15: without a cached header, re-enabling produces no leftover header key (pruned as empty)', () => {
    // Consistent with #16's empty-container pruning: an empty `header: {}`
    // is behaviourally identical to no `header` key at all.
    const result = applyFormChange(
      { entity: 'climate.test', header: false },
      baseForm({ show_header: true })
    )
    expect(result.header).toBeUndefined()
  })

  test('#15: the cached header is cloned, not mutated', () => {
    const cachedHeader = { faults: [{ entity: 'binary_sensor.low_battery' }] }
    applyFormChange(
      { entity: 'climate.test', header: false },
      baseForm({ show_header: true, name: 'Living Room' }),
      cachedHeader
    )
    expect(cachedHeader).toEqual({ faults: [{ entity: 'binary_sensor.low_battery' }] })
  })

  test('hiding a mode that IS shown by default writes control.<mode>._hidden', () => {
    // fan's adapter default control includes 'preset' — hiding it changes
    // rendering vs. omitting `control`, so it must be persisted.
    const result = applyFormChange(
      { entity: 'fan.test' },
      baseForm({ entity: 'fan.test', show_preset: false })
    )
    expect(result.control.preset._hidden).toBe(true)
  })

  test('hiding a mode that is NOT shown by default needs no persistence', () => {
    // climate's adapter default control is only ['hvac'] — preset is already
    // hidden by default, so explicitly hiding it changes nothing.
    const result = applyFormChange({ entity: 'climate.test' }, baseForm({ show_preset: false }))
    expect(result.control).toBeUndefined()
  })

  test('a swing override entity is stored under control and pruned when removed', () => {
    const withOverride = applyFormChange(
      { entity: 'climate.test' },
      baseForm({ 'control.swing_vertical.entity': 'select.vanes' })
    )
    expect(withOverride.control.swing_vertical.entity).toBe('select.vanes')

    const removed = applyFormChange(withOverride, baseForm({ 'control.swing_vertical.entity': '' }))
    expect(removed.control?.swing_vertical?.entity).toBeUndefined()
  })
})

describe('applyFormChange — show_* toggle regression (5th switch resets everything to off)', () => {
  // Reported bug: on a climate entity (adapter default control = ['hvac']
  // only), turning ON preset/fan/swing/swing_vertical AND THEN the 5th
  // toggle (swing_horizontal) caused every switch to flip back to off.
  //
  // Root cause: once all 5 types are "shown" they're each represented as an
  // empty `{}` in `control` (no `_hidden` key). The old `hasRealOverrides`
  // check only asked "does any type have keys" — all empty → false — so
  // `control` was deleted entirely, and the card fell back to the adapter
  // default (`hvac` only), which reads back as every show_* toggle = false.

  test('turning on all 5 non-default types keeps control (does not reset)', () => {
    const result = applyFormChange(
      { entity: 'climate.test' },
      baseForm({
        show_preset: true,
        show_fan: true,
        show_swing: true,
        show_swing_vertical: true,
        show_swing_horizontal: true,
      })
    )
    expect(result.control).toBeDefined()
    for (const type of ['preset', 'fan', 'swing', 'swing_vertical', 'swing_horizontal']) {
      expect(result.control[type]).toEqual({})
    }
  })

  test('reads back as all show_* = true (does not regress to defaults)', () => {
    // Simulates the actual editor round-trip: apply the change, then re-read
    // via the same isModeEnabled logic the editor's _buildFormData uses.
    const isModeEnabled = (control: any, type: string): boolean => {
      if (control === false) return false
      if (Array.isArray(control)) return control.includes(type)
      if (control && typeof control === 'object') {
        if (control[type] === false || control[type]?._hidden === true) return false
        return type in control
      }
      return false // climate adapter default only includes 'hvac'
    }

    const result = applyFormChange(
      { entity: 'climate.test' },
      baseForm({
        show_preset: true,
        show_fan: true,
        show_swing: true,
        show_swing_vertical: true,
        show_swing_horizontal: true,
      })
    )

    expect(isModeEnabled(result.control, 'preset')).toBe(true)
    expect(isModeEnabled(result.control, 'fan')).toBe(true)
    expect(isModeEnabled(result.control, 'swing')).toBe(true)
    expect(isModeEnabled(result.control, 'swing_vertical')).toBe(true)
    expect(isModeEnabled(result.control, 'swing_horizontal')).toBe(true)
  })

  test('turning all 5 on is stable under a second, no-op apply (idempotent)', () => {
    const firstPass = applyFormChange(
      { entity: 'climate.test' },
      baseForm({
        show_preset: true,
        show_fan: true,
        show_swing: true,
        show_swing_vertical: true,
        show_swing_horizontal: true,
      })
    )
    // Re-applying the same (now already-saved) state must not drop control.
    const secondPass = applyFormChange(
      firstPass,
      baseForm({
        show_preset: true,
        show_fan: true,
        show_swing: true,
        show_swing_vertical: true,
        show_swing_horizontal: true,
      })
    )
    expect(secondPass.control).toEqual(firstPass.control)
  })

  test('turning all 5 back off returns to the minimal (no control) config', () => {
    const allOn = applyFormChange(
      { entity: 'climate.test' },
      baseForm({
        show_preset: true,
        show_fan: true,
        show_swing: true,
        show_swing_vertical: true,
        show_swing_horizontal: true,
      })
    )
    const allOff = applyFormChange(allOn, baseForm())
    expect(allOff.control).toBeUndefined()
  })

  test('fan entity: leaving preset at its default (shown) needs no override', () => {
    // fan's adapter default already includes 'preset' — show_preset staying
    // true should NOT force a persisted control key.
    const result = applyFormChange(
      { entity: 'fan.test' },
      baseForm({ entity: 'fan.test', show_preset: true })
    )
    expect(result.control).toBeUndefined()
  })
})

describe('shiftCollapseState (#22)', () => {
  test('shifts higher indices down after a middle removal', () => {
    expect(shiftCollapseState({ 0: true, 1: false, 2: true }, 1)).toEqual({ 0: true, 1: true })
  })

  test('removing the first item shifts everything down', () => {
    expect(shiftCollapseState({ 0: true, 1: false }, 0)).toEqual({ 0: false })
  })

  test('removing the last item just drops it', () => {
    expect(shiftCollapseState({ 0: true, 1: false }, 1)).toEqual({ 0: true })
  })

  test('empty map stays empty', () => {
    expect(shiftCollapseState({}, 0)).toEqual({})
  })
})
