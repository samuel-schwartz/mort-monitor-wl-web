/**
 * Formatting utilities for currency, percentages, and other display values
 * Consolidated from lib/formatters.ts and lib/utils/mortgage-calculations.ts
 */

/**
 * Format a number as US currency
 *
 * @param value - Number to format
 * @param options - Optional Intl.NumberFormat options
 * @returns Formatted currency string (e.g., "$1,234")
 *
 * @example
 * ```ts
 * formatCurrency(1234.56) // "$1,235"
 * formatCurrency(1234.56, { maximumFractionDigits: 2 }) // "$1,234.56"
 * ```
 */
export function formatCurrency(value: number, options?: Intl.NumberFormatOptions): string {
  return value.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
    ...options,
  })
}

/**
 * Format a number as a percentage
 * Removes trailing zeros for cleaner display
 *
 * @param value - Number to format (e.g., 6.25 for 6.25%)
 * @param decimals - Number of decimal places (default: 3)
 * @returns Formatted percentage string (e.g., "6.25%")
 *
 * @example
 * ```ts
 * formatPercent(6.25) // "6.25%"
 * formatPercent(6.0) // "6%"
 * formatPercent(6.125, 2) // "6.13%"
 * ```
 */
export function formatPercent(value: number, decimals = 3): string {
  return `${value.toFixed(decimals).replace(/\.?0+$/, "")}%`
}

/**
 * Alias for formatPercent for backwards compatibility
 */
export const formatPercentage = formatPercent
