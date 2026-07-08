import { ControlModeOption, HVAC_MODES } from '../types'

export function sortModes(
  type: string,
  list: Array<ControlModeOption>
): Array<ControlModeOption> {
  let order: string[] = []
  if (type === 'hvac') {
    order = Object.values(HVAC_MODES) as Array<string>
  } else if (type === 'fan' || type === 'preset') {
    order = [
      'off',
      'quiet',
      'silent',
      'low',
      'normal',
      'medium',
      'high',
      'highest',
      'turbo',
      'powerful',
      'auto',
      'auto comfort',
      'auto_comfort',
      'auto-comfort',
      'automatic',
      'on',
    ]
  } else {
    return list
  }

  const known: Array<ControlModeOption> = []
  const unknown: Array<ControlModeOption> = []
  list.forEach((item) => {
    const index = order.indexOf(item.value.toLowerCase())
    if (index >= 0) {
      known[index] = item
    } else {
      unknown.push(item)
    }
  })
  return [...known.filter(Boolean), ...unknown]
}
