# Templated Sensors (version: 3)

Set `version: 3` on the card to enable the template sensor system. Templates are evaluated locally using [Squirrelly](https://squirrelly.js.org/) with your entity's state and attributes available as variables.

## Render a state from another entity

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

## Override built-in sensors

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

## Render attributes from the main entity

All attributes from the climate entity are available directly as variables:

```yaml
sensors:
  - label: Min/max temp
    template: '{{min_temp}} / {{max_temp}}'
  - label: Supported HVAC modes
    template: "{{hvac_modes|join(', ')}}"
```

## Use a different entity as context

Reference another entity — all its attributes become available as variables:

```yaml
sensors:
  - label: Temperature
    entity: sensor.multisensor_living_room
    template: '{{temperature}} {{unit_of_measurement}}'
```

## Pass custom variables

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

## Conditional Logic (If / Else)

Squirrelly templates support full logic blocks like `{{@if}}`. Here is a real-world example that shows a warning icon if the temperature drops below 18 degrees, and a standard icon otherwise:

```yaml
sensors:
  - label: Status
    template: >-
      {{@if(current_temperature < 18)}}
        {{"mdi:alert-decagram"|icon}} Too cold!
      {{@else}}
        {{"mdi:check-circle"|icon}} All good
      {{/if}}
```

## Available template filters

| Filter         | Description                      | Example |
| -------------- | -------------------------------- | ------- |
| `icon`         | Render as HA icon                | `{{"mdi:sleep"\|icon}}` |
| `translate`    | Look up HA translation string    | `{{"on"\|translate("state.default.")}}` |
| `formatNumber` | Format number to x decimals      | `{{3\|formatNumber({ decimals: 3 })}}` |
| `join`         | Join array to string             | `{{hvac_modes\|join(', ')}}` |
| `css`          | Apply inline CSS styles          | `{{state.text\|css({ color: 'red' })}}` |
| `debug`        | Print value as JSON string       | `{{state\|debug}}` |
| `relativetime` | Render as relative time          | `{{last_changed\|relativetime}}` |

## Translations (`ui` object)

Access HA's built-in climate UI translations via the `ui` shorthand:

| Key             | Value      |
| --------------- | ---------- |
| `ui.currently`  | Currently  |
| `ui.operation`  | Operation  |
| `ui.fan_mode`   | Fan mode   |
| `ui.swing_mode` | Swing mode |
| `ui.preset_mode`| Preset     |

Custom translation lookup: `{{"on"|translate("state.default.")}}` resolves the key `state.default.on` from HA's translation strings.
