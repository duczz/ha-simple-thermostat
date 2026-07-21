# Changelog

## [2.4.1] – 2026-07-21

### ✨ New Features (Fork-Exclusive)

- **Circular dial setpoint (`setpoint_style: dial`)** — Show the target as Home Assistant's native circular slider: drag the ring (live update), mode-colored, with +/- buttons and the current action + temperature in the center ("Off" when off). Works for single and **dual `heat_cool`** setpoints, plus `fan` and `humidifier`. Selectable in the editor's new **Setpoint** section, tunable via `--st-dial-*`, and it falls back to the number display on older HA cores. The center text can be relabelled via `dial_action_labels`.
- **Press-and-hold on the +/- buttons** — Holding an increase/decrease button (number or dial) repeats the step until you let go; a single tap still steps once.

### ✨ Improvements

- **Reorder sensors and banners** — Each custom sensor and each banner now has ▲/▼ buttons in the editor to move it up or down. Banners render in the configured order: new banners are still inserted pre-sorted by severity (error → warning → info → success), but you can now override that order manually and it is honoured.
- **Mode labels in the visual editor** — A new **Mode labels** section lets you rename a mode or set its icon (e.g. `cool` → "Kühlen") per mode type the entity supports, without hand-writing the `control` dictionary. A renamed mode now shows consistently on the buttons, the built-in **State** sensor row, and the dial's center label — a single rename, applied everywhere.
- **Number setpoint: stacked unit/decimals** — The `number` style now renders the value like HA's big-number component (large integer with the unit stacked above the decimals), matching the dial. When off it shows the localized (or renamed) off label instead of a hardcoded "OFF".
- **"Hide when off" mode controls now in the visual editor** — _This is **not** a new feature._ `_hide_when_off` is a long-standing but undocumented option inherited from the original upstream `simple-thermostat` (2020). This release only surfaces it in the editor — a per-row toggle for `preset`, `fan`, and `swing` — and documents the YAML key (which works for every mode type).

### 🐛 Bug Fixes

- **The HVAC mode bar no longer vanishes when a `control` block omits it** — An object `control` that listed only secondary types (e.g. `preset` / `fan` / `swing`) used to drop the primary heat/cool/off bar. It is now always rendered unless explicitly hidden (`control.hvac: false` or `_hidden: true`), matching the editor.
- **Sensor label color (chips / list / table)** — With `state_text_color` (or a static `text_color`) set, the sensor's label used to take the same color as its value. Only the value is tinted now; the label stays neutral, matching the `badges` layout.

## [2.4.0] – 2026-07-08

### ✨ New Features (Fork-Exclusive)

- **Advanced Banner System (`banners`)** — Designed and implemented a completely original, ground-up Banner engine exclusive to this fork. Featuring a custom modern "Accent Left-Border" design, banners support rich conditions (`entity`, `attribute`, `state`, `above`, `below`), text templating (`{{value}}`), and automatic priority sorting (Error > Warning > Info > Success). The visual editor now includes an independent configuration panel with 1-click generation for common alerts.
- **Chips & Badges Sensor Layouts** — Introduced two entirely new layout engines (`chips` and `badges`) designed specifically for this repository. They seamlessly integrate with Home Assistant's native styling, built on a robust and proprietary CSS Flexbox architecture that uniquely sets this version apart.

### ✨ Additional Features

- **Interactive Sensors (`display_as`)** — An original UX concept that transforms static text sensors into fully interactive widgets! Using a rendering layer engineered entirely independently from the main project, you can now render sensors as Toggle Switches (`switch`), Sliders (`slider`), or Select Dropdowns (`select`).
- **Sensor Editor Architecture Overhaul** — A completely redesigned, custom configuration UI architecture. Sensors are now neatly organised within their own expansion panel, featuring intuitive inline options to manage our new state color engines seamlessly.
- **Sensor State Colors (`state_color` & `state_text_color`)** — We've engineered a custom evaluation logic that allows dynamic CSS color injection for both icons and text based on exact state matches. This entirely independent feature brings dynamic, state-aware coloring to your sensors directly from our overhauled UI.
- **Sensor Base Color** — You can now assign a static icon color (`color`) for custom sensors directly in the visual editor.
- **Right-Aligned Step Controls (`layout.step: right`)** — Added a new `right` option for the `layout.step` configuration. This new option allows you to position the temperature adjustment buttons (plus/minus) neatly to the right of the current temperature display for a more compact and streamlined look.

### ✨ Improvements

- **Editor Mode Sort Order** — `swing_vertical` now correctly appears before `swing_horizontal` in the visual editor for better usability.
- **Visual Editor YAML Serialization** — The visual editor now saves the `control` modes as a YAML dictionary (`hvac:`, `preset:`) instead of a list (`- hvac`, `- preset`). This makes it vastly easier to manually add custom names and icons in the code editor without having to restructure the YAML syntax.
- **Custom Mode Override Resiliency** — The card now safely handles empty YAML mode keys (e.g., `hvac:` with nothing beneath it), preventing the UI from crashing with null destructuring errors.
- **Refined Mode Icons** — Updated the default icons for `normal` (`mdi:scale-balance`), `powerful` (`mdi:lightning-bolt`), and `quiet`/`silent` (`mdi:feather`) to be more visually distinct from the standard fan speed icons.
- **Mode Sorting** — Added `auto comfort` and `normal` to the internal sorting logic to ensure these modes are ordered correctly.

### 🐛 Bug Fixes

- **Lifecycle Race Condition** — Fixed an issue where the card could fail to render correctly or update if Home Assistant data arrived before the card's configuration (`setConfig` vs `set hass` synchronization).
- **Attribute Initialization Crash** — Fixed a `TypeError` crash caused by missing `attributes` objects when Home Assistant transiently provides incomplete entity states.
- **Sensor Table Layout Integrity** — Fixed an issue where interactive sensors without labels would break the CSS grid alignment in `table` layout mode.
- **"Entity Not Available" Flickering (Grace Period)** — Fixed an annoying issue where the card would completely destroy its layout and flash an "Entity not available" error whenever an integration reloaded or briefly disconnected in the background. The card now implements a smart 5-second "Grace Period" where it preserves the last known valid state, completely eliminating UI flickering while still correctly reporting true configuration errors.
- **Custom Mode Names (`name`)** — Fixed a bug where explicitly provided custom `name` overrides in the `control:` configuration were being ignored and overwritten by Home Assistant's default translations. The card now correctly prioritizes the user's custom `name`.
- **`getTrackedEntities` object extraction** — Fixed state tracking to properly extract entities when custom sensors are configured using the object format (`sensors: [{entity: "..."}]`) under config version 3, ensuring live updates for these sensors work reliably.
- **YAML Override Bug** — Fixed a long-standing issue where using the visual editor to modify `sensors` would be completely ignored if the legacy `entities` key was still present in the underlying YAML configuration. The card now correctly prioritizes the configuration.
- **Visual Editor Stability** — The sensor configuration form now actively validates your `display_as` selection. If you change a sensor's entity to an incompatible domain, the widget type automatically resets to a safe default, preventing UI glitches.
- **Visual Editor Add Button** — Adjusted CSS grid constraints (`min-width: 0`) in the editor so that the "Add Sensor" (+) button no longer overflows the container on small window sizes.
- **Sensor List Layout Overflow** — Completely overhauled the `.sensors.as-list` CSS structure to use Flexbox (`flex-direction: column`) instead of CSS Grid. This definitively prevents horizontal text overflowing when long sensor strings are placed inside tight layout containers.
- **Interactive Widgets in Chips** — Fixed an issue where the new `display_as` interactive widgets inside `chips` layout would trigger the details popover of the entire chip when clicked. The chip's label/icon now safely triggers the details popover, while the widget itself remains fully functional without bubbling.
- **Defensive Type Safety (`null` & `undefined`)** — Implemented highly robust nullish coalescing checks across the codebase to prevent `TypeError` UI crashes when `state` is explicitly `null` or when a custom Template Sensor does not map an underlying `entity`.
- **Fault Icon Live Updates** — Header `faults` entities are now part of the tracked-entity list introduced in 2.3.6, so fault icons update live instead of freezing until an unrelated tracked entity changes.
- **Editor Live Preview State** — Removing `sensors:`, `step_size:` or a `sensors: false` flag from the config now correctly resets the card state in the live preview (previously the old values could stick until a reload).
- **Localized Current Temperature** — The "Currently" sensor value now respects the HA number format (comma locales) just like the setpoint display.
- **`translate` Template Filter** — The v3 template filter `{{value|translate}}` built a doubled translation key when used without a prefix and therefore always returned the raw value. It now resolves `state_attributes.<domain>.<value>` correctly (explicit prefixes are unchanged).
- **Mode Toggle Reset Bug** — Turning on all five "Show preset/fan/swing/vert. swing/horiz. swing" toggles in the visual editor (for an entity where none of them are shown by default, e.g. a plain climate) silently deleted the entire `control:` config and reset every toggle back to off. Fixed the underlying check that decides whether `control:` needs to be saved at all.
- **Header Name/Icon/Toggle/Faults Lost on Toggle** — Turning the header off and back on in the visual editor dropped the header's name, icon, toggle, and `faults` (previously only `faults` was fixed — the name/icon/toggle form fields looked unaffected but silently went blank while the header was hidden and wiped themselves on re-enable). The editor now remembers and restores the full header when re-enabled, while still letting you intentionally clear a field.
- **Lifecycle Race Condition (follow-up)** — The earlier fix above didn't cover every path: if `hass` was assigned before `setConfig` was ever called, the very first render pass (LitElement always renders once after connecting, regardless of property changes) crashed with `TypeError: Cannot read properties of undefined (reading 'decimals')`. `render()` now guards on a missing config before touching it.
- **Setpoint Change Lost on Quick Navigation** — Changing the temperature and navigating away within the 500ms debounce window silently dropped the change (the pending service call was cancelled instead of sent). It's now flushed immediately when the card is removed from the DOM.

### 🔒 Security

- **XSS Hardening in `version: 3` Templates** — Templated sensors render with HTML auto-escaping disabled (needed for filters like `icon`/`css`/`relativetime` to produce real markup) and inject the result via `unsafeHTML`. Entity-derived values (attributes, state) reflected into a template — including the default sensor label `{{friendly_name}}` — are now HTML-escaped before templating, so a name/attribute value that happens to contain markup (e.g. mirrored from an external cloud/device integration) can no longer inject real HTML/JS into the dashboard. Custom templates using the built-in filters are unaffected.

## [2.3.6] – 2026-06-02

### ✨ New Features

- **Advanced State-Tracking (`_trackedStateRefs`)** — Highly optimized, dynamic state reference tracking. The card now compiles a precise list of all referenced entities (primary entity, external sensors, header toggles, custom sensors) and only re-renders when one of these specific entities updates in the global Home Assistant state. This drastically reduces frontend CPU usage and dashboard lags while guaranteeing 100% reliable live updates for all configured secondary sensors.
- **`entities` Config Key Alias** — Fully supports the standard Home Assistant Lovelace config key `entities:` alongside the legacy `sensors:` key, aligning with official HA dashboard practices. A robust fallback ensures all existing dashboards using `sensors:` continue to work flawlessly.
- **Extended Fan Controls** — Added direct support for fan direction (`direction`) and swing/oscillation (`oscillating`) controls. The fan adapter now automatically registers these controls, and the card handles boolean and list-based attributes beautifully.
- **Custom Fan Speed Icons (Speeds 4 & 5)** — Native custom iconset `st` registered dynamically. It overlays high-quality speed number indicators directly onto the fan path for `st:fan-speed-4` and `st:fan-speed-5` seamlessly.
- **Preset Mode Icons** — Standard presets now automatically resolve to beautiful, intuitive MDI icons (`eco` to a leaf, `boost` to a rocket, `comfort` & `auto_comfort` to a sofa, `away` to an exit door, and `sleep` to a moon/sleep icon), eliminating the need for manual icon configurations in YAML.
- **Unified Mode Sorting** — Refactored the mode sorting into a generic, powerful helper. Both HVAC modes and fan speed settings (e.g. from quiet to high/turbo, with auto/on at the end) are now logically and deterministically ordered.

## [2.3.5] – 2026-05-28

### 🐛 Bug Fixes

- **Setpoint buttons disabled when `temperature` is `null`** — When an entity is off and has no target temperature (`temperature: null`), the minus button was incorrectly disabled due to `Number(null) === 0` being less than `min_temp`. Both plus and minus are now disabled based on the value actually being `null`, not on a numeric comparison against zero
- **Plus button seeds `min_temp` when `temperature` is `null`** — Pressing plus on an entity with `temperature: null` (and a `min_temp` attribute) now sets the temperature to `min_temp` instead of doing nothing. If no `min_temp` is available, the button remains disabled

## [2.3.4] – 2026-05-25

### ⚠️ Breaking Changes

- **Minimum Home Assistant raised to 2024.8** — HACS now blocks install on older versions. Previous `hacs.json` incorrectly stated 2024.4. `_callAction` now uses `hass.performAction` (HA 2024.8+) with automatic `hass.callService` fallback for manual installs on older versions

### ✨ New Features

- **`hide_setpoint`** — New config option to hide the temperature/percentage setpoint controls while keeping mode buttons visible. Useful for fan or humidifier entities where only mode selection is needed. Configurable in the visual editor under *Layout & Display*
- **Extended swing & vane modes** — `swing_horizontal`, `swing_vertical`, `vane_horizontal`, `vane_vertical` available via YAML `control:` config for climate integrations that expose these as entity attributes (e.g. native Daikin, Mitsubishi/melcloud)
- **Native HA formatting for mode labels** — Mode button labels now use `hass.formatEntityState()` for HVAC modes and `hass.formatEntityAttributeValue()` for all other modes. Properly localized in all HA languages; old hardcoded localization prefix strings removed
- **OFF display when entity is off** — Setpoint display now always shows "OFF" when the entity state is `off`, even when the entity still reports a valid temperature in its attributes (e.g. Daikin keeping `temperature: 24` while off)

### 🐛 Bug Fixes

- **`performAction` crash on older HA** — `_callAction` now checks for `performAction` at runtime and falls back to `callService` — prevents `TypeError: this._hass.performAction is not a function` on manual installs or HA versions before 2024.8
- **Editor `isModeEnabled` ignored object-form `control`** — When `control:` was an object (fine-grained per-mode config), the editor toggles fell back to the adapter default instead of checking the object keys. Toggling a mode in the editor could silently lose YAML config
- **`window.open` without `noopener`** — `url` tap action now opens with `'_blank', 'noopener'` matching the editor's doc link
- **Mode value `undefined` rendered as text** — When a mode attribute existed but had no current value, the active mode showed as `"undefined"` instead of `"none"`

### 🔧 Code quality

- **Dead code removed** — `formatEntityState?.()` optional chaining (guaranteed on HA 2024.8+), localization fallback strings in `modeType.ts` / `sensors.ts` / `infoItem.ts`, `process.env.DEBUG` console.log, unused `localize` parameter in `renderInfoItem`, unused `state` / `domain` / `prefix` variables

## [2.3.3] – 2026-05-16

### 🐛 Bug Fixes

- **Editor `DEFAULT_CONTROL` ignored adapter** — Editor's "delete `control` if it matches default" logic was hardcoded to `['hvac', 'preset']` (climate default); now uses the adapter's `getDefaultControl()` so fan / humidifier defaults are respected
- **TypeScript: setpoint comparison with min/max** — `value >= maxTemp` / `<= minTemp` compared `string | number` against `number`; explicit `Number()` cast added

### 🎨 HA-native editor pass

Editor and entry-point reviewed against `home-assistant/frontend` master and brought in line where it diverged.

- **Icons via `@mdi/js` SVG paths** — Replaced legacy `<ha-icon icon="mdi:book-open-variant">` in the editor footer with `<ha-svg-icon .path=${mdiBookOpenVariant}>`. Smaller bundle impact than lazy-loading the entire `mdi:` icon set, matches HA's own pattern. Added `@mdi/js@^7.4.47` as a dependency.
- **Double-registration guard** — `customElements.define(...)` for both the card and its editor are now wrapped in `if (!customElements.get(...))`. Same for `window.customCards.push(...)`. Loading the bundle twice (HACS + a manual `resources:` entry) no longer throws `NotSupportedError`.
- **`@state` / `@property` decorators** — Editor switched from Lit-1-style `static get properties()` to TypeScript decorators (`@state() config`, `@property({ attribute: false }) hass`). Gives proper reactive-update semantics and matches `main.ts`.
- **`structuredClone` instead of `JSON.parse(JSON.stringify(...))`** — Browser-native deep clone (Baseline 2022, available in every HA-supported browser). Handles `Date` / `Map` / `Set` / cyclical refs correctly should the config shape ever need them.
- **`setConfig(config: CardConfig)`** — Added the missing type annotation so refactors get caught at compile time.
- **`window.open(..., '_blank', 'noopener')`** — Doc link button now opens with `noopener` so the linked page can't navigate this tab via `window.opener`.
- **Console banner** — Switched from the plain `font-weight: bold` line to the two-block coloured banner used by most modern custom cards.
- **Code comment** explaining why `customCards.type` is the bare element name without `custom:` prefix — to keep a future refactor from "fixing" it the wrong way.

### 🔧 Code quality

- Removed unused constants (`MODE_TYPES`, `DEFAULT_CONTROL` in `main.ts`)
- Removed `NUMERIC_PATHS` dead branch in editor — `ha-form` already returns numbers from number selectors
- Replaced repeated `(this.config.header as any)` casts with a single local `header` variable
- Various narrating comments removed (`// Simple direct paths`, etc.) — code is self-explanatory
- Editor imports regrouped (Lit → `@mdi` → local), `declare const` moved out of the import block
- **`@types/jest` added** — `npm run typecheck` is now clean (was reporting `expect` / `test` as undefined). Also fixed 3 null-safety issues that became visible (`hass.states[entity]` in `header.ts`, two `querySelector` returns in `renderInfoItem.test.ts`)

## [2.3.2] – 2026-05-15

### ✨ Improvements

- **Fan entity support** — The card can now control `fan.*` entities: percentage slider, preset/direction/oscillating mode buttons (`fan.set_percentage`, `fan.set_preset_mode`, `fan.set_direction`, `fan.oscillate`)
- **Humidifier entity support** — The card can now control `humidifier.*` entities: humidity slider, mode buttons (`humidifier.set_humidity`, `humidifier.set_mode`)
- **Entity adapter architecture** — Climate-specific logic (setpoints, ranges, services, modes, localization keys) is now isolated in domain adapters (`src/adapters/climate.ts`, `fan.ts`, `humidifier.ts`). Adding new domains in the future is mostly writing one adapter file
- **Separate current temperature entity** — New `current_value_entity` config option lets you use a different entity (e.g. a room thermometer) for the displayed current temperature. Configurable directly in the visual editor; legacy `current_temperature_entity` kept as fallback
- **Editor: Mode type toggles** — New toggles in *Mode Controls* to show/hide `preset`, `fan`, and `swing` mode buttons without YAML
- **Editor: multi-domain entity picker** — Entity selector now accepts `climate.*`, `fan.*`, and `humidifier.*` entities; `getStubConfig` auto-picks the first matching entity in any of those domains
- **Editor: migrated to `ha-form`** — Editor now uses HA's standard `ha-form` for all standard fields (consistent label rendering, future-proof). `ha-textfield` is deprecated and being removed by HA in 2026.5; the new editor uses `ha-input` / `ha-selector` under the hood. Custom CSS stays in its own `ha-code-editor` panel
- **Header panel collapsed by default** — Like the other sections, *Header* now starts collapsed in the editor for a less cluttered initial view
- **Extended mode icons** — Added icons for `automatic` fan mode; numbered fan speeds `1`–`5`; extended swing position icons (`top`, `middle`, `bottom`, `left`, `center`, `right`, etc.)

### 🐛 Bug Fixes

- **Mode list crash on non-array `*_modes`** — `getModeList` now guards against `attributes[type + '_modes']` being absent or non-iterable
- **Boolean/numeric mode values** — `getModeList` now coerces mode values to strings (e.g. numeric fan speeds `1`–`5` or boolean oscillating values) so icon lookup and button rendering work for any entity-provided value
- **Duplicate icon keys** — Removed duplicate `auto` and `off` keys in `MODE_ICONS` that were silently overriding each other; `auto` now consistently maps to `mdi:fan-auto` and `off` to `mdi:power`
- **`current_value_entity` ignored in v2 sensors** — Default sensor renderer (`version: 2`) read `current_temperature` directly from the climate entity, bypassing the configured override; now uses the external sensor's state when set
- **External temp entity not live-updating** — The hass-update short-circuit only compared the main climate entity; now also tracks the external temperature entity so its state changes refresh the displayed value
- **Entity selector clear** — `valueChanged` now treats `null` as empty (alongside `''` and `undefined`) so clearing an entity field via HA's selector correctly deletes the config key instead of storing `null`

## [2.3.1] – 2026-05-11

### ⚠️ Breaking Changes

- **Resource URL changed** — The built file was renamed from `ha-simple-thermostat.js` to `simple-thermostat.js`. The easiest fix is to **reinstall via HACS** — this automatically sets the correct resource URL. If you prefer to update manually, change your Lovelace resource from `/hacsfiles/ha-simple-thermostat/ha-simple-thermostat.js` to `/hacsfiles/ha-simple-thermostat/simple-thermostat.js`

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
- **Mode buttons wrap** — Buttons now wrap to the next line instead of overflowing the card when there are too many modes

### 🐛 Bug Fixes

- **Header hidden when not explicitly configured** — `header` not set in YAML was treated as `false` (`?? false` coercion); now defaults to `{}` so the header shows by default matching the editor toggle state
- **`getStubConfig` fallback entity** — No longer falls back to the literal string `climate.my_thermostat` when no climate entity exists; returns an empty entity picker instead
- **Editor render crash on early mount** — `render()` now guards against `this.config` being undefined before `setConfig()` is called
- **CSS class injection from `hvac_action`** — Entity-derived class values are now sanitized (only `[a-z0-9_-]`) before being applied to `ha-card`, preventing weird values from integrations from breaking CSS selectors
- **Missing fan mode icons** — Added icons for `normal`, `powerful`, `silent` fan modes; icon lookup is now case-insensitive so modes like `Quiet` or `Normal` (capitalised by the integration) also get icons
- **Step size dropdown empty** — Dropdown now correctly shows `Auto (from entity)` when no `step_size` is configured

### 🔧 Code quality

- **TypeScript errors in `main.ts` resolved** — Cleaned up ~8 outstanding type errors that had accumulated over sessions: nullable `header` handling, `values.list` safety, explicit `PreparedSensor[]` for `builtins`, `TemplateResult[]` for warnings, narrowed `header.toggle` access
- **Dead CSS removed** — Removed unused `.editor-row`, `.editor-section-title`, `.editor-section-title--clickable`, `.editor-details`, `.editor-details-icon` (legacy from previous editor design, ~30 lines)
- **More CSS variables for theming** — Added `--st-mode-color`, `--st-mode-border-radius`, `--st-mode-transition`, `--st-header-icon-color` and a `--st-default-*` palette of fallbacks so themes can override more aspects of the card
- **Tests for toggle icon** — Added unit tests for the new `header.toggle.icon` config field (default `false`, preserved when set)

### 🔨 Tooling & Build

- **GitHub Release workflow** — Added automated release workflow via GitHub Actions
- **Repository URLs** — Updated `hacs.json` and `package.json` with the new repository location
- **Artifact name** — Built file is `simple-thermostat.js` (matches the original fork)
- **`hacs.json` filename field** — Added explicit `filename: simple-thermostat.js` so HACS sets the correct Lovelace resource URL on fresh installs


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
