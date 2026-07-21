// @vitest-environment jsdom
import renderInfoItem from '../components/infoItem'
import { render } from 'lit'

test('return undefined on hide and no state', () => {
  const firstResult = renderInfoItem({
    hide: true,
    hass: {},
    state: 'foo',
    details: {},
  })
  expect(firstResult).toBe(undefined)

  expect(
    renderInfoItem({
      hide: false,
      hass: {},
      state: undefined,
      details: {},
    })
  ).toBe(undefined)
})

test('render into dom', () => {
  const spec = {
    heading: 'Temperature',
    value: '4℃',
  }
  const result = renderInfoItem({
    hide: false,
    hass: {},
    state: spec.value,
    details: { heading: spec.heading },
  })

  render(result, document.body)
  const heading = document.body.querySelector('div')!.textContent
  const value = document.body.querySelector('div:last-child')!.textContent

  // TODO Spaces exist in render result. For sanitys sake they should probably be removed
  expect(heading).toBe(` ${spec.heading}: `)
  expect(value).toBe(spec.value)
})

test('badges layout: only the outer pill is clickable (no double popover)', () => {
  const openEntityPopover = vi.fn()
  const stateObj = {
    entity_id: 'sensor.humidity',
    state: '55',
    attributes: { friendly_name: 'Humidity' },
  }
  const result = renderInfoItem({
    hide: false,
    hass: { states: {}, formatEntityState: () => '55 %' },
    state: stateObj,
    layoutType: 'badges',
    openEntityPopover,
    details: { heading: 'Humidity', entity: 'sensor.humidity' },
  })

  const container = document.createElement('div')
  document.body.appendChild(container)
  render(result, container)

  const badge = container.querySelector('.st-badge')!
  expect(badge.classList.contains('clickable')).toBe(true)

  const valueCell = container.querySelector('.sensor-value')!
  expect(valueCell.classList.contains('clickable')).toBe(false)

  // A click on the value bubbles to the badge — the popover must fire once
  valueCell.dispatchEvent(new Event('click', { bubbles: true }))
  expect(openEntityPopover).toHaveBeenCalledTimes(1)
  container.remove()
})

test('chips layout: value cell stays non-clickable', () => {
  const openEntityPopover = vi.fn()
  const stateObj = {
    entity_id: 'sensor.humidity',
    state: '55',
    attributes: {},
  }
  const result = renderInfoItem({
    hide: false,
    hass: { states: {}, formatEntityState: () => '55 %' },
    state: stateObj,
    layoutType: 'chips',
    openEntityPopover,
    details: { heading: 'Humidity', entity: 'sensor.humidity' },
  })

  const container = document.createElement('div')
  document.body.appendChild(container)
  render(result, container)

  const valueCell = container.querySelector('.sensor-value')!
  expect(valueCell.classList.contains('clickable')).toBe(false)
  valueCell.dispatchEvent(new Event('click', { bubbles: true }))
  expect(openEntityPopover).toHaveBeenCalledTimes(1)
  container.remove()
})

test('state_text_color colors the value only — the heading label stays neutral (chips)', () => {
  const stateObj = {
    entity_id: 'sensor.preset',
    state: 'comfort',
    attributes: {},
  }
  const result = renderInfoItem({
    hide: false,
    hass: { states: {}, formatEntityState: () => 'Comfort' },
    state: stateObj,
    layoutType: 'chips',
    details: {
      heading: 'Preset',
      entity: 'sensor.preset',
      state_text_color: { comfort: 'rgb(255, 0, 0)' },
      rawState: 'comfort',
    },
  })

  const container = document.createElement('div')
  document.body.appendChild(container)
  render(result, container)

  const label = container.querySelector('.heading-text') as HTMLElement
  const value = container.querySelector('.sensor-value') as HTMLElement

  // Label must not carry the state color; value must.
  expect(label.getAttribute('style')).toBeFalsy()
  expect(value.getAttribute('style') || '').toContain('rgb(255, 0, 0)')
  container.remove()
})

test('state_text_color colors the value only — the heading label stays neutral (list/table)', () => {
  const stateObj = {
    entity_id: 'sensor.preset',
    state: 'comfort',
    attributes: {},
  }
  const result = renderInfoItem({
    hide: false,
    hass: { states: {}, formatEntityState: () => 'Comfort' },
    state: stateObj,
    details: {
      heading: 'Preset',
      entity: 'sensor.preset',
      state_text_color: { comfort: 'rgb(255, 0, 0)' },
      rawState: 'comfort',
    },
  })

  const container = document.createElement('div')
  document.body.appendChild(container)
  render(result, container)

  const label = container.querySelector('.heading-text') as HTMLElement
  const value = container.querySelector('.sensor-value') as HTMLElement

  expect(label.getAttribute('style')).toBeFalsy()
  expect(value.getAttribute('style') || '').toContain('rgb(255, 0, 0)')
  container.remove()
})

test('render with icon', () => {
  const spec = {
    heading: 'Temperature',
    value: '4℃',
  }
  const result = renderInfoItem({
    hide: false,
    hass: {},
    state: spec.value,
    details: { heading: spec.heading, icon: 'test' },
  })

  render(result, document.body)
  const iconEl = document.body.querySelector('ha-icon') as any
  const value = document.body.querySelector('div:last-child')!.textContent

  // ha-icon uses property binding (Lit 3 / HA 2021.11+), so the icon is
  // set as a property, not an attribute. Verify the property is set.
  expect(iconEl).not.toBeNull()
  expect(iconEl.icon).toBe('test')
  expect(value).toBe(spec.value)
})

test('a timer.* sensor auto-renders the countdown widget without display_as configured', () => {
  const stateObj = {
    entity_id: 'timer.laundry',
    state: 'active',
    attributes: { finishes_at: '2026-07-05T12:02:00.000Z' },
  }
  const result = renderInfoItem({
    hide: false,
    hass: {},
    state: stateObj,
    // no details.display_as — v2 must still auto-detect the timer domain
    details: { heading: 'Laundry' },
  })

  const container = document.createElement('div')
  document.body.appendChild(container)
  render(result, container)

  const widget = container.querySelector('simple-thermostat-timer-remaining') as any
  expect(widget).not.toBeNull()
  expect(widget.stateObj).toEqual({ state: 'active', attributes: stateObj.attributes })
  container.remove()
})
