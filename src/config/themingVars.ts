/**
 * The card's public CSS custom properties, grouped for the editor's Custom CSS
 * panel. 53 variables are useless if nobody can find them, and the docs live in
 * the repository — this puts the list where the CSS is actually written.
 *
 * Single source of truth check: `src/test/theming.test.ts` asserts this list is
 * exactly the set of `--st-*` variables `styles.css` reads, so it cannot drift
 * away from the stylesheet or the Theming Guide.
 */
export interface ThemingVarGroup {
  label: string
  variables: string[]
}

export const THEMING_VARS: ThemingVarGroup[] = [
  {
    label: 'Setpoint',
    variables: [
      '--st-setpoint-color',
      '--st-font-size-xl',
      '--st-font-size-l',
      '--st-font-size-unit',
      '--st-font-size-m',
      '--st-value-update-color',
      '--st-setpoint-align',
      '--st-divider-color',
      '--st-divider-height',
    ],
  },
  {
    label: 'Dial',
    variables: [
      '--st-dial-size',
      '--st-dial-info-top',
      '--st-dial-button-size',
      '--st-dial-button-color',
      '--st-dial-button-gap',
      '--st-dial-button-bottom',
    ],
  },
  {
    label: 'Mode buttons',
    variables: [
      '--st-mode-background',
      '--st-mode-color',
      '--st-mode-active-background',
      '--st-mode-active-color',
      '--st-mode-hover-color',
      '--st-mode-icon-color',
      '--st-mode-active-icon-color',
      '--st-mode-icon-size',
      '--st-mode-border-radius',
      '--st-mode-transition',
      '--st-font-size-mode-title',
    ],
  },
  {
    label: 'Mode colors',
    variables: [
      '--st-heat-color',
      '--st-cool-color',
      '--st-heat_cool-color',
      '--st-auto-color',
      '--st-dry-color',
      '--st-fan_only-color',
      '--st-off-color',
    ],
  },
  {
    label: 'Header',
    variables: [
      '--st-font-size-title',
      '--st-font-weight-title',
      '--st-title-color',
      '--st-header-icon-color',
      '--st-toggle-label-color',
      '--st-font-size-toggle-label',
      '--st-toggle-icon-color',
      '--st-fault-inactive-color',
      '--st-fault-active-color',
    ],
  },
  {
    label: 'Sensors',
    variables: [
      '--st-font-size-sensors',
      '--st-sensor-label-color',
      '--st-sensor-value-color',
      '--st-chip-background',
      '--st-badge-background',
      '--st-badge-color',
    ],
  },
  {
    label: 'Banners',
    variables: [
      '--st-banner-background',
      '--st-banner-text-color',
      '--st-font-size-banner',
    ],
  },
  {
    label: 'Layout',
    variables: ['--st-spacing', '--st-body-padding-min'],
  },
]
