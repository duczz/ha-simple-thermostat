type LocaleOptions = {
  language?: string
  number_format?: string
}

type Options = {
  decimals?: number
  fallback?: string
  locale?: LocaleOptions
}

function formatNumber(
  number: number | null | undefined | boolean | string,
  { decimals = 1, fallback = 'N/A', locale }: Options = {}
): string {
  const type = typeof number
  if (
    number === null ||
    number === '' ||
    ['boolean', 'undefined'].includes(type)
  ) {
    return fallback
  }

  const value = Number(number)
  if (Number.isNaN(value)) {
    return fallback
  }

  if (!locale) {
    return value.toFixed(decimals)
  }

  if (locale.number_format === 'decimal_comma') {
    return value.toFixed(decimals).replace('.', ',')
  }

  if (locale.number_format === 'space_comma') {
    return new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value)
  }

  if (locale.number_format === 'comma_decimal' || locale.number_format === 'none') {
    return value.toFixed(decimals)
  }

  // 'language' or 'system'
  return new Intl.NumberFormat(
    locale.number_format === 'system' ? undefined : locale.language,
    { minimumFractionDigits: decimals, maximumFractionDigits: decimals }
  ).format(value)
}

export default formatNumber
