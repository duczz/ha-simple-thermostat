# Custom CSS & Theming

The card exposes its whole look through CSS custom properties. There are three
ways to set them, from most local to most global:

| Where | Scope | Use it for |
| --- | --- | --- |
| `styles:` in the card config | this one card | one-off tweaks, per-room colors |
| A Home Assistant theme | every Simple Thermostat card | a consistent look across the dashboard |
| Nothing at all | — | the card follows your active HA theme by default |

You do **not** need `card-mod` for any of this.

## Quick recipes

The five things people ask for most.

**Color the big temperature number**

```yaml
type: custom:simple-thermostat
entity: climate.my_room
styles: |
  ha-card {
    --st-setpoint-color: #ff8100;
  }
```

**Give each mode button its own color**

```yaml
styles: |
  ha-card {
    --st-heat-color: #ff8100;
    --st-cool-color: #2b9af9;
    --st-auto-color: green;
    --st-dry-color: #efbd07;
    --st-off-color: rgba(138, 138, 138, 0.4);
  }
```

**Change the mode button text, icon and background**

```yaml
styles: |
  ha-card {
    --st-mode-background: #2c2c2c;      /* inactive button */
    --st-mode-color: #9e9e9e;           /* inactive label */
    --st-mode-active-color: #ffffff;    /* active label */
    --st-mode-active-icon-color: #ffffff;
    --st-mode-icon-size: 20px;
    --st-mode-border-radius: 12px;
  }
```

**Make the card more compact**

```yaml
styles: |
  ha-card {
    --st-spacing: 2px;
    --st-font-size-xl: 28px;
    --st-font-size-title: 18px;
    --st-font-size-sensors: 14px;
  }
```

**Style the sensor rows and alert banners**

```yaml
styles: |
  ha-card {
    --st-sensor-label-color: #9e9e9e;
    --st-sensor-value-color: var(--primary-text-color);
    --st-banner-background: rgba(255, 193, 7, 0.12);
    --st-banner-text-color: var(--primary-text-color);
  }
```

Beyond the variables you can target internal selectors directly — the CSS is
scoped to the card's Shadow DOM and applied after all built-in styles, so it
always wins:

```yaml
styles: |
  .current--value {
    font-weight: 700;
  }
```

## Mode colors follow your Home Assistant theme

Since v2.4.1 the mode button colors default to Home Assistant's own state
colors, so the card matches HA's built-in thermostat and tile cards and picks up
any theme that customizes them:

| Mode | Falls back to | HA default |
| --- | --- | --- |
| `--st-auto-color` | `--state-climate-auto-color` | green `#4caf50` |
| `--st-cool-color` | `--state-climate-cool-color` | blue `#2196f3` |
| `--st-dry-color` | `--state-climate-dry-color` | orange `#ff9800` |
| `--st-fan_only-color` | `--state-climate-fan_only-color` | cyan `#00bcd4` |
| `--st-heat-color` | `--state-climate-heat-color` | deep orange `#ff6f22` |
| `--st-heat_cool-color` | `--state-climate-heat-cool-color` | amber `#ffc107` |
| `--st-off-color` | `--state-inactive-color` | grey `#9e9e9e` |

> **Upgrading from v2.4.0 or earlier?** Two colors changed visibly: `heat_cool`
> was spring green and is now amber, `fan_only` was grey and is now cyan. To keep
> the old look, set them explicitly:
>
> ```yaml
> styles: |
>   ha-card {
>     --st-heat_cool-color: springgreen;
>     --st-fan_only-color: #8a8a8a;
>   }
> ```

The older, un-prefixed names (`--cool-color`, `--heat-color`, `--off-color`, …)
still work exactly as before — if your config sets one, it keeps overriding
everything above.

### Fan and humidifier cards

Those domains have no per-mode colors — a fan is simply active or not, so their
mode buttons use `--st-mode-active-background` (Home Assistant's primary color
by default). If you would rather match the color HA gives those entities
elsewhere in the UI, point the variable at HA's own state color:

```yaml
# Fan card — cyan, like HA's fan icons
styles: |
  ha-card {
    --st-mode-active-background: var(--state-fan-active-color);
  }
```

```yaml
# Humidifier card — blue
styles: |
  ha-card {
    --st-mode-active-background: var(--state-humidifier-on-color);
  }
```

This is not the default on purpose: it tints *every* active button, including
ones that do not mean "the device is on" (e.g. a fan's `direction` or
`oscillating` row).

## Variable reference

### Setpoint

| Variable | Default | Description |
| --- | --- | --- |
| `--st-setpoint-color` | inherited | Color of the target value |
| `--st-font-size-xl` | `clamp(34px, 5vw, 45px)` | Target value font size (large screens) |
| `--st-font-size-l` | `clamp(28px, 6vw, 34px)` | Target value font size (small screens) |
| `--st-font-size-unit` | `0.42em` | Size of the unit next to the number |
| `--st-font-size-m` | — | Historic alias for `--st-font-size-unit` |
| `--st-value-update-color` | `var(--error-color)` | Color while a change is being sent to HA |
| `--st-setpoint-align` | `center` | Alignment when the card has no sensors (`center` / `left` / `right` / `start` / `end`). With sensors it is always sensors-left / setpoint-right |
| `--st-divider-color` | `var(--divider-color)` | Line between the sensor column and the setpoint |
| `--st-divider-height` | `90%` | Length of that line, as a share of the card body height |

### Dial (`setpoint_style: dial`)

| Variable | Default | Description |
| --- | --- | --- |
| `--st-dial-size` | `160px` | Ring diameter (capped at 36% of the card body, so it shrinks on narrow cards) |
| `--st-dial-info-top` | `48%` | Vertical position of the center info stack |
| `--st-dial-button-size` | 22.5% of the dial | Size of the +/- buttons |
| `--st-dial-button-color` | `var(--primary-text-color)` | Color of the +/- buttons |
| `--st-dial-button-gap` | 6.25% of the dial | Gap between the +/- buttons |
| `--st-dial-button-bottom` | `0%` | Vertical offset of the button row from the ring bottom |

The ring itself adopts the mode colors above.

### Mode buttons

| Variable | Default | Description |
| --- | --- | --- |
| `--st-mode-background` | `var(--secondary-background-color)` | Background of inactive buttons |
| `--st-mode-color` | `var(--secondary-text-color)` | Label color of inactive buttons |
| `--st-mode-active-background` | `var(--primary-color)` | Background of the active button — overrides all per-mode colors |
| `--st-mode-active-color` | `var(--text-primary-color)` | Label color of the active button |
| `--st-mode-hover-color` | same as active label | Label color on hover |
| `--st-mode-icon-color` | inherited from the label | Icon color |
| `--st-mode-active-icon-color` | inherited from the label | Icon color of the active button |
| `--st-mode-icon-size` | `24px` | Icon size |
| `--st-mode-border-radius` | `var(--ha-card-border-radius, 4px)` | Corner radius |
| `--st-mode-transition` | `200ms ease` | Transition speed on color changes |
| `--st-font-size-mode-title` | `var(--st-font-size-sensors)` | Font size of the row label in front of a mode row |

### Header

| Variable | Default | Description |
| --- | --- | --- |
| `--st-font-size-title` | `var(--ha-card-header-font-size, 24px)` | Card heading font size |
| `--st-font-weight-title` | `normal` | Card heading font weight |
| `--st-title-color` | inherited | Card heading color |
| `--st-header-icon-color` | `var(--state-icon-color, #44739e)` | Header icon color |
| `--st-toggle-label-color` | `var(--primary-text-color)` | Toggle label color |
| `--st-font-size-toggle-label` | `16px` | Toggle label font size |
| `--st-toggle-icon-color` | `var(--state-icon-color)` | Toggle icon color |
| `--st-fault-inactive-color` | `var(--secondary-background-color)` | Fault icon when inactive |
| `--st-fault-active-color` | `var(--accent-color)` | Fault icon when active |

### Sensors

| Variable | Default | Description |
| --- | --- | --- |
| `--st-font-size-sensors` | `16px` | Base font size of the sensor block |
| `--st-sensor-label-color` | inherited | Sensor label color |
| `--st-sensor-value-color` | inherited | Sensor value color (a per-sensor `state_text_color` still wins) |
| `--st-chip-background` | `transparent` | Background in `layout.sensors: chips` |
| `--st-badge-background` | `transparent` | Background in `layout.sensors: badges` |
| `--st-badge-color` | `var(--primary-text-color)` | Text color of a badge |

### Banners

| Variable | Default | Description |
| --- | --- | --- |
| `--st-banner-background` | `var(--secondary-background-color)` | Banner background |
| `--st-banner-text-color` | `var(--primary-text-color)` | Banner text color |
| `--st-font-size-banner` | `13px` | Banner font size |

The colored left border and icon follow the banner severity and use HA's
`--warning-color` / `--error-color` / `--info-color` / `--success-color`.

### Layout

| Variable | Default | Description |
| --- | --- | --- |
| `--st-spacing` | `4px` | Base spacing unit — most paddings and gaps are multiples of it |
| `--st-body-padding-min` | `12px` | Minimum left/right padding of the card body, so the +/- buttons never touch the card edge even when `--st-spacing` is `0` |

## Setting variables in a Home Assistant theme

In a theme the variables are written without the leading `--`, and they apply to
every Simple Thermostat card at once:

```yaml
my-theme:
  st-spacing: 2px
  st-font-size-xl: 28px
  st-font-size-title: 20px
  st-mode-border-radius: 12px
```
