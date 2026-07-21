<div align="center">

# Simple Thermostat

### A HVAC, thermostat, climate card for Home Assistant Lovelace UI

[![HACS][hacs-badge]][hacs-url]
[![Home Assistant][ha-badge]][ha-url]
[![GitHub release (latest by date)](https://img.shields.io/github/v/release/duczz/ha-simple-thermostat?style=for-the-badge&color=22c55e)][release-url]

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=duczz&repository=ha-simple-thermostat&category=dashboard)

</div>

---

A beautiful, highly customizable thermostat card for Home Assistant. Seamlessly control your smart thermostats, TRVs, air conditioners, fans, and humidifiers (`climate.*`, `fan.*`, and `humidifier.*` entities) from a single, modular Lovelace card—complete with a powerful visual editor and extensive theming support.

<br>

<p align="center">
  <img src="assets/Full_dial.png" width="90%" alt="Full card with banners and sensors">
  <img src="assets/Full_number.png" width="90%" alt="Full card with banners and sensors">
</p>
<p align="center">
  <img src="assets/small.png" width="90%" alt="Compact layout">
</p>

---

## Table of Contents

- [About this fork](#about-this-fork)
- [Works well with](#works-well-with)
- [Requirements](#requirements)
- [Installation](#installation)
- [Visual Editor](#visual-editor)
- [Configuration](#configuration)
  - [Showing multiple thermostats](#showing-multiple-thermostats)
  - [All options](#all-options)
  - [Layout options](#layout-options)
  - [Setpoint style](#setpoint-style)
- [Header config](#header-config)
- [Setpoints config](#setpoints-config)
- [Control config](#control-config)
- [Sensors config](#sensors-config)
- [Banners config](#banners-config)
- [Templated Sensors (version: 3)](#templated-sensors-version-3)
- [Custom CSS](#custom-css)
- [CSS variables for theming](#css-variables-for-theming)
- [Full config example](#full-config-example)
- [Compact mode](#compact-mode)

---

<a id="about-this-fork"></a>
## 🛠️ About this fork

This project is a modernised fork of [nervetattoo/simple-thermostat](https://github.com/nervetattoo/simple-thermostat), rebuilt to support the latest Home Assistant versions. It includes numerous architectural improvements and features:

**Exclusive Features only for this Fork:**
- **Advanced Banner System**: Custom, condition-based notification banners directly above your thermostat controls.
- **New Sensor Layouts**: Support for modern `chips` and `badges` layouts in addition to the classic lists and tables.
- **Circular Dial Setpoint**: An optional native-style circular dial (`setpoint_style: dial`) for the target temperature — draggable, mode-colored, and supporting dual `heat_cool` ranges.
- **Press-and-Hold Stepping**: Hold a +/- button to keep adjusting the setpoint instead of tapping repeatedly (number and dial styles).

For a detailed list of all new features, bug fixes, and improvements, please check the [CHANGELOG.md](CHANGELOG.md).

---

<a id="works-well-with"></a>
## 💡 Works well with Tempix

Pair this card with **[Tempix](https://github.com/duczz/ha-tempix)** — a 100% local, self-learning climate-control integration that turns your HVAC systems and smart TRVs into adaptive per-room heating (schedules, presence detection, window sensors, smart preheating). Tempix exposes a standard `climate.tempix_<room>` entity per room, so you can control and visualize each room right from this card.

---

<a id="requirements"></a>
## 📦 Requirements

- Home Assistant **2024.8** or higher
- HACS (recommended) or manual install

---

<a id="installation"></a>
## 🚀 Installation

### HACS (recommended)

1. Open **HACS** in Home Assistant
2. Go to **Frontend** → three-dot menu → **Custom repositories**
3. Add this repository URL, category: **Lovelace**
4. Search for **Simple Thermostat** and install
5. Reload the browser

### Manual

1. Download `simple-thermostat.js` from the [latest release][release-url] and place it in `config/www/`.
2. Add to your Lovelace resources:

```yaml
resources:
  - url: /local/simple-thermostat.js?v=1
    type: JavaScript-Module
```

---

<a id="visual-editor"></a>
## 🖱️ Visual Editor

The card has a built-in visual editor accessible from the HA card picker (pencil icon). Most common settings can be configured without touching YAML.

### Sections

| Section | What it does |
|---|---|
| **Entity (required)** | The `climate.*`, `fan.*`, or `humidifier.*` entity to control |
| **Current temperature entity (optional)** | Override the displayed current temperature with a separate sensor (e.g. a room thermometer) |
| **Header** | Show/hide the card header; set a custom name and icon |
| **Header → Toggle entity** | An optional entity (e.g. `input_boolean`, `switch`) shown as an on/off toggle inside the header |
| **Header → Toggle label / icon** | The text and icon displayed next to the toggle switch |
| **Setpoint** | Hide the setpoint controls, pick the setpoint style (`number` or `dial`), and set the step layout / step size |
| **Mode labels** | Rename any mode or give it a custom icon (e.g. `cool` → "Kühlen"), per mode type the entity supports — writes `control.<type>.<value>.name` / `.icon` |
| **Mode Controls → Visible mode types** | Toggles to show/hide `preset`, `fan`, and both `swing` (vertical/horizontal) mode button rows, plus optional swing override entities |
| **Mode Controls → Display** | Show or hide mode button names, icons, and section headings |
| **Layout & Display** | Decimal places, unit override, step size, step layout, hide rows, and label overrides |
| **Banners** | Add/remove/reorder (▲/▼) condition-based alert banners (low battery, window open, device offline, or fully custom) with one-click presets. New banners are inserted pre-sorted by severity; the order can be changed manually |
| **Sensors** | Manage built-in (temperature/state) and custom sensors: layout type (list / table / chips / badges), labels, icons, base colors, per-state icon/text colors, and ▲/▼ reordering of custom sensors |
| **Interactions** | `tap_action`, `hold_action`, `double_tap_action` on the temperature display — same options as any HA card |
| **Fallback text** | Text shown instead of "N/A" when the setpoint value is unavailable, e.g. `--` or `Offline` |
| **Custom CSS** | Syntax-highlighted CSS editor injected into the card's Shadow DOM — use `--st-*` variables or target any selector. No card-mod required |

> 💡 **Tip:** Sensors, faults, and other advanced options can only be configured in the YAML (code) editor. Click **All configuration options** in the editor for the full reference.

---

<a id="configuration"></a>
## ⚙️ Configuration

To get started quickly, you only need to specify the `type` and your `entity`. This will render the card with all default settings:

```yaml
type: custom:simple-thermostat
entity: climate.my_room
```

Use a separate sensor for the displayed current temperature (e.g. a room thermometer instead of the thermostat's internal sensor):

```yaml
type: custom:simple-thermostat
entity: climate.my_room
current_value_entity: sensor.living_room_temperature
```

Control a fan entity (percentage slider + preset / direction / oscillating modes):

```yaml
type: custom:simple-thermostat
entity: fan.bedroom_fan
```

Control a humidifier entity (humidity slider + mode buttons):

```yaml
type: custom:simple-thermostat
entity: humidifier.bedroom_humidifier
```

<a id="showing-multiple-thermostats"></a>
### Showing multiple thermostats

This card controls a single entity. To show several thermostats — or mix in
fans and humidifiers — combine multiple cards with a standard Lovelace layout;
no special support is needed:

- **Side by side or stacked:** wrap the cards in a `vertical-stack`,
  `horizontal-stack`, or `grid` card (all built into Home Assistant).
- **One at a time, with arrows or tabs:** community cards such as
  [swipe-card](https://github.com/bramkragten/swipe-card) or
  [tabbed-card](https://github.com/kinghat/tabbed-card) page through several
  cards via swipe, arrows, or tabs.

### All options

| Option       | Type                  | Default | Description |
| ------------ | --------------------- | ------- | ----------- |
| `entity`     | `string`              | **required** | Climate entity id |
| `current_value_entity` | `string`    | —       | Use a different entity (e.g. a room thermometer) for the displayed current temperature. `current_temperature_entity` is an accepted alias. |
| `header`     | `false\|object`       | —       | See [Header config](#header-config) |
| `setpoints`  | `false\|object`       | —       | See [Setpoints config](#setpoints-config) |
| `layout`     | `object`              | —       | See [Layout options](#layout-options) |
| `service`    | `object`              | —       | Override the HA service call — fields: `domain`, `service`, `data` (object) |
| `unit`       | `string\|false`       | —       | Override or hide the displayed unit |
| `decimals`   | `number`              | `1`     | Number of decimal places |
| `fallback`   | `string`              | `N/A`   | Text when no setpoint is available |
| `hide_setpoint` | `boolean`          | `false` | Hide the setpoint up/down controls (keeps mode buttons visible) |
| `setpoint_style` | `number\|dial`    | `number` | How the target temperature is shown — classic `number` with +/- buttons, or the native circular `dial`. See [Setpoint style](#setpoint-style) |
| `dial_action_labels` | `object`      | —       | Override the dial's center action label per `hvac_action` (or entity state), e.g. `{ heating: 'Heizt' }`. Unset keys use HA's own translation |
| `step_size`  | `number`              | auto    | Step for temperature up/down; defaults to the entity's `target_temp_step` attribute |
| `label`      | `object`              | —       | Override `temperature` / `state` labels |
| `icon`       | `object`              | —       | Override the icon for the built-in `temperature` / `state` rows, e.g. `icon: { temperature: mdi:thermometer }` |
| `color`      | `object`              | —       | Icon color (CSS) for the built-in `temperature` / `state` rows |
| `text_color` | `object`              | —       | Text color (CSS) for the built-in `temperature` / `state` rows |
| `state_color`| `object`              | —       | Per-state icon color map for the built-in rows, e.g. `state_color: { state: { heat: orange } }` |
| `state_text_color` | `object`        | —       | Per-state text color map for the built-in rows (same shape as `state_color`) |
| `hide`       | `object`              | —       | `temperature: bool`, `state: bool` |
| `control`    | `object\|array\|false`| —       | See [Control config](#control-config) |
| `sensors`    | `array\|false`        | —       | See [Sensors config](#sensors-config). `entities` is a fully supported alias (the standard Lovelace key) — if both are set, `sensors` wins |
| `banners`    | `array\|false`        | —       | See [Banners config](#banners-config) |
| `tap_action` | `object`              | `more-info` | Action when tapping the temperature display |
| `hold_action`| `object`              | `none`  | Action when holding the temperature display (500 ms) |
| `double_tap_action`| `object`        | `none`  | Action when double-tapping the temperature display (250 ms) |
| `styles`     | `string`              | —       | Custom CSS injected into the card — see [Custom CSS](#custom-css) |
| `version`    | `2\|3`                | `2`     | Set to `3` to enable [Templated Sensors](#templated-sensors-version-3) |
| `variables`  | `object`              | —       | Custom variables available in `version: 3` templates as `v.*` |

### Layout options

```yaml
layout:
  step: row        # row | column | right — where to render the +/- buttons (default: row)
  mode:
    names: true    # show mode names (default: true)
    icons: true    # show mode icons (default: true)
    headings: false # show mode type headings (default: false)
  sensors:
    type: table    # list | table | chips | badges (default: table)
    labels: true   # show sensor labels (default: true)
```

<a id="setpoint-style"></a>
### Setpoint style

Choose how the target temperature is presented:

```yaml
setpoint_style: dial   # number (default) | dial
```

- **`number`** (default) — the classic large value with +/- buttons.
- **`dial`** — the native Home Assistant circular slider (`ha-control-circular-slider`). Drag the ring to set the target; a +/- pair sits below it and the center shows the action (e.g. *Heating*) and the current temperature. When the entity is off, the center reads **Off** instead of a value. The **ring is colored by the current HVAC mode** (reusing the same `--heat-color` / `--cool-color` / … variables as the mode buttons); the center number stays neutral.

The dial works for both single-setpoint entities and **dual `heat_cool`** ranges — a dual entity shows one ring with two handles (low / high) and both targets in the center. It also works for **`fan`** (percentage) and **`humidifier`** (humidity) entities, using the `%` unit and a matching center icon. It requires a Home Assistant core new enough to ship `ha-control-circular-slider` (2024.x+); on older cores the card automatically falls back to the `number` display.

**Holding** an +/- button repeats the step until release (both `number` and `dial` styles). The center action label can be renamed with [`dial_action_labels`](#all-options) (e.g. `{ heating: 'Heizt' }`).

The dial size and layout can be fine-tuned with [CSS variables](#css-variables-for-theming) (`--st-dial-*`, `--st-dial-info-top`, `--st-divider-height`).

---

<a id="header-config"></a>
## 🪧 Header config

Customize the top section of your card. You can set custom names, icons, display fault indicators, or add a toggle switch. If you prefer a cleaner look, hide the entire header with `header: false`.

```yaml
header:
  name: Living Room
  icon: mdi:sofa
  toggle:
    entity: switch.pump_relay
    name: Pump
    icon: mdi:water-pump   # optional icon next to the toggle label
  faults:
    - entity: binary_sensor.low_battery
      icon: mdi:battery-low
      hide_inactive: true
```

| Option    | Type             | Description |
| --------- | ---------------- | ----------- |
| `name`    | `string`         | Override the card name |
| `icon`    | `string\|object` | Icon next to the name; pass an object to set per-state icons |
| `toggle`  | `object`         | Entity id to show as a toggle in the header |
| `toggle.entity` | `string`   | Entity id for the toggle (e.g. `switch.pump_relay`) |
| `toggle.name`   | `string` | Label next to the toggle. If omitted, it defaults to the entity's friendly name. To hide the label entirely, set it to a single space (`" "`). |
| `toggle.icon`   | `string\|false` | Icon next to the toggle label; `false` hides it (default) |
| `faults`  | `array\|false`   | Binary sensor entities to show as fault indicators |

Icon object keys: `auto`, `cooling`, `fan`, `heating`, `idle`, `off`, `cool`, `dry`, `fan_only`, `heat`, `heat_cool`

---

<a id="setpoints-config"></a>
## 🌡️ Setpoints config

Define how target temperatures are adjusted. The card automatically supports both single and dual (high/low) setpoints based on your climate entity's capabilities.

For single thermostats (default):

```yaml
setpoints:
  temperature:
```

For dual thermostats:

```yaml
setpoints:
  target_temp_low:
  target_temp_high:
```

Hide one setpoint:

```yaml
setpoints:
  target_temp_low:
    hide: true
  target_temp_high:
```

---

<a id="control-config"></a>
## 🎮 Control config

Take full control over the mode buttons. By default, the card automatically renders `hvac` and `preset` modes if your entity supports them. You can explicitly customize or hide specific modes using the following format:

```yaml
control:
  hvac: {}
  preset: {}
  fan: {}
  swing: {}
```

Available mode types: `hvac`, `fan`, `preset`, `swing`, `swing_horizontal`, `swing_vertical`, `vane_horizontal`, `vane_vertical`. The card only renders a mode type if the entity actually exposes the corresponding attribute.

For fine-grained control over specific modes, just add your overrides under the respective type. **Important:** The key (e.g. `automatic` or `heat`) is case-sensitive and must match the exact raw system state (even if it's capitalized like `Auto`)!

```yaml
control:
  hvac:
    heat:
      name: Heating
      icon: mdi:fire
    "off":
      name: false   # show icon only
  preset: {}
  fan:
    automatic:
      name: Auto
  swing: {}
```

> [!WARNING]
> Quote `"off"` and `"on"` to prevent YAML from interpreting them as booleans.

### Hide a control row while the entity is off

Add `_hide_when_off: true` directly under a mode type to collapse that whole row whenever the entity's HVAC state is `off`. This is handy for secondary controls (preset, fan, swing) that are meaningless when the device is off — the card stays tidy while off and the rows return the moment you switch it back on. Leave `hvac` without the flag so the on/off buttons always stay reachable.

```yaml
control:
  hvac: {}              # no flag → stays visible so you can turn it back on
  preset:
    _hide_when_off: true
  fan:
    _hide_when_off: true
  swing:
    _hide_when_off: true
```

The three most common secondary controls (`preset`, `fan`, `swing`) also expose this as a **"Hide … when off"** toggle in the visual editor's Controls section. In YAML the `_hide_when_off` key works for every mode type, including `swing_vertical` / `swing_horizontal` and `vane_horizontal` / `vane_vertical`.

> 💡 Per-mode **names and icons** (e.g. `cool` → "Kühlen") can be set in the visual editor's **Mode labels** section as well — no need to hand-write the `control` dictionary. A renamed mode shows consistently on the mode buttons, the built-in **State** sensor row, and the dial's center label (an active `idle` action still shows there so you can tell the unit is only idling).

---

<a id="sensors-config"></a>
## 📡 Sensors config

Display additional data like power consumption, humidity, or open windows directly inside the thermostat card.

```yaml
sensors:
  - entity: switch.pump_relay
    name: Pump
    icon: mdi:water-pump
    display_as: switch
  - attribute: min_temp
    name: Min temp
    unit: °C
  - entity: sensor.last_changed
    type: relativetime
```

| Option      | Type           | Description |
| ----------- | -------------- | ----------- |
| `entity`    | `string`       | Sensor entity id |
| `name`      | `string`       | Override the display name |
| `icon`      | `string\|false`| Icon instead of a name. Set to `false` to explicitly hide the icon. |
| `attribute` | `string`       | Use an attribute from the main entity (or the sensor entity if set) |
| `unit`      | `string`       | Unit label (useful when using `attribute`) |
| `decimals`  | `number`       | Round to this many decimal places |
| `type`      | `relativetime` | Display the value as relative time |
| `display_as`| `string`       | Render interactive widget (`switch`, `slider`, `select`) instead of text state |
| `color`     | `string`       | Icon color (CSS value) |
| `text_color`| `string`       | Text color (CSS value) |
| `state_color` | `object`     | Map exact states to icon colors, e.g. `{ heat: orange, "off": grey }` |
| `state_text_color` | `object` | Map exact states to text colors (same shape as `state_color`) |

State colors take priority over the static `color` / `text_color` when the current state matches a key; otherwise the static color (if any) is used. Both can be set from the visual editor's Sensors panel.

> 💡 **`timer.*` entities** shown as a sensor automatically render a live countdown (updating every second) instead of the static state — no `display_as` needed.

---

<a id="banners-config"></a>
## 🏷️ Banners config

You can add customizable notification banners that appear above the main thermostat controls based on entity states or attributes. Fully configurable in the visual editor!

```yaml
banners:
  - entity: binary_sensor.living_room_window
    state: "on"
    type: info
    text: Window open
    icon: mdi:window-open
  - attribute: battery_level
    below: 20
    type: warning
    text: Low battery ({{value}}%)
    icon: mdi:battery-alert
  - state:
      - unavailable
      - unknown
    type: error
    text: Device unavailable
    icon: mdi:alert-circle-outline
```

| Option | Type | Description |
| --- | --- | --- |
| `entity` | `string` | Optional external entity id. If omitted, uses the main climate entity. |
| `attribute` | `string` | Evaluate a specific attribute instead of the state. |
| `state` | `string`\|`array` | Show banner if the state exactly matches (or is in the array). |
| `state_not` | `string`\|`array` | Show banner if the state does NOT match. |
| `above` | `number` | Show banner if the numeric value is strictly greater than this number. |
| `below` | `number` | Show banner if the numeric value is strictly less than this number. |
| `type` | `info`\|`warning`\|`error`\|`success` | Visual style. `error` features a pulsing icon. |
| `text` | `string` | The text to display. Use `{{value}}` to inject the evaluated state or attribute. |
| `icon` | `string` | The MDI icon to display. |

---

<a id="templated-sensors-version-3"></a>
## 🧬 Templated Sensors (version: 3)

Set `version: 3` on the card to enable the template sensor system. Templates are evaluated locally using [Squirrelly](https://squirrelly.js.org/) with your entity's state and attributes available as variables.

### Render a state from another entity

The simplest use case — render the state of a different sensor. The two entries below are equivalent (the second uses the default template explicitly):

```yaml
type: custom:simple-thermostat
entity: climate.living_room
version: 3
sensors:
  - entity: sensor.living_room_humidity

  - entity: sensor.living_room_humidity
    template: '{{state.text}}'
    label: '{{friendly_name}}'
```

### Override built-in sensors

Two sensors are built-in by default (`state` and `temperature`). Override them by using their `id`:

```yaml
type: custom:simple-thermostat
entity: climate.living_room
version: 3
sensors:
  - id: state
    label: '{{ui.operation}}'
    template: '{{state.text}}'
  - id: temperature
    label: '{{ui.currently}}'
    template: '{{current_temperature|formatNumber}}'
```

> 💡 **Tip:** Use `|formatNumber` on any numeric value to respect your `decimals` config.

### Render attributes from the main entity

All attributes from the climate entity are available directly as variables:

```yaml
sensors:
  - label: Min/max temp
    template: '{{min_temp}} / {{max_temp}}'
  - label: Supported HVAC modes
    template: "{{hvac_modes|join(', ')}}"
```

### Use a different entity as context

Reference another entity — all its attributes become available as variables:

```yaml
sensors:
  - label: Temperature
    entity: sensor.multisensor_living_room
    template: '{{temperature}} {{unit_of_measurement}}'
```

### Pass custom variables

Use `variables` to avoid repeating long strings inside templates. This example replaces the built-in State sensor with a dynamic icon:

```yaml
type: custom:simple-thermostat
entity: climate.living_room
version: 3
variables:
  icons:
    idle: 'mdi:sleep'
    heat: 'mdi:radiator'
sensors:
  - id: state
    label: State
    template: '{{v.icons[state.raw]|icon}}'
```

`v` is the shorthand for your `variables` object. `|icon` renders the string as a HA icon element.

### Available template filters

| Filter         | Description                      | Example |
| -------------- | -------------------------------- | ------- |
| `icon`         | Render as HA icon                | `{{"mdi:sleep"\|icon}}` |
| `translate`    | Look up HA translation string    | `{{"on"\|translate("state.default.")}}` |
| `formatNumber` | Format number to x decimals      | `{{3\|formatNumber({ decimals: 3 })}}` |
| `join`         | Join array to string             | `{{hvac_modes\|join(', ')}}` |
| `css`          | Apply inline CSS styles          | `{{state.text\|css({ color: 'red' })}}` |
| `debug`        | Print value as JSON string       | `{{state\|debug}}` |
| `relativetime` | Render as relative time          | `{{last_changed\|relativetime}}` |

### Translations (`ui` object)

Access HA's built-in climate UI translations via the `ui` shorthand:

| Key             | Value      |
| --------------- | ---------- |
| `ui.currently`  | Currently  |
| `ui.operation`  | Operation  |
| `ui.fan_mode`   | Fan mode   |
| `ui.swing_mode` | Swing mode |
| `ui.preset_mode`| Preset     |

Custom translation lookup: `{{"on"|translate("state.default.")}}` resolves the key `state.default.on` from HA's translation strings.



---

<a id="custom-css"></a>
## 🖌️ Custom CSS

Inject arbitrary CSS directly into the card without needing `card-mod`. Use the `styles` config key or edit it visually with syntax highlighting in the visual editor:

```yaml
type: custom:simple-thermostat
entity: climate.my_room
styles: |
  ha-card {
    --st-font-size-xl: 24px;
    --st-mode-active-background: #ff5722;
  }
  .current--value {
    font-weight: 700;
  }
```

The CSS is scoped to the card's Shadow DOM. You can override any `--st-*` custom property (see [CSS variables for theming](#css-variables-for-theming)) or target internal selectors directly.

### Styling individual modes

A common use case is giving each active mode button a different color (e.g. blue for cooling, orange for heating). The card has built-in variables for exactly this purpose:

```yaml
styles: |
  ha-card {
    --cool-color: rgba(43, 154, 249, 0.8);
    --heat-color: rgba(255, 129, 0, 0.8);
    --auto-color: rgba(0, 128, 0, 0.8);
    --dry-color: rgba(239, 189, 7, 0.8);
    --off-color: rgba(138, 138, 138, 0.2);
  }
```

> **Note:** `styles` is applied after all built-in styles, so it always takes precedence. You do not need card-mod for per-card overrides.

---

<a id="css-variables-for-theming"></a>
## 🖌️ CSS variables for theming

| Variable                     | Default                                    | Description |
| ---------------------------- | ------------------------------------------ | ----------- |
| `--st-font-size-xl`          | `clamp(34px, 5vw, 45px)`                  | Target temperature font size (large screens) |
| `--st-font-size-l`           | `clamp(28px, 6vw, 34px)`                  | Target temperature font size (small screens) |
| `--st-font-size-m`           | `20px`                                     | Temperature unit font size |
| `--st-font-size-title`       | `var(--ha-card-header-font-size, 24px)`    | Card heading font size |
| `--st-font-size-sensors`     | `16px`                                     | Sensor value font size |
| `--st-spacing`               | `4px`                                      | Base spacing unit |
| `--st-mode-active-background`| `var(--primary-color)`                     | Background for the active mode button |
| `--st-mode-active-color`     | `var(--text-primary-color, #fff)`          | Text color for the active mode button |
| `--st-mode-background`       | `var(--secondary-background-color)`        | Background for inactive mode buttons |
| `--st-toggle-label-color`    | `var(--primary-text-color)`                | Toggle label text color |
| `--st-font-size-toggle-label`| `16px`                                     | Toggle label font size |
| `--st-fault-inactive-color`  | `var(--secondary-background-color)`        | Fault icon color when inactive |
| `--st-fault-active-color`    | `var(--accent-color)`                      | Fault icon color when active |
| `--st-mode-color`            | `var(--secondary-text-color)`              | Text color for inactive mode buttons |
| `--st-mode-border-radius`    | `var(--ha-card-border-radius, 4px)`        | Border radius of mode buttons |
| `--st-mode-transition`       | `200ms ease`                               | Transition speed for mode button color changes |
| `--st-header-icon-color`     | `var(--state-icon-color, #44739e)`         | Color of the header icon |
| `--st-dial-size`             | `160px`                                    | Diameter of the `setpoint_style: dial` ring (capped at 40% of the card body so it shrinks on narrow cards) |
| `--st-dial-info-top`         | `48%`                                      | Vertical position of the dial's center info stack |
| `--st-dial-button-size`      | `calc(dial * 0.225)`                       | Size of the dial's +/- buttons |
| `--st-dial-button-gap`       | `calc(dial * 0.0625)`                      | Gap between the dial's +/- buttons |
| `--st-dial-button-bottom`    | `0%`                                       | Vertical offset of the +/- button row from the ring bottom |
| `--st-divider-height`        | `90%`                                      | Length of the divider line between the sensors and the setpoint/dial (as a share of the card body height) |

### HA theme example

Set variables globally for all Simple Thermostat cards in a theme:

```yaml
my-theme:
  st-font-size-xl: 24px
  st-font-size-m: 20px
  st-font-size-title: 20px
  st-spacing: 2px
```

---

<a id="full-config-example"></a>
## 📝 Full config example

```yaml
type: custom:simple-thermostat
entity: climate.my_room
step_size: 1
sensors:
  - entity: sensor.room_energy
  - entity: sensor.room_power
    name: Energy today
  - attribute: min_temp
    name: Min temp
header:
  faults:
    - entity: binary_sensor.my_room_communications_fault
    - entity: binary_sensor.my_room_low_battery_fault
      icon: mdi:battery-low
  toggle:
    entity: switch.pump_relay
control:
  hvac:
    "off":
      name: Off
      icon: mdi:power
    heat:
      name: Heat
      icon: mdi:fire
```

---

<a id="compact-mode"></a>
## 📱 Compact mode

A minimalist layout. Hide everything except sensors and temperature control:

```yaml
type: custom:simple-thermostat
entity: climate.my_room
layout:
  step: row
header: false
control: false
```

[hacs-badge]: https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge&logo=homeassistantcommunitystore&logoColor=white
[hacs-url]: https://hacs.xyz
[ha-badge]: https://img.shields.io/badge/Home%20Assistant-2024.8+-41BDF5.svg?style=for-the-badge&logo=homeassistant&logoColor=white
[ha-url]: https://www.home-assistant.io
[release-url]: https://github.com/duczz/ha-simple-thermostat/releases/latest
