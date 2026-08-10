import { readFileSync } from 'node:fs'
import { THEMING_VARS } from '../config/themingVars'

// Keeps the documented theming API and the stylesheet honest with each other.
// Without this, a variable can be dropped from the CSS (or never implemented in
// the first place) while the docs keep promising it — which is exactly how
// `--st-font-size-m` ended up documented but non-existent for several releases.

const read = (relative: string) =>
  readFileSync(new URL(relative, import.meta.url), 'utf8')

const css = read('../styles.css')
const docs = read('../../docs/theming.md')

/** `--st-default-*` are internal fallback constants, not part of the public API. */
const isPublic = (name: string) => !name.startsWith('--st-default-')

const unique = (values: string[]) => Array.from(new Set(values)).sort()

const matchAll = (text: string, pattern: RegExp) =>
  Array.from(text.matchAll(pattern)).map((m) => m[1])

/** Every `--st-*` the stylesheet actually reads through `var()`. */
const implemented = unique(
  matchAll(css, /var\(\s*(--st-[a-z0-9_-]+)/gi).filter(isPublic)
)

/** Every `--st-*` mentioned in a code span in the docs (table rows and examples). */
const documented = unique(
  matchAll(docs, /`(--st-[a-z0-9_-]+)`?/gi)
    .concat(matchAll(docs, /(--st-[a-z0-9_-]+)\s*:/gi))
    .filter(isPublic)
)

describe('theming API: docs and stylesheet stay in sync', () => {
  test('every documented variable is actually read by the stylesheet', () => {
    const ghosts = documented.filter((name) => !implemented.includes(name))
    expect(ghosts).toEqual([])
  })

  test('every variable the stylesheet reads is documented', () => {
    const undocumented = implemented.filter((name) => !documented.includes(name))
    expect(undocumented).toEqual([])
  })

  test('the public API is non-trivial (guards against a broken regex)', () => {
    expect(implemented.length).toBeGreaterThan(40)
  })
})

describe('theming API: the editor reference list matches the stylesheet', () => {
  // The Custom CSS panel lists the variables so they are discoverable where the
  // CSS is written. That list is a third copy of the same knowledge — pin it.
  const listed = unique(THEMING_VARS.flatMap((group) => group.variables))

  test('the editor lists no variable the stylesheet does not read', () => {
    expect(listed.filter((name) => !implemented.includes(name))).toEqual([])
  })

  test('the editor lists every variable the stylesheet reads', () => {
    expect(implemented.filter((name) => !listed.includes(name))).toEqual([])
  })

  test('no variable is listed under two groups', () => {
    const all = THEMING_VARS.flatMap((group) => group.variables)
    expect(all.length).toBe(listed.length)
  })
})

describe('mode colors follow the Home Assistant theme', () => {
  // HA defines these in every version we support (min 2024.8). Losing the
  // reference would silently pin the card back to our own hardcoded palette.
  test.each([
    ['--st-auto-color', '--state-climate-auto-color'],
    ['--st-heat_cool-color', '--state-climate-heat-cool-color'],
    ['--st-cool-color', '--state-climate-cool-color'],
    ['--st-heat-color', '--state-climate-heat-color'],
    ['--st-off-color', '--state-inactive-color'],
    ['--st-fan_only-color', '--state-climate-fan_only-color'],
    ['--st-dry-color', '--state-climate-dry-color'],
  ])('%s falls back to %s', (own, haVariable) => {
    const line = css
      .split('\n')
      .find((l) => l.includes(`var(${own},`))
    expect(line).toBeDefined()
    expect(line).toContain(haVariable)
  })

  test('the legacy per-mode names keep working as the outer declaration', () => {
    // Configs in the wild set --cool-color etc. directly; they must stay the
    // property being declared so a user declaration overrides ours.
    for (const legacy of ['--cool-color', '--heat-color', '--dry-color']) {
      expect(css).toContain(`${legacy}: var(--st-`)
    }
  })
})
