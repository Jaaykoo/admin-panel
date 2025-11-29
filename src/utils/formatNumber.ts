/**
 * Formate un nombre en notation compacte (K, M, B)
 * @param value - Le nombre à formater
 * @param decimals - Nombre de décimales (par défaut 1)
 * @returns Le nombre formaté avec suffixe (K, M, B)
 *
 * @example
 * formatCompactNumber(1000) // "1K"
 * formatCompactNumber(14000) // "14K"
 * formatCompactNumber(1500) // "1.5K"
 * formatCompactNumber(1000000) // "1M"
 * formatCompactNumber(2500000) // "2.5M"
 */
export function formatCompactNumber(value: number, decimals: number = 1): string {
  if (value === 0) {
    return '0';
  }

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  // Milliards
  if (absValue >= 1_000_000_000) {
    const formatted = (absValue / 1_000_000_000).toFixed(decimals);
    return `${sign}${formatted}B`;
  }

  // Millions
  if (absValue >= 1_000_000) {
    const formatted = (absValue / 1_000_000).toFixed(decimals);
    return `${sign}${formatted}M`;
  }

  // Milliers
  if (absValue >= 1_000) {
    const formatted = (absValue / 1_000).toFixed(decimals);
    return `${sign}${formatted}K`;
  }

  // Moins de 1000
  return `${sign}${absValue.toFixed(decimals)}`;
}

/**
 * Formate un nombre avec séparateurs de milliers
 * @param value - Le nombre à formater
 * @param locale - Locale pour le formatage (par défaut 'fr-FR')
 * @returns Le nombre formaté avec séparateurs
 *
 * @example
 * formatNumber(1000) // "1 000"
 * formatNumber(1000000) // "1 000 000"
 */
export function formatNumber(value: number, locale: string = 'fr-FR'): string {
  return value.toLocaleString(locale);
}

