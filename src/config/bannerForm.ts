import { BannerConfig } from '../types'

/**
 * Merge an ha-form `value-changed` payload into an existing banner config.
 *
 * - Comma separated `state` / `state_not` strings become arrays.
 * - Fields cleared in the form ('' / null / undefined) are removed from the
 *   result instead of being resurrected from the previous banner state.
 * - Unknown keys already present in the YAML banner are preserved.
 *
 * Pure function (no LitElement/window dependency) so it can be unit-tested.
 */
export function mergeBannerFormData(
  existing: BannerConfig | undefined,
  formData: Record<string, any>
): BannerConfig {
  const normalized: Record<string, any> = { ...formData }

  for (const key of ['state', 'state_not'] as const) {
    const val = normalized[key]
    if (typeof val === 'string' && val.includes(',')) {
      normalized[key] = val
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => s !== '')
    }
  }

  const merged: Record<string, any> = { ...existing, ...normalized }
  for (const key of Object.keys(merged)) {
    if (merged[key] === '' || merged[key] === undefined || merged[key] === null) {
      delete merged[key]
    }
  }
  return merged as BannerConfig
}
