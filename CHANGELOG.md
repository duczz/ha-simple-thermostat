# Changelog

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
