# Changelog

## [2.3.2 - Unreleased]

### 🎨 Design Polish

- **Mode buttons wrap** — Buttons now wrap to the next line instead of overflowing the card when there are too many modes
- **More mode icons** — Added icons for `normal`, `powerful`, `silent` fan modes; icon lookup is now case-insensitive so modes like `Quiet` or `Normal` (capitalised by the integration) also get icons

## [2.3.1] – 2026-05-11

### ✨ Improvements

- **Live updates in editor** — Text fields in the visual editor now update the card preview live on keystroke instead of on blur
- **New default step layout** — Changed default `layout.step` from `column` to `row` for a more compact temperature control display by default
- **Editor field alignment** — Fixed vertical alignment of side-by-side editor fields (like Toggle entity vs Toggle label)
- **Collapsed Custom CSS panel** — The "Custom CSS" panel in the visual editor is now collapsed by default to reduce clutter
- **Code editor for Custom CSS** — The Custom CSS textarea is now a syntax-highlighted code editor (`ha-code-editor`)
- **Header toggle icon** — `header.toggle.icon` is now supported; configurable via the visual editor when a toggle entity is set
- **`step_size` auto-detection** — Falls back to the entity's `target_temp_step` attribute when not configured; editor shows a dropdown with `Auto (from entity)`, `0.1`, `0.5`, `1`
- **`decimals` accepts any value** — Editor field changed from fixed dropdown to free-entry number field; no longer clobbers custom values like `2` or `3`
- **Mode Controls simplified** — Removed the "Show mode controls" master toggle; names, icons, and headings toggles are always visible; disabling both names and icons automatically sets `control: false` (no empty buttons); `control: false` remains available via YAML
- **Editor: Hide section** — New toggles in Layout & Display to hide the temperature and/or state row (`hide.temperature`, `hide.state`)
- **Editor: Labels section** — New text fields to override the temperature and state row labels (`label.temperature`, `label.state`)
- **Editor: Sensors section** — New controls for sensor layout type (`layout.sensors.type`: list/table) and sensor label visibility (`layout.sensors.labels`)
- **Build timestamp in editor footer** — Editor footer now shows version and build time, making it easy to verify a new file is loaded
- **Unavailable/unknown entity styling** — Card is greyed out and non-interactive when the climate entity is `unavailable` or `unknown`
- **Loading state** — Card shows a shimmering placeholder during initial mount instead of a spurious "Entity not available" error
- **Configurable tap / hold / double-tap actions** — Full HA-standard `tap_action`, `hold_action`, and `double_tap_action` config (more-info / none / navigate / url / toggle / call-service); built-in pointer-based hold (500ms) and double-tap (250ms) detection on the temperature display; dedicated "Interactions" panel in the visual editor
- **Build timestamp in local time** — Editor footer build timestamp now uses local time instead of UTC, matching what users expect
- **Sensor layout default consistent** — Editor's "Sensor layout" dropdown now defaults to `table` matching the renderer (was `list` in the editor, `table` in the renderer)
- **Less stale `render()`** — Removed legacy destructuring-from-`this` in `render()`; now reads state at the top of the function for clarity

### 🎨 Design polish

- **`ha-switch` padding scoped to editor** — The global `ha-switch { padding: 16px 6px }` rule no longer affects the in-card header toggle, which now sits naturally next to the title instead of being inflated
- **Mode button layout** — Icons now sit beside the label (was: stacked above); compact button with capitalized text; gap between buttons increased from `2px` to `4px`; symmetric horizontal padding
- **Header padding rebalanced** — Reduced top padding from `24px` to `16px` and bottom from `16px` to `12px` for a more compact, balanced header
- **Sensor row spacing** — Removed redundant `padding-bottom` on sensor cells and tightened `line-height` to `1.4` so labels and values sit closer to the temperature display
- **Horizontal alignment** — Mode button row now uses the same horizontal padding (`16px`) as the header and body, so all rows are visually aligned to the same left/right boundary
- **Mode headings hidden by default** — `layout.mode.headings` now defaults to `false`; opt-in via config or editor
- **Toggle icon styling** — Added explicit margin and size for the header toggle icon to align with the label

### 🐛 Bug Fixes

- **Header hidden when not explicitly configured** — `header` not set in YAML was treated as `false` (`?? false` coercion); now defaults to `{}` so the header shows by default matching the editor toggle state
- **`getStubConfig` fallback entity** — No longer falls back to the literal string `climate.my_thermostat` when no climate entity exists; returns an empty entity picker instead
- **Editor render crash on early mount** — `render()` now guards against `this.config` being undefined before `setConfig()` is called
- **CSS class injection from `hvac_action`** — Entity-derived class values are now sanitized (only `[a-z0-9_-]`) before being applied to `ha-card`, preventing weird values from integrations from breaking CSS selectors

### 🔧 Code quality

- **TypeScript errors in `main.ts` resolved** — Cleaned up ~8 outstanding type errors that had accumulated over sessions: nullable `header` handling, `values.list` safety, explicit `PreparedSensor[]` for `builtins`, `TemplateResult[]` for warnings, narrowed `header.toggle` access
- **Dead CSS removed** — Removed unused `.editor-row`, `.editor-section-title`, `.editor-section-title--clickable`, `.editor-details`, `.editor-details-icon` (legacy from previous editor design, ~30 lines)
- **More CSS variables for theming** — Added `--st-mode-color`, `--st-mode-border-radius`, `--st-mode-transition`, `--st-header-icon-color` and a `--st-default-*` palette of fallbacks so themes can override more aspects of the card
- **Tests for toggle icon** — Added unit tests for the new `header.toggle.icon` config field (default `false`, preserved when set)

### 🔨 Tooling & Build

- **GitHub Release workflow** — Added automated release workflow via GitHub Actions
- **Repository URLs** — Updated `hacs.json` and `package.json` with the new repository location
- **Artifact name** — Built file is `simple-thermostat.js` (matches the original fork)


## [2.3.0] – 2026-05-07

This release modernises the card for current Home Assistant versions (2024.1+), fixes numerous crashes, and improves the visual editor, accessibility, and build tooling. The original release (v2.2.2) has not been updated since 2021.

### ⚡ HA Compatibility

- Migrated from `lit-element` 2.x / `lit-html` to `lit` 3.x — required for HA 2024.1+
- Updated all decorator imports to `lit/decorators.js`
- Updated `unsafeHTML` import to `lit/directives/unsafe-html.js`
- Fixed class attribute binding that broke silently in Lit 3
- Replaced `hass.resources[lang]` with `hass.localize()` — the old API was removed from HA
- Fixed broken entity existence check (`typeof entity === undefined` always returned `false`)
- All Polymer-era CSS variables removed (`--paper-font-*`, `--iron-icon-*`, `--paper-item-icon-color`) — replaced with `--ha-*` equivalents

### 🌐 Modern HA API Adoption

- **`hass.formatEntityState()`** — State display now uses the official HA formatting API (HA 2022.6+) with graceful fallback
- **`hass.performAction()`** — All service calls use `performAction()` (HA 2024.8+) with automatic fallback to `callService()`
- **`hass.localize()`** — All localisation now uses the current HA API; legacy `hass.resources` removed
- **`getStubConfig()`** — Auto-selects the first `climate.*` entity when the card is added via the HA card picker
- **`ha-icon-button ha-icon { display: flex }`** — Fix for icon buttons becoming invisible in recent HA versions
- **`--ha-font-smoothing`** — Card now inherits HA's global font-smoothing setting

### 🐛 Bug Fixes

- **Temperature display missing** — `setpoints` auto-detection was broken when `setpoints:` was not configured; cards showed no temperature
- **Attribute-only sensor crashes** — `entity` variable shadowing caused `TypeError` when a sensor used `attribute:` without `entity:`
- **Unknown HVAC modes dropped** — Custom firmware modes were silently lost during sort; now appended after known modes
- **Preset/fan/swing modes not translated** — Used a legacy HA localisation key that is no longer populated in modern HA
- **`ui.swing_mode` / `ui.preset_mode` missing in templates** — Both keys were documented but absent from the template engine, returning `undefined`
- **Toggle entity crash** — `parseToggle` threw when the configured entity was offline or removed; now returns `null`
- **Toggle entity null dereference** — `toggle.entity.entity_id` accessed without guard in header render; changed to `toggle.entity?.entity_id`
- **Fault icons render when entity offline** — `parseFaults` now filters out entities absent from `hass.states`
- **Fault icons crash** — `parseFaults` threw when `faults:` was not configured; added null guard
- **Fault icon type mismatch** — Function signature accepted `Array<Fault>` but call site passes `Array<Fault> | undefined`; updated signature to match
- **Template syntax errors crashed card** — A bad Squirrelly template threw uncaught; now renders inline error message
- **`decimals` on formatted sensor values** — Applying `decimals` on top of `hass.formatEntityState()` output produced `"N/A"`
- **`wrapSensors` labels default ignored** — `layout.sensors: { type: 'list' }` without `labels` key hid labels instead of showing them
- **v3 sensor crash when entity offline** — Destructuring `undefined` context threw `TypeError`; added early-return guard
- **Editor config mutation** — `valueChanged` and `toggleHeader` operated on the live config object instead of a deep clone
- **Editor delete broken** — Deleting dotted config paths like `header.name` had no effect; added `deletePath()` helper
- **Editor `decimals` / `step_size` stored as strings** — Now correctly parsed to numbers
- **Sensor icons blank in HA 2021.11+** — Switched from attribute to property binding (`.icon=${...}`)
- **Memory leak** — Timers and debounce not cleared on disconnect
- **`set hass()` crash on startup** — Crashed during HA startup when `hass.states` was not yet available
- **`_hide` accumulated state** — Accumulated across config changes instead of resetting to defaults
- **`formatNumber` returned `"NaN"`** — Now returns the configured fallback string for invalid input
- **`openEntityPopover` called without null guard** — Changed to `openEntityPopover?.(...)`
- **`_callAction` with malformed service config** — Validates action string format before calling `callService` fallback
- **`hui-warning` replaced with `ha-alert`** — Modern public HA API
- **`align-self: left` invalid CSS** — Changed to `align-self: flex-start`
- **`updated()` called wrong super method** — Was calling `super.connectedCallback()` instead of `super.updated(changedProperties)`
- **Redundant `options = options || {}` in `fireEvent`** — Removed; already handled by default parameter

### ✨ Improvements

- **Custom CSS** — Native `styles:` config key; CSS injected into Shadow DOM; no card-mod required
- **Locale-aware number formatting** — Temperature display respects the HA user's locale (comma vs. dot as decimal separator)
- **Visual editor** — Grouped into logical sections (Header, Mode Controls, Layout & Display, Custom CSS); "Show mode controls" toggle sets `control: false` to fully hide mode buttons
- **Performance** — `set hass()` short-circuits on unchanged entity state; full recompute only when needed
- **Full keyboard accessibility** — All controls have `role`, `tabindex`, `aria-label`, `aria-pressed`, and keyboard handlers
- **Smooth UI transitions** — Mode buttons animate on hover/press with `:focus-visible` outlines
- **Responsive temperature font size** — `clamp()` instead of fixed breakpoint jumps
- **Card padding** — Left/right padding added to `ha-card` for consistent visual spacing
- **`getCardSize()` / `getLayoutOptions()` dynamic** — Computed from config instead of hardcoded values
- **Faster temperature response** — Debounce reduced from 1000 ms to 500 ms
- **Auto-timeout for updating state** — "Updating" indicator clears after 10 s if HA never acknowledges
- **`documentationURL`** added to card registration — shown in HA card picker

### 🔨 Tooling & Build

- Node 24, updated Rollup / PostCSS / TypeScript plugins
- TypeScript: `strictNullChecks: true`, `resolveJsonModule: true`, `target: ES2021`, `lib: ES2022`, `moduleResolution: node`
- Jest: renamed to `jest.config.cjs`, modern ts-jest config, CSS mock — all tests pass
- GitHub Actions: `actions/checkout@v4`, `setup-node@v4`, Node 24; auto-build workflow commits `dist/` on master push
- `hacs.json` minimum HA version updated to `2024.1.0`, `filename` field added
- `.gitignore` fixed and expanded; `dist/simple-thermostat.js` now tracked in repo
- Removed orphaned files: `yarn.lock`, `tracker.json`, `.releaserc.json`, `size-limit.yml`
- Images moved to `assets/` for a cleaner root directory
- Added `typecheck` script (`tsc --noEmit`)
