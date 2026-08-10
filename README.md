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

![Simple Thermostat Layouts](https://raw.githubusercontent.com/duczz/ha-simple-thermostat/master/assets/Full.png)

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

<a id="works-well-with-tempix"></a>
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

**One click:** use the button at the top of this page — it opens the repository
straight in your Home Assistant. Then press **Download**.

Or add it by hand:

1. Open **HACS** in Home Assistant
2. Click the **three dots** in the top right corner → **Custom repositories**
3. Paste this repository's URL and pick the type **Dashboard**
4. Click **Add**, then search for **Simple Thermostat** and download it
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

## 📚 Documentation

| Guide | What's in it |
| ----- | ------------ |
| **[Configuration](docs/configuration.md)** | Every option, with tables — header, setpoints, controls, sensors, banners, layout |
| **[Config examples](docs/examples.md)** | Ready-to-paste configs, from minimal to fully styled |
| **[Theming](docs/theming.md)** | 53 CSS variables, recipes for the most common restyling requests |
| **[Templating](docs/templates.md)** | `version: 3` templated sensors |
| **[Visual Editor](docs/visual_editor.md)** | What each editor section does |
| **[Changelog](CHANGELOG.md)** | What changed, release by release |

---

<a id="visual-editor"></a>
## 🖱️ Visual Editor

The card has a built-in visual editor accessible from the HA card picker (pencil icon). It fully supports configuring almost all layout options, banners, sensors, modes, and controls without touching YAML, and Home Assistant's UI tooltips describe every field. See the [Visual Editor Guide](docs/visual_editor.md) for an overview of the sections.

> 💡 **Tip:** Advanced options like custom CSS or deeply nested objects can be configured in the YAML (code) editor. The Custom CSS panel lists every available CSS variable, grouped by area.

---

<a id="configuration"></a>
## ⚙️ Configuration

You only need `type` and `entity`. The card renders with sensible defaults and
adapts to the entity type.

```yaml
type: custom:simple-thermostat
entity: climate.my_room # Also supports fan.* and humidifier.*
```

From there, everything is optional:

```yaml
type: custom:simple-thermostat
entity: climate.my_room
setpoint_style: dial      # native circular dial instead of the number
layout:
  sensors:
    type: chips           # list | table | chips | badges
sensors:
  - entity: sensor.room_humidity
    name: Humidity
banners:
  - entity: binary_sensor.living_room_window
    state: "on"
    type: info
    text: Window open
    icon: mdi:window-open
```

👉 **[Full option reference](docs/configuration.md)** · **[More examples](docs/examples.md)**

---

<a id="theming"></a>
## 🎨 Theming

Mode colors follow your Home Assistant theme out of the box, and 53 CSS variables let you restyle anything from the setpoint color to the banner background — no `card-mod` needed:

```yaml
styles: |
  ha-card {
    --st-setpoint-color: #ffd54f;
    --st-mode-border-radius: 12px;
  }
```

👉 **[Theming Guide](docs/theming.md)**

[hacs-badge]: https://img.shields.io/badge/HACS-Custom-41BDF5.svg?style=for-the-badge&logo=homeassistantcommunitystore&logoColor=white
[hacs-url]: https://hacs.xyz
[ha-badge]: https://img.shields.io/badge/Home%20Assistant-2024.8+-41BDF5.svg?style=for-the-badge&logo=homeassistant&logoColor=white
[ha-url]: https://www.home-assistant.io
[release-url]: https://github.com/duczz/ha-simple-thermostat/releases/latest
