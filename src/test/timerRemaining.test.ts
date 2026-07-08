// @vitest-environment jsdom
import {
  SimpleThermostatTimerRemaining,
  TIMER_REMAINING_TAG,
} from '../components/timerRemaining'

if (!customElements.get(TIMER_REMAINING_TAG)) {
  customElements.define(TIMER_REMAINING_TAG, SimpleThermostatTimerRemaining as any)
}

const createTimer = () => document.createElement(TIMER_REMAINING_TAG) as any

afterEach(() => {
  vi.useRealTimers()
})

describe('timer countdown widget', () => {
  test('active timer with a future finishes_at counts down live', async () => {
    vi.useFakeTimers()
    const now = new Date('2026-07-05T12:00:00.000Z')
    vi.setSystemTime(now)

    const el = createTimer()
    document.body.appendChild(el)
    el.stateObj = {
      state: 'active',
      attributes: { finishes_at: '2026-07-05T12:02:05.000Z' }, // 2:05 away
    }
    await el.updateComplete

    expect(el.textContent.trim()).toBe('2:05')

    vi.advanceTimersByTime(5000) // 5s pass
    await el.updateComplete
    expect(el.textContent.trim()).toBe('2:00')

    el.remove()
  })

  test('formats remaining time over an hour as H:MM:SS', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-05T12:00:00.000Z'))

    const el = createTimer()
    document.body.appendChild(el)
    el.stateObj = {
      state: 'active',
      attributes: { finishes_at: '2026-07-05T13:02:03.000Z' }, // 1:02:03 away
    }
    await el.updateComplete

    expect(el.textContent.trim()).toBe('1:02:03')
    el.remove()
  })

  test('paused timer falls back to the remaining attribute (no ticking)', async () => {
    vi.useFakeTimers()
    const el = createTimer()
    document.body.appendChild(el)
    el.stateObj = {
      state: 'paused',
      attributes: { remaining: '0:01:30' },
    }
    await el.updateComplete

    expect(el.textContent.trim()).toBe('0:01:30')

    // No ticker should be running for a paused timer
    vi.advanceTimersByTime(5000)
    await el.updateComplete
    expect(el.textContent.trim()).toBe('0:01:30')
    el.remove()
  })

  test('idle/unknown state falls back to hass.formatEntityState', async () => {
    const el = createTimer()
    document.body.appendChild(el)
    el.hass = { formatEntityState: () => 'Idle' }
    el.stateObj = { state: 'idle', attributes: {} }
    await el.updateComplete

    expect(el.textContent.trim()).toBe('Idle')
    el.remove()
  })

  test('clears the ticker on disconnect (no leaked interval)', async () => {
    vi.useFakeTimers()
    const clearSpy = vi.spyOn(global, 'clearInterval')
    vi.setSystemTime(new Date('2026-07-05T12:00:00.000Z'))

    const el = createTimer()
    document.body.appendChild(el)
    el.stateObj = {
      state: 'active',
      attributes: { finishes_at: '2026-07-05T12:10:00.000Z' },
    }
    await el.updateComplete

    el.remove() // disconnectedCallback
    expect(clearSpy).toHaveBeenCalled()

    // Advancing time after disconnect must not throw or keep updating
    expect(() => vi.advanceTimersByTime(60000)).not.toThrow()
  })

  test('ticker stops itself once the end time has passed', async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-07-05T12:00:00.000Z'))

    const el = createTimer()
    document.body.appendChild(el)
    el.hass = { formatEntityState: () => 'Idle' }
    el.stateObj = {
      state: 'active',
      attributes: { finishes_at: '2026-07-05T12:00:02.000Z' }, // 2s away
    }
    await el.updateComplete
    expect(el.textContent.trim()).toBe('0:02')

    vi.advanceTimersByTime(2000)
    await el.updateComplete
    expect(el.textContent.trim()).toBe('0:00')

    // Once past finishes_at, the widget must not error or tick negative
    vi.advanceTimersByTime(5000)
    await el.updateComplete
    expect(el.textContent.trim()).toBe('0:00')
    el.remove()
  })

  test('missing stateObj renders empty without throwing', async () => {
    const el = createTimer()
    document.body.appendChild(el)
    await el.updateComplete
    expect(el.textContent.trim()).toBe('')
    el.remove()
  })
})
