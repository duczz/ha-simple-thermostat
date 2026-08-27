import { readFileSync } from 'node:fs'

// `.body` is a grid whose track floor is `min-content`. For a dual (heat_cool)
// entity that floor is "both steppers side by side", which no `min-width: 0` on
// the item can lower — so the second stepper was rendered outside the card on a
// normal dashboard column (measured in a live Home Assistant instance: ~160-180px
// past the edge at 320-480px column widths; single setpoints were never affected).
//
// `flex-wrap: wrap` drops `.setpoint`'s min-content to "the wider single stepper",
// which the grid can fit. jsdom performs no layout, so this cannot be asserted by
// rendering — the rule itself is pinned here instead, and the live measurement is
// recorded above so a future reader knows why the declaration exists.

const css = readFileSync(new URL('../styles.css', import.meta.url), 'utf8')

const rule = (selector: string) => {
  const match = css.match(
    new RegExp(`(^|\\n)${selector.replace('.', '\\.')}\\s*\\{[^}]*\\}`)
  )
  return match ? match[0] : ''
}

test('.setpoint wraps so a dual setpoint cannot overflow the card', () => {
  const setpoint = rule('.setpoint')
  expect(setpoint).not.toBe('')
  expect(setpoint).toMatch(/flex-wrap:\s*wrap/)
})

test('.setpoint keeps min-width: 0 — the two work together, not instead', () => {
  // min-width: 0 still matters for the dial, which caps itself with max-width.
  expect(rule('.setpoint')).toMatch(/min-width:\s*0/)
})

test('.body still uses a min-content track floor — the reason wrapping is needed', () => {
  // If this ever changes to minmax(0, …), revisit whether the wrap is still the
  // right mechanism: the overflow it works around would be gone.
  expect(rule('.body')).toMatch(/grid-auto-columns:\s*minmax\(min-content/)
})
