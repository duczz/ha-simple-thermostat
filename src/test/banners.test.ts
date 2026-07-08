// @vitest-environment jsdom
import { render } from 'lit'
import renderBanners from '../components/banners'

const makeHass = (states: Record<string, any>) => ({ states })

const renderInto = (result: any) => {
  const container = document.createElement('div')
  render(result, container)
  return container
}

describe('renderBanners', () => {
  const entity = {
    entity_id: 'climate.hvac',
    state: 'heat',
    attributes: { battery_level: 15 },
  }

  test('renders a below-threshold banner with {{value}} replaced', () => {
    const config = {
      entity: 'climate.hvac',
      banners: [
        {
          attribute: 'battery_level',
          below: 20,
          type: 'warning',
          text: 'Low battery ({{value}}%)',
        },
      ],
    } as any
    const container = renderInto(
      renderBanners({ config, hass: makeHass({ 'climate.hvac': entity }), entity })
    )
    const banner = container.querySelector('.st-banner')
    expect(banner).not.toBeNull()
    expect(banner!.textContent).toContain('Low battery (15%)')
    expect(banner!.classList.contains('st-banner-warning')).toBe(true)
  })

  test('below/above banners do NOT trigger on non-numeric values', () => {
    const unavailableEntity = {
      ...entity,
      attributes: { battery_level: 'unavailable' },
    }
    const config = {
      entity: 'climate.hvac',
      banners: [{ attribute: 'battery_level', below: 20, text: 'Low battery' }],
    } as any
    const container = renderInto(
      renderBanners({
        config,
        hass: makeHass({ 'climate.hvac': unavailableEntity }),
        entity: unavailableEntity,
      })
    )
    expect(container.querySelector('.st-banner')).toBeNull()
  })

  test('above condition triggers only when value is greater', () => {
    const config = {
      entity: 'climate.hvac',
      banners: [{ attribute: 'battery_level', above: 10, text: 'High' }],
    } as any
    const container = renderInto(
      renderBanners({ config, hass: makeHass({ 'climate.hvac': entity }), entity })
    )
    expect(container.querySelector('.st-banner')).not.toBeNull()

    const config2 = {
      entity: 'climate.hvac',
      banners: [{ attribute: 'battery_level', above: 50, text: 'High' }],
    } as any
    const container2 = renderInto(
      renderBanners({ config: config2, hass: makeHass({ 'climate.hvac': entity }), entity })
    )
    expect(container2.querySelector('.st-banner')).toBeNull()
  })

  test('does not crash when text is a number (YAML `text: 5`)', () => {
    const config = {
      entity: 'climate.hvac',
      banners: [{ state: 'heat', text: 5 }],
    } as any
    const container = renderInto(
      renderBanners({ config, hass: makeHass({ 'climate.hvac': entity }), entity })
    )
    expect(container.querySelector('.st-banner')!.textContent).toContain('5')
  })

  test('state and state_not conditions are AND-combined', () => {
    const config = {
      entity: 'climate.hvac',
      banners: [
        { state: 'heat', text: 'shows' },
        { state: 'cool', text: 'hidden (wrong state)' },
        { state_not: 'heat', text: 'hidden (state_not)' },
        { state: ['heat', 'cool'], state_not: ['off'], text: 'array shows' },
      ],
    } as any
    const container = renderInto(
      renderBanners({ config, hass: makeHass({ 'climate.hvac': entity }), entity })
    )
    const texts = Array.from(container.querySelectorAll('.st-banner')).map(
      (el) => el.textContent
    )
    expect(texts.join(' ')).toContain('shows')
    expect(texts.join(' ')).toContain('array shows')
    expect(texts.join(' ')).not.toContain('hidden')
  })

  test('sorts banners by severity (error first)', () => {
    const config = {
      entity: 'climate.hvac',
      banners: [
        { state: 'heat', type: 'info', text: 'info banner' },
        { state: 'heat', type: 'error', text: 'error banner' },
      ],
    } as any
    const container = renderInto(
      renderBanners({ config, hass: makeHass({ 'climate.hvac': entity }), entity })
    )
    const banners = container.querySelectorAll('.st-banner')
    expect(banners[0].classList.contains('st-banner-error')).toBe(true)
    expect(banners[1].classList.contains('st-banner-info')).toBe(true)
  })

  test('skips banners whose entity does not exist', () => {
    const config = {
      entity: 'climate.hvac',
      banners: [{ entity: 'sensor.missing', state: 'on', text: 'nope' }],
    } as any
    const container = renderInto(
      renderBanners({ config, hass: makeHass({ 'climate.hvac': entity }), entity })
    )
    expect(container.querySelector('.st-banner')).toBeNull()
  })
})
