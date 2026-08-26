// Layout smoke test — the gap vitest structurally cannot cover.
//
// The unit suite runs in jsdom, which parses CSS but never lays anything out:
// every getBoundingClientRect() is 0x0 there. Three of our documented gotchas
// are layout bugs that were therefore invisible to it:
//
//   #23  the dial collapsed to 0px (circular container-query dependency) and
//        rendered as an ellipse instead of a circle
//   #26  an empty .sensors element flipped the body to space-between, pushing
//        the setpoint to the left on a card that has no sensors
//   #10  spacing that depends on HA's own values drifting
//
// This renders the real built bundle in headless Chromium at two viewports and
// asserts the things those bugs would break. It needs `npm run build` first.
//
// Run: npm run test:visual

import assert from 'node:assert/strict'
import { mkdir, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { chromium } from 'playwright'

const bundlePath = resolve('dist', 'simple-thermostat.js')
const outputDirectory = resolve('test-results', 'visual')

const bundle = await readFile(bundlePath, 'utf8').catch(() => {
  console.error(
    `Missing ${bundlePath} — run "npm run build" before the visual smoke test.`
  )
  process.exit(1)
})

await mkdir(outputDirectory, { recursive: true })

// Minimal stand-ins for the HA elements the card composes. Only their box
// behaviour matters here: the card's own CSS decides the sizes we assert on,
// and that is exactly what we want to exercise.
const STUBS = `
  const passthrough = (css) => class extends HTMLElement {
    constructor() {
      super()
      this.attachShadow({ mode: 'open' }).innerHTML =
        '<style>:host{' + css + '}</style><slot></slot>'
    }
  }
  for (const [tag, css] of [
    ['ha-card', 'display:block;box-sizing:border-box;width:100%'],
    ['ha-icon', 'display:inline-block;width:24px;height:24px'],
    ['ha-svg-icon', 'display:inline-block;width:24px;height:24px'],
    ['ha-icon-button', 'display:inline-flex;width:var(--ha-icon-button-size,48px);height:var(--ha-icon-button-size,48px)'],
    ['ha-outlined-icon-button', 'display:inline-flex;width:40px;height:40px'],
    // The dial fills whatever box the card's CSS gives it — that box is the
    // thing gotcha #23 was about, so the stub must not impose a size itself.
    ['ha-control-circular-slider', 'display:block;width:100%;height:100%'],
  ]) {
    if (!customElements.get(tag)) customElements.define(tag, passthrough(css))
  }
  window.customCards = []
`

const climateEntity = {
  entity_id: 'climate.test',
  state: 'heat',
  attributes: {
    friendly_name: 'Test Climate',
    temperature: 21.5,
    current_temperature: 20,
    min_temp: 7,
    max_temp: 35,
    hvac_modes: ['off', 'heat', 'cool'],
  },
}

// Only the data crosses into the page — Playwright cannot serialize functions,
// so the hass formatters are built browser-side in mount() below.
const hassData = {
  states: { 'climate.test': climateEntity },
  config: { unit_system: { temperature: '°C' } },
  locale: { language: 'en', number_format: 'language' },
}

const VIEWPORTS = [
  { name: 'desktop', width: 900, height: 900 },
  // Narrow enough that the container queries behind the dial and the number
  // scaling actually engage (see gotcha #23).
  { name: 'mobile', width: 334, height: 900 },
]

const browser = await chromium.launch()
const failures = []

const check = (label, fn) => {
  try {
    fn()
  } catch (error) {
    failures.push(`${label}: ${error.message}`)
  }
}

try {
  for (const viewport of VIEWPORTS) {
    const page = await browser.newPage({
      viewport: { width: viewport.width, height: viewport.height },
    })

    const consoleErrors = []
    page.on('pageerror', (error) => consoleErrors.push(String(error)))

    await page.setContent(`<!doctype html><style>
      :root {
        --card-background-color:#18232d; --ha-card-background:#18232d;
        --primary-text-color:#f4f6f8; --secondary-text-color:#b8c0c7;
        --primary-color:#03a9d9; --divider-color:#46515c;
      }
      body { margin:16px; background:#101820; font-family:Arial,sans-serif; }
      simple-thermostat { display:block; max-width:720px; }
    </style><body></body>`)

    await page.evaluate(STUBS)
    await page.addScriptTag({ content: bundle, type: 'module' })
    await page.waitForFunction(() => !!customElements.get('simple-thermostat'))

    const mount = async (config) =>
      page.evaluate(
        async ({ config, hassData }) => {
          const hass = {
            ...hassData,
            localize: () => '',
            formatEntityState: (stateObj) => String(stateObj?.state ?? ''),
            formatEntityAttributeValue: () => '',
          }
          document.body.innerHTML = ''
          const element = document.createElement('simple-thermostat')
          element.setConfig(config)
          element.hass = hass
          document.body.appendChild(element)
          await element.updateComplete
          return true
        },
        { config, hassData }
      )

    const box = (selector) =>
      page.evaluate((selector) => {
        const card = document.querySelector('simple-thermostat')
        const node = card.shadowRoot.querySelector(selector)
        if (!node) return null
        const { width, height, left, right } = node.getBoundingClientRect()
        return { width, height, left, right, center: left + width / 2 }
      }, selector)

    // --- gotcha #23: the dial must be a real, square circle ----------------
    await mount({ entity: 'climate.test', setpoint_style: 'dial' })
    await page.screenshot({
      path: resolve(outputDirectory, `dial-${viewport.name}.png`),
      fullPage: true,
    })

    const dial = await box('.current-wrapper.dial')
    check(`${viewport.name} dial present`, () =>
      assert.ok(dial, 'no .current-wrapper.dial rendered')
    )
    if (dial) {
      check(`${viewport.name} dial has size`, () =>
        assert.ok(
          dial.width > 40 && dial.height > 40,
          `collapsed to ${dial.width}x${dial.height}`
        )
      )
      check(`${viewport.name} dial is square`, () =>
        assert.ok(
          Math.abs(dial.width - dial.height) <= 1,
          `not square: ${dial.width}x${dial.height}`
        )
      )
    }

    // --- gotcha #26: no sensors means a centered setpoint -------------------
    await mount({
      entity: 'climate.test',
      hide: { temperature: true, state: true },
    })
    await page.screenshot({
      path: resolve(outputDirectory, `number-no-sensors-${viewport.name}.png`),
      fullPage: true,
    })

    const body = await box('.body')
    const setpoint = await box('.setpoint')
    check(`${viewport.name} setpoint centered without sensors`, () => {
      assert.ok(body && setpoint, 'missing .body or .setpoint')
      assert.ok(
        Math.abs(body.center - setpoint.center) <= 2,
        `off-center by ${Math.abs(body.center - setpoint.center).toFixed(1)}px ` +
          `(body ${body.center.toFixed(1)}, setpoint ${setpoint.center.toFixed(1)})`
      )
    })

    // --- the card must not overflow its own width --------------------------
    const card = await box('ha-card')
    check(`${viewport.name} card within viewport`, () => {
      assert.ok(card, 'no ha-card rendered')
      assert.ok(
        card.width <= viewport.width,
        `card ${card.width}px wider than viewport ${viewport.width}px`
      )
    })

    check(`${viewport.name} no page errors`, () =>
      assert.equal(consoleErrors.length, 0, consoleErrors.join(' | '))
    )

    await page.close()
  }
} finally {
  await browser.close()
}

if (failures.length > 0) {
  console.error(`\nVisual smoke test failed (${failures.length}):`)
  for (const failure of failures) console.error(`  × ${failure}`)
  console.error(`\nScreenshots: ${outputDirectory}`)
  process.exit(1)
}

console.log(
  `Visual smoke test passed for ${VIEWPORTS.map((v) => v.name).join(', ')}.`
)
console.log(`Screenshots: ${outputDirectory}`)
