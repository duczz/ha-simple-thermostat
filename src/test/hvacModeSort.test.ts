import { sortModes } from '../main'

describe('Generic mode sorting', () => {
  describe('HVAC mode sorting', () => {
    test('sorts known modes in canonical order', () => {
      const input = [
        { value: 'cool', icon: '', name: 'cool' },
        { value: 'heat', icon: '', name: 'heat' },
        { value: 'off', icon: '', name: 'off' },
      ]
      const result = sortModes('hvac', input)
      expect(result.map((m) => m.value)).toEqual(['off', 'heat', 'cool'])
    })

    test('appends unknown modes at the end instead of dropping them', () => {
      const input = [
        { value: 'heat', icon: '', name: 'heat' },
        { value: 'custom_mode', icon: '', name: 'custom_mode' }, // unknown
      ]
      const result = sortModes('hvac', input)
      expect(result.map((m) => m.value)).toContain('custom_mode')
      expect(result[result.length - 1].value).toBe('custom_mode')
    })

    test('does not produce undefined/empty slots from sparse array', () => {
      const input = [
        { value: 'auto', icon: '', name: 'auto' },
        { value: 'off', icon: '', name: 'off' },
      ]
      const result = sortModes('hvac', input)
      expect(result.every((m) => m !== undefined)).toBe(true)
      expect(result.map((m) => m.value)).toEqual(['off', 'auto'])
    })

    test('handles all-unknown list without dropping any', () => {
      const input = [
        { value: 'turbo', icon: '', name: 'turbo' },
        { value: 'sleep', icon: '', name: 'sleep' },
      ]
      const result = sortModes('hvac', input)
      expect(result).toHaveLength(2)
      expect(result.map((m) => m.value)).toEqual(['turbo', 'sleep'])
    })

    test('handles empty list', () => {
      expect(sortModes('hvac', [])).toEqual([])
    })
  })

  describe('Fan and Preset mode sorting', () => {
    test('sorts fan speeds logically from slow to fast with auto/on at the end', () => {
      const input = [
        { value: 'high', icon: '', name: 'high' },
        { value: 'quiet', icon: '', name: 'quiet' },
        { value: 'low', icon: '', name: 'low' },
        { value: 'auto', icon: '', name: 'auto' },
        { value: 'medium', icon: '', name: 'medium' },
      ]
      const result = sortModes('fan', input)
      expect(result.map((m) => m.value)).toEqual(['quiet', 'low', 'medium', 'high', 'auto'])
    })

    test('is case insensitive', () => {
      const input = [
        { value: 'HIGH', icon: '', name: 'HIGH' },
        { value: 'low', icon: '', name: 'low' },
      ]
      const result = sortModes('fan', input)
      expect(result.map((m) => m.value)).toEqual(['low', 'HIGH'])
    })

    test('handles unknown modes gracefully', () => {
      const input = [
        { value: 'high', icon: '', name: 'high' },
        { value: 'ultra-speed', icon: '', name: 'ultra-speed' }, // unknown
        { value: 'low', icon: '', name: 'low' },
      ]
      const result = sortModes('fan', input)
      expect(result.map((m) => m.value)).toEqual(['low', 'high', 'ultra-speed'])
    })
  })
})
