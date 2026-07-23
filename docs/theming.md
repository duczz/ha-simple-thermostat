# Custom CSS & Theming

## Custom CSS

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

### Styling the circular dial

If you are using the circular dial (`setpoint_style: dial`), you might want to adjust its size or layout. The ring automatically adopts the mode colors (e.g. `--heat-color`), but you can fine-tune its dimensions:

```yaml
styles: |
  ha-card {
    --st-dial-size: 200px;           /* Make the dial larger */
    --st-dial-info-top: 45%;         /* Move the center text slightly up */
    --st-divider-height: 80%;        /* Make the dividing line shorter */
  }
```

## CSS variables for theming

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
| `--st-setpoint-align`        | `center`                                   | Alignment of the setpoint when the card has no sensors (`center` / `left` / `right` / `start` / `end`). With sensors it is always sensors-left / setpoint-right |
| `--st-body-padding-min`      | `12px`                                     | Minimum left/right padding of the card body, so the +/- buttons never touch the card edge even when `--st-spacing` is `0` |

### HA theme example

Set variables globally for all Simple Thermostat cards in a theme:

```yaml
my-theme:
  st-font-size-xl: 24px
  st-font-size-m: 20px
  st-font-size-title: 20px
  st-spacing: 2px
```
