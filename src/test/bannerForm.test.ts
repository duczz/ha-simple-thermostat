import { mergeBannerFormData } from '../config/bannerForm'

describe('mergeBannerFormData', () => {
  test('merges changed fields into the existing banner', () => {
    const result = mergeBannerFormData(
      { entity: 'binary_sensor.window', state: 'on', text: 'Window open' },
      { entity: 'binary_sensor.window', state: 'on', text: 'Fenster offen' }
    )
    expect(result).toEqual({
      entity: 'binary_sensor.window',
      state: 'on',
      text: 'Fenster offen',
    })
  })

  test('clearing a text field removes it instead of restoring the old value', () => {
    const result = mergeBannerFormData(
      { entity: 'sensor.x', attribute: 'battery_level', text: 'Old text' },
      { entity: 'sensor.x', attribute: '', text: 'Old text' }
    )
    expect(result).not.toHaveProperty('attribute')
    expect(result.text).toBe('Old text')
  })

  test('clearing via undefined (number selectors) removes the field', () => {
    const result = mergeBannerFormData(
      { attribute: 'battery_level', below: 20 },
      { attribute: 'battery_level', below: undefined }
    )
    expect(result).not.toHaveProperty('below')
  })

  test('splits comma separated state strings into arrays', () => {
    const result = mergeBannerFormData({}, { state: 'unavailable, unknown' })
    expect(result.state).toEqual(['unavailable', 'unknown'])
  })

  test('splits state_not and drops empty segments', () => {
    const result = mergeBannerFormData({}, { state_not: 'on, off, ' })
    expect(result.state_not).toEqual(['on', 'off'])
  })

  test('keeps a single state string as string', () => {
    const result = mergeBannerFormData({}, { state: 'on' })
    expect(result.state).toBe('on')
  })

  test('preserves YAML-only keys not present in the form schema', () => {
    const result = mergeBannerFormData(
      { text: 'Hello', custom_key: 'keep-me' } as any,
      { text: 'World' }
    )
    expect((result as any).custom_key).toBe('keep-me')
    expect(result.text).toBe('World')
  })

  test('works without an existing banner', () => {
    const result = mergeBannerFormData(undefined, { text: 'New Banner', type: 'info' })
    expect(result).toEqual({ text: 'New Banner', type: 'info' })
  })
})
