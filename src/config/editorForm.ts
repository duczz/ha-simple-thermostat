import { getAdapter } from '../adapters'

/**
 * Pure form <-> config transform for the visual editor.
 *
 * Extracted from the LitElement so the (fiddly) delete-on-default logic can be
 * unit-tested without a browser. The editor's `_applyFormChange` is a thin
 * wrapper around `applyFormChange`.
 */

export function setNested(obj: any, path: string, value: any) {
  const parts = path.split('.')
  let o = obj
  while (parts.length > 1) {
    const p = parts.shift()!
    if (!Object.hasOwn(o, p)) o[p] = {}
    o = o[p]
  }
  o[parts[0]] = value
}

export function deleteNested(obj: any, path: string) {
  const parts = path.split('.')
  let o = obj
  while (parts.length > 1) {
    const p = parts.shift()!
    if (!o[p]) return
    o = o[p]
  }
  delete o[parts[0]]
}

const DIRECT_PATHS = [
  'entity',
  'current_value_entity',
  'hide_setpoint',
  'setpoint_style',
  'decimals',
  'unit',
  'fallback',
  'layout.step',
  'layout.mode.names',
  'layout.mode.icons',
  'layout.mode.headings',
  'layout.sensors.type',
  'layout.sensors.labels',
  'hide.temperature',
  'hide.state',
  'icon.temperature',
  'icon.state',
  'label.temperature',
  'label.state',
  'sensors',
  'tap_action',
  'hold_action',
  'double_tap_action',
]

// Values equal to these defaults are omitted from the saved config so the
// visual editor doesn't pollute a minimal YAML with `decimals: 1`,
// `layout.step: row`, `hide_setpoint: false`, … (all behaviourally identical
// to their absence).
const FORM_DEFAULTS: Record<string, any> = {
  decimals: 1,
  setpoint_style: 'number',
  'layout.step': 'row',
  'layout.mode.names': true,
  'layout.mode.icons': true,
  'layout.mode.headings': false,
  'layout.sensors.type': 'table',
  'layout.sensors.labels': true,
  'hide.temperature': false,
  'hide.state': false,
  hide_setpoint: false,
}

// Mode types the editor's show_* boolean toggles manage (grid in the
// "Mode controls" section). `hvac` is force-included separately and has no
// show_* toggle, so it's intentionally excluded here.
const SHOW_TOGGLE_TYPES = ['preset', 'fan', 'swing', 'swing_vertical', 'swing_horizontal']

const ACTION_DEFAULTS: Record<string, any> = {
  tap_action: { action: 'more-info' },
  hold_action: { action: 'none' },
  double_tap_action: { action: 'none' },
}

// Empty nested containers left behind after delete-on-default get pruned so
// the config stays clean (no `layout: {}` / `hide: {}` residue). Children
// before parents.
const PRUNE_CONTAINERS = [
  'layout.mode',
  'layout.sensors',
  'layout',
  'hide',
  'icon',
  'label',
  // An empty `header: {}` behaves identically to no header key (both show the
  // header with defaults). `header: false` is not an object → never pruned.
  'header',
]

function isEmptyValue(v: any): boolean {
  return (
    v === undefined ||
    v === null ||
    v === '' ||
    (Array.isArray(v) && v.length === 0)
  )
}

export function isDefaultValue(path: string, value: any): boolean {
  if (path in ACTION_DEFAULTS) {
    return JSON.stringify(value) === JSON.stringify(ACTION_DEFAULTS[path])
  }
  if (path in FORM_DEFAULTS) {
    return value === FORM_DEFAULTS[path]
  }
  return false
}

function getNested(obj: any, path: string): any {
  return path.split('.').reduce((o, p) => (o == null ? o : o[p]), obj)
}

function pruneEmptyContainers(copy: any) {
  for (const path of PRUNE_CONTAINERS) {
    const obj = getNested(copy, path)
    if (obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).length === 0) {
      deleteNested(copy, path)
    }
  }
}

/**
 * Shift an index-keyed record down by one after the item at `removedIndex` is
 * removed, so collapse/expand state stays attached to the right rows.
 */
export function shiftCollapseState<T>(
  map: Record<number, T>,
  removedIndex: number
): Record<number, T> {
  const next: Record<number, T> = {}
  for (const [k, v] of Object.entries(map)) {
    const idx = Number(k)
    if (idx < removedIndex) next[idx] = v
    else if (idx > removedIndex) next[idx - 1] = v
    // idx === removedIndex is dropped
  }
  return next
}

export function applyFormChange(config: any, updated: any, cachedHeader?: any): any {
  const copy = structuredClone(config) as any

  for (const path of DIRECT_PATHS) {
    const newVal = updated[path]

    // Preserve an explicit `unit: false` (hide unit) when the text field is
    // shown empty. Editing other fields must not silently drop it.
    if (path === 'unit' && (newVal === '' || newVal == null) && config?.unit === false) {
      setNested(copy, 'unit', false)
      continue
    }

    if (isEmptyValue(newVal) || isDefaultValue(path, newVal)) {
      deleteNested(copy, path)
    } else {
      setNested(copy, path, newVal)
    }
  }

  if (updated.show_header === false) {
    copy.header = false
  } else {
    if (copy.header === false || copy.header == null) {
      // Re-enabling the header (or enabling it for the first time in this
      // call) starts from the last known header object instead of `{}` —
      // otherwise editor-only-unknown fields like `faults` (YAML-only, no
      // form field) are silently dropped by an off/on toggle.
      copy.header = cachedHeader ? structuredClone(cachedHeader) : {}
    }
    const headerName = updated.name
    const headerIcon = updated.icon
    const toggleEntity = updated['toggle.entity']
    const toggleLabel = updated['toggle.name']
    const toggleIcon = updated['toggle.icon']

    if (headerName) copy.header.name = headerName
    else delete copy.header.name
    if (headerIcon) copy.header.icon = headerIcon
    else delete copy.header.icon

    if (toggleEntity) {
      copy.header.toggle = copy.header.toggle || {}
      copy.header.toggle.entity = toggleEntity
      if (toggleLabel) copy.header.toggle.name = toggleLabel
      else delete copy.header.toggle.name
      if (toggleIcon) copy.header.toggle.icon = toggleIcon
      else delete copy.header.toggle.icon
    } else {
      delete copy.header.toggle
    }
  }

  if (updated.step_size === 'auto' || updated.step_size === '' || updated.step_size == null) {
    delete copy.step_size
  } else {
    const n = Number(updated.step_size)
    copy.step_size = Number.isNaN(n) ? updated.step_size : n
  }

  const existingControl = (typeof copy.control === 'object' && copy.control !== null && !Array.isArray(copy.control) ? copy.control : {}) as any
  const desired: Record<string, any> = { ...existingControl, hvac: existingControl.hvac ?? {} }

  const ensureObject = (obj: any, key: string) => {
    if (typeof obj[key] !== 'object' || obj[key] === null) obj[key] = {}
  }

  if (updated.show_preset === false) { ensureObject(desired, 'preset'); desired.preset._hidden = true }
  else if (updated.show_preset === true) { ensureObject(desired, 'preset'); delete desired.preset._hidden }
  if (updated.show_fan === false) { ensureObject(desired, 'fan'); desired.fan._hidden = true }
  else if (updated.show_fan === true) { ensureObject(desired, 'fan'); delete desired.fan._hidden }
  if (updated.show_swing === false) { ensureObject(desired, 'swing'); desired.swing._hidden = true }
  else if (updated.show_swing === true) { ensureObject(desired, 'swing'); delete desired.swing._hidden }
  if (updated.show_swing_vertical === false) { ensureObject(desired, 'swing_vertical'); desired.swing_vertical._hidden = true }
  else if (updated.show_swing_vertical === true) { ensureObject(desired, 'swing_vertical'); delete desired.swing_vertical._hidden }
  if (updated.show_swing_horizontal === false) { ensureObject(desired, 'swing_horizontal'); desired.swing_horizontal._hidden = true }
  else if (updated.show_swing_horizontal === true) { ensureObject(desired, 'swing_horizontal'); delete desired.swing_horizontal._hidden }

  const modes = ['swing_vertical', 'swing_horizontal']
  for (const mode of modes) {
    if (`control.${mode}.entity` in updated) {
      const entityVal = updated[`control.${mode}.entity`]
      if (entityVal) {
        desired[mode] = desired[mode] ?? {}
        desired[mode].entity = entityVal
      } else if (desired[mode]) {
        delete desired[mode].entity
      }
    }
  }

  const adapter = getAdapter(copy.entity)
  const defaultTypes = new Set(adapter.getDefaultControl())

  // Per-type "hide when off" toggles (control.<type>._hide_when_off). The flag
  // only makes sense for a control row that is actually shown, so setting it
  // must not silently enable a hidden/absent row — it's applied only when the
  // type is shown (explicitly, or shown by the adapter default). Clearing is
  // always honoured so the flag can be removed regardless.
  const isShown = (t: string) => {
    const d = desired[t]
    if (d && typeof d === 'object') return d._hidden !== true
    return defaultTypes.has(t)
  }
  // Each editor toggle maps to one or more control types. The single "swing"
  // toggle covers all swing variants (base + vertical + horizontal) since they
  // are one concept to the user.
  const HIDE_WHEN_OFF_GROUPS: Record<string, string[]> = {
    preset: ['preset'],
    fan: ['fan'],
    swing: ['swing', 'swing_vertical', 'swing_horizontal'],
  }
  for (const [toggleType, types] of Object.entries(HIDE_WHEN_OFF_GROUPS)) {
    const key = `control.${toggleType}._hide_when_off`
    if (!(key in updated)) continue
    for (const t of types) {
      if (updated[key] === true && isShown(t)) {
        ensureObject(desired, t)
        desired[t]._hide_when_off = true
      } else if (desired[t] && typeof desired[t] === 'object') {
        delete desired[t]._hide_when_off
      }
    }
  }

  // Only keep control if it actually changes rendering vs. omitting the key
  // entirely (which falls back to `adapter.getDefaultControl()`).
  //
  // BUG (found 2026-07-03): the previous check only asked "does this type's
  // object have any keys" — an empty `{}` (meaning "shown, no _hidden") was
  // treated as "no override". But for a climate entity (default: only
  // `hvac`), turning ON preset/fan/swing/swing_vertical/swing_horizontal
  // produces exactly that: every type's object is empty `{}` (no _hidden).
  // hasRealOverrides was therefore false, `control` got deleted, and the
  // card reverted to the adapter default (hvac only) — flipping every show_*
  // toggle back to off in the editor.
  //
  // Fix: for the 5 types the editor's show_* toggles manage, "shown" (empty
  // object) only counts as an override when it differs from whether the
  // adapter shows that type by default; likewise "hidden" only counts when
  // the adapter would otherwise show it. Any other key (custom name/icon,
  // an override `entity`, a per-mode-value override) is always a real
  // override regardless of visibility parity.
  const hasRealOverrides = Object.entries(desired).some(([type, val]) => {
    if (typeof val !== 'object' || val === null) return false
    const keys = Object.keys(val)

    if (keys.length === 0) {
      return SHOW_TOGGLE_TYPES.includes(type) && !defaultTypes.has(type)
    }
    if (keys.length === 1 && keys[0] === '_hidden' && val._hidden === true) {
      return SHOW_TOGGLE_TYPES.includes(type) && defaultTypes.has(type)
    }
    // Any other shape (custom keys, or _hidden combined with custom keys)
    // is always meaningful and must be persisted.
    return true
  })
  if (hasRealOverrides) {
    copy.control = desired
  } else {
    delete copy.control
  }

  pruneEmptyContainers(copy)

  return copy
}
