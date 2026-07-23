# Visual Editor

The card has a built-in visual editor accessible from the HA card picker (pencil icon). Most common settings can be configured without touching YAML.

## Sections

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
