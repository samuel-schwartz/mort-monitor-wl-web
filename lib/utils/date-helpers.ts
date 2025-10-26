/**
 * Date utility functions
 */

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const

/**
 * Generate array of years for dropdowns
 * @param startYear - Starting year (defaults to 1980)
 * @param endYear - Ending year (defaults to current year + 1)
 */
export function generateYearOptions(startYear?: number, endYear?: number): number[] {
  const currentYear = new Date().getFullYear()
  const start = startYear ?? 1980
  const end = endYear ?? currentYear + 1

  const years: number[] = []
  for (let year = end; year >= start; year--) {
    years.push(year)
  }
  return years
}
