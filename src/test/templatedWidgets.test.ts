// @vitest-environment jsdom
import { render } from 'lit'
import renderTemplated, {
  getRenderType,
  renderWidget,
  pendingSliderValues,
} from '../components/templated'

const renderInto = (result: any) => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  render(result, container)
  return container
}

afterEach(() => {
  pendingSliderValues.clear()
  vi.restoreAllMocks()
})

describe('getRenderType', () => {
  test('accepts widgets only for compatible domains', () => {
    expect(getRenderType('slider', 'input_number')).toBe('slider')
    expect(getRenderType('slider', 'sensor')).toBe('state')
    expect(getRenderType('switch', 'input_boolean')).toBe('switch')
    expect(getRenderType('switch', 'input_number')).toBe('state')
    expect(getRenderType('select', 'input_select')).toBe('select')
    expect(getRenderType(undefined, 'input_number')).toBe('state')
  })

  test('timer domain always auto-detects, regardless of display_as', () => {
    expect(getRenderType(undefined, 'timer')).toBe('timer')
    expect(getRenderType('state', 'timer')).toBe('timer')
    expect(getRenderType('switch', 'timer')).toBe('timer')
  })
})

describe('renderWidget: timer', () => {
  test('renders the countdown custom element with the raw state/attributes', () => {
    const container = renderInto(
      renderWidget(
        'timer',
        'timer.laundry',
        'timer',
        'active',
        { finishes_at: '2026-07-05T12:02:00.000Z' },
        {}
      )
    )
    const el = container.querySelector('simple-thermostat-timer-remaining') as any
    expect(el).not.toBeNull()
    expect(el.stateObj).toEqual({
      state: 'active',
      attributes: { finishes_at: '2026-07-05T12:02:00.000Z' },
    })
  })
})

describe('renderTemplated with display_as (v3 sensors)', () => {
  const baseArgs = {
    context: { state: '50', attributes: { min: 0, max: 100, step: 1 } },
    entityId: 'input_number.fan_level',
    hass: { localize: () => '', callService: vi.fn() },
    config: { decimals: 1 },
    localize: (label: string) => label,
    openEntityPopover: () => {},
    variables: {},
    label: false as const,
  }

  test('display_as slider renders a ha-slider widget', () => {
    const container = renderInto(
      renderTemplated({ ...baseArgs, display_as: 'slider' })
    )
    expect(container.querySelector('ha-slider')).not.toBeNull()
  })

  test('without display_as the template text renders instead', () => {
    const container = renderInto(
      renderTemplated({ ...baseArgs, template: '{{state.raw}}' })
    )
    expect(container.querySelector('ha-slider')).toBeNull()
    expect(container.textContent).toContain('50')
  })

  test('a timer.* entity auto-renders the countdown widget without display_as', () => {
    const container = renderInto(
      renderTemplated({
        context: {
          state: 'active',
          attributes: { finishes_at: '2026-07-05T12:02:00.000Z' },
        },
        entityId: 'timer.laundry',
        hass: { localize: () => '' },
        config: { decimals: 1 },
        localize: (label: string) => label,
        openEntityPopover: () => {},
        variables: {},
        label: false,
        // no display_as set — timer must still auto-render the widget
      })
    )
    expect(container.querySelector('simple-thermostat-timer-remaining')).not.toBeNull()
  })
})

describe('#24: entity-derived data is HTML-escaped before templating (XSS hardening)', () => {
  const hass = { localize: () => '' }

  test('a malicious friendly_name cannot inject a real element via the default label', () => {
    const container = renderInto(
      renderTemplated({
        context: {
          state: 'heat',
          attributes: { friendly_name: '<img src=x onerror="window.__pwned = true">' },
        },
        entityId: 'climate.test',
        hass,
        config: { decimals: 1 },
        localize: (label: string) => label,
        openEntityPopover: () => {},
        variables: {},
        label: undefined, // falsy -> default template '{{friendly_name}}'
      })
    )
    // No real <img> tag was created in the DOM...
    expect(container.querySelector('img')).toBeNull()
    // ...the payload shows up as inert text instead
    expect(container.textContent).toContain('<img src=x onerror="window.__pwned = true">')
  })

  test('a malicious attribute used directly in a custom template is neutralized', () => {
    const container = renderInto(
      renderTemplated({
        context: {
          state: 'heat',
          attributes: { hostile: '<script>window.__pwned = true</script>' },
        },
        entityId: 'climate.test',
        hass,
        config: { decimals: 1 },
        localize: (label: string) => label,
        openEntityPopover: () => {},
        variables: {},
        label: false,
        template: '{{hostile}}',
      })
    )
    expect(container.querySelector('script')).toBeNull()
    expect(container.textContent).toContain('<script>window.__pwned = true</script>')
  })

  test('a malicious state value cannot break out via {{state.raw}}', () => {
    const container = renderInto(
      renderTemplated({
        context: { state: '"><svg onload=alert(1)>', attributes: {} },
        entityId: 'climate.test',
        hass,
        config: { decimals: 1 },
        localize: (label: string) => label,
        openEntityPopover: () => {},
        variables: {},
        label: false,
        template: '{{state.raw}}',
      })
    )
    expect(container.querySelector('svg')).toBeNull()
  })

  test('legitimate filters (css/icon) still produce real HTML for normal values', () => {
    const container = renderInto(
      renderTemplated({
        context: { state: 'heat', attributes: { friendly_name: 'Living Room' } },
        entityId: 'climate.test',
        hass,
        config: { decimals: 1 },
        localize: (label: string) => label,
        openEntityPopover: () => {},
        variables: {},
        label: false,
        template: "{{friendly_name|css({ color: 'red' })}}",
      })
    )
    const span = container.querySelector('span')
    expect(span).not.toBeNull()
    expect(span!.style.color).toBe('red')
    expect(span!.textContent).toBe('Living Room')
  })

  test('normal values with no special characters render unchanged', () => {
    const container = renderInto(
      renderTemplated({
        context: { state: 'heat', attributes: { friendly_name: "Martin's Office" } },
        entityId: 'climate.test',
        hass,
        config: { decimals: 1 },
        localize: (label: string) => label,
        openEntityPopover: () => {},
        variables: {},
        label: undefined, // falsy -> default template '{{friendly_name}}'
      })
    )
    expect(container.textContent).toContain("Martin's Office")
  })
})

describe('translate template filter', () => {
  const renderWithLocalize = (localize: (label: string, prefix?: string) => string, template: string) =>
    renderInto(
      renderTemplated({
        context: { state: 'eco', attributes: {} },
        entityId: 'climate.test',
        hass: { localize: () => '' },
        config: { decimals: 1 },
        localize,
        openEntityPopover: () => {},
        variables: {},
        label: false,
        template,
      })
    )

  test('default prefix builds a non-doubled lookup key', () => {
    const localize = (label: string, prefix = '') =>
      prefix === 'state_attributes.climate.' && label === 'eco' ? 'Öko' : label
    const container = renderWithLocalize(localize, '{{state.raw|translate}}')
    expect(container.textContent).toContain('Öko')
  })

  test('explicit prefix is passed through unchanged', () => {
    const seen: string[] = []
    const localize = (label: string, prefix = '') => {
      seen.push(`${prefix}${label}`)
      return label
    }
    renderWithLocalize(localize, "{{state.raw|translate('component.climate.state._.')}}")
    expect(seen).toContain('component.climate.state._.eco')
  })

  test('falls back to the raw value when no translation exists', () => {
    const localize = (label: string) => label
    const container = renderWithLocalize(localize, '{{state.raw|translate}}')
    expect(container.textContent).toContain('eco')
  })
})

describe('slider pending value handling', () => {
  const attributes = { min: 0, max: 100, step: 1 }

  test('keeps the optimistic value until HA reports it back', () => {
    const hass = { callService: vi.fn().mockResolvedValue(undefined) }
    const container = renderInto(
      renderWidget('slider', 'input_number.x', 'input_number', '50', attributes, hass)
    )
    const slider = container.querySelector('ha-slider') as any
    slider.value = '80'
    slider.dispatchEvent(new Event('change'))
    expect(pendingSliderValues.get('input_number.x')?.value).toBe(80)

    // Re-render with the old state still active — optimistic value wins
    const container2 = renderInto(
      renderWidget('slider', 'input_number.x', 'input_number', '50', attributes, hass)
    )
    expect((container2.querySelector('ha-slider') as any).value).toBe(80)

    // HA reports the new value — pending entry is consumed
    renderInto(
      renderWidget('slider', 'input_number.x', 'input_number', '80', attributes, hass)
    )
    expect(pendingSliderValues.has('input_number.x')).toBe(false)
  })

  test('rolls back the optimistic value when the service call fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    const hass = { callService: vi.fn().mockRejectedValue(new Error('boom')) }
    const container = renderInto(
      renderWidget('slider', 'input_number.x', 'input_number', '50', attributes, hass)
    )
    const slider = container.querySelector('ha-slider') as any
    slider.value = '80'
    slider.dispatchEvent(new Event('change'))

    await vi.waitFor(() =>
      expect(pendingSliderValues.has('input_number.x')).toBe(false)
    )
  })

  test('expires stale pending values after the TTL (integration rounding)', () => {
    const hass = { callService: vi.fn().mockResolvedValue(undefined) }
    const nowSpy = vi.spyOn(Date, 'now').mockReturnValue(1_000_000)

    const container = renderInto(
      renderWidget('slider', 'input_number.x', 'input_number', '50', attributes, hass)
    )
    const slider = container.querySelector('ha-slider') as any
    slider.value = '80'
    slider.dispatchEvent(new Event('change'))

    // HA rounds to 79.5 — the exact-match cleanup never hits
    nowSpy.mockReturnValue(1_000_000 + 6_000)
    const container2 = renderInto(
      renderWidget('slider', 'input_number.x', 'input_number', '79.5', attributes, hass)
    )
    expect(pendingSliderValues.has('input_number.x')).toBe(false)
    expect((container2.querySelector('ha-slider') as any).value).toBe(79.5)
  })
})
