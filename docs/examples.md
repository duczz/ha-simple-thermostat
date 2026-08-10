# Config examples

Ready-to-paste configurations. Every option used here is described in the
[Configuration reference](configuration.md).

## Minimal

Everything is optional except the entity.

```yaml
type: custom:simple-thermostat
entity: climate.my_room
```

## Full config

Sensors, header faults, a header toggle and renamed HVAC modes.

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

## Compact mode

A minimalist layout. Hide everything except sensors and temperature control:

```yaml
type: custom:simple-thermostat
entity: climate.my_room
layout:
  step: row
header: false
control: false
```

## Circular dial

The native Home Assistant dial instead of the classic number, with the
secondary mode rows collapsing while the entity is off.

```yaml
type: custom:simple-thermostat
entity: climate.my_room
setpoint_style: dial
control:
  hvac: {}
  preset:
    _hide_when_off: true
  fan:
    _hide_when_off: true
```

## Chips layout with a battery banner

```yaml
type: custom:simple-thermostat
entity: climate.my_room
layout:
  sensors:
    type: chips
  step: right
sensors:
  - entity: sensor.room_humidity
    name: Humidity
    icon: mdi:water-percent
  - entity: switch.eco_mode
    name: Eco
    icon: mdi:leaf
    display_as: switch
banners:
  - entity: sensor.room_sensor_battery
    below: 20
    type: warning
    text: Low battery ({{value}}%)
    icon: mdi:battery-alert
```

## Restyled card

Colors, sizes and spacing come from CSS variables — see the
[Theming Guide](theming.md) for the full list.

```yaml
type: custom:simple-thermostat
entity: climate.my_room
styles: |
  ha-card {
    --st-spacing: 2px;
    --st-font-size-xl: 30px;
    --st-setpoint-color: #ffd54f;
    --st-mode-border-radius: 12px;
    --st-mode-icon-size: 20px;
    --st-sensor-label-color: #b0bec5;
  }
```

---

**See also:** [Configuration reference](configuration.md) · [Theming Guide](theming.md) · [Templating Guide](templates.md)
