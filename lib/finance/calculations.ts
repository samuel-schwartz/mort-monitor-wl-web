/**
 * Financial calculation utilities for mortgage and loan operations
 * Consolidated from lib/finance-utils.ts and lib/utils/mortgage-calculations.ts
 */

/**
 * Convert any value to a number, stripping out non-numeric characters
 * Handles strings with currency symbols, commas, and other formatting
 *
 * @param value - Value to convert (string, number, or any)
 * @returns Parsed number, or 0 if parsing fails
 *
 * @example
 * \`\`\`ts
 * toNumber("$1,234.56") // 1234.56
 * toNumber("6.25%") // 6.25
 * toNumber(1234) // 1234
 * \`\`\`
 */
export function toNumber(value: unknown): number {
  const n = typeof value === "number" ? value : Number.parseFloat(String(value).replace(/[^0-9.-]/g, ""))
  return Number.isFinite(n) ? n : 0
}

/**
 * Calculate monthly principal and interest payment for a loan
 * Uses the standard amortization formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 *
 * @param principal - Loan principal amount
 * @param annualRatePct - Annual interest rate as percentage (e.g., 6.25 for 6.25%)
 * @param termYears - Loan term in years
 * @returns Monthly payment amount (principal + interest only)
 *
 * @example
 * \`\`\`ts
 * monthlyPaymentPAndI(300000, 6.25, 30) // ~1847.15
 * \`\`\`
 */
export function monthlyPaymentPAndI(principal: number, annualRatePct: number, termYears: number): number {
  const P = toNumber(principal)
  const y = Math.max(toNumber(termYears), 0.0001) // Avoid division by zero
  const r = toNumber(annualRatePct) / 100 / 12 // Monthly interest rate
  const n = Math.round(y * 12) // Total number of payments

  if (P <= 0 || n <= 0) return 0
  if (r === 0) return P / n // No interest case

  const f = Math.pow(1 + r, n)
  return (P * r * f) / (f - 1)
}

/**
 * Alias for monthlyPaymentPAndI for backwards compatibility
 */
export const calculateMonthlyPayment = monthlyPaymentPAndI

/**
 * Calculate remaining months to pay off a loan given current balance and payment
 *
 * @param balance - Current loan balance
 * @param annualRatePct - Annual interest rate as percentage
 * @param payment - Monthly payment amount
 * @returns Number of months remaining, or Infinity if payment is too low
 *
 * @example
 * \`\`\`ts
 * remainingMonths(285500, 6.25, 1847) // ~285 months
 * \`\`\`
 */
export function remainingMonths(balance: number, annualRatePct: number, payment: number): number {
  const B = toNumber(balance)
  const r = toNumber(annualRatePct) / 100 / 12
  const Pmt = toNumber(payment)

  if (B <= 0 || Pmt <= 0) return 0
  if (r === 0) return Math.ceil(B / Pmt)

  const inside = 1 - (r * B) / Pmt
  if (inside <= 0) return Number.POSITIVE_INFINITY // Payment too low to amortize

  return Math.ceil(-Math.log(inside) / Math.log(1 + r))
}

/**
 * Add months to a date
 *
 * @param date - Starting date
 * @param months - Number of months to add
 * @returns New date with months added
 */
export function addMonths(date: Date, months: number): Date {
  const d = new Date(date)
  d.setMonth(d.getMonth() + months)
  return d
}

/**
 * Convert date to ISO date string in local timezone (YYYY-MM-DD)
 *
 * @param date - Date to convert
 * @returns ISO date string
 */
export function toISODateLocal(date: Date): string {
  const pad = (x: number) => String(x).padStart(2, "0")
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/**
 * Calculate total interest paid over a given number of months
 *
 * @param principal - Loan principal amount
 * @param annualRatePct - Annual interest rate as percentage
 * @param months - Number of months to calculate interest for
 * @returns Total interest paid over the period
 *
 * @example
 * \`\`\`ts
 * totalInterestOverMonths(300000, 6.25, 360) // ~364,813
 * \`\`\`
 */
export function totalInterestOverMonths(principal: number, annualRatePct: number, months: number): number {
  const P = toNumber(principal)
  const n = toNumber(months)
  const payment = monthlyPaymentPAndI(P, annualRatePct, n / 12)

  if (payment === 0 || n === 0) return 0

  const totalPaid = payment * n
  return totalPaid - P
}

/**
 * Alias for totalInterestOverMonths for backwards compatibility
 */
export function calculateTotalInterest(principal: number, annualRate: number, termYears: number): number {
  return totalInterestOverMonths(principal, annualRate, termYears * 12)
}

/**
 * Calculate break-even point in months for refinancing
 * Compares current loan vs new loan with closing costs
 *
 * @param currentRate - Current annual interest rate as percentage
 * @param newRate - New annual interest rate as percentage
 * @param loanBalance - Current loan balance
 * @param closingCosts - Closing costs for refinancing
 * @returns Number of months to break even, or Infinity if refinancing doesn't save money
 *
 * @example
 * \`\`\`ts
 * breakEvenMonths(6.5, 6.0, 300000, 5000) // ~42 months
 * \`\`\`
 */
export function breakEvenMonths(
  currentRate: number,
  newRate: number,
  loanBalance: number,
  closingCosts: number,
): number {
  const currentPayment = monthlyPaymentPAndI(loanBalance, currentRate, 30)
  const newPayment = monthlyPaymentPAndI(loanBalance, newRate, 30)

  const monthlySavings = currentPayment - newPayment

  if (monthlySavings <= 0) {
    return Number.POSITIVE_INFINITY
  }

  return Math.ceil(closingCosts / monthlySavings)
}

/**
 * Alias for breakEvenMonths for backwards compatibility
 */
export function calculateBreakEvenMonths(closingCosts: number, monthlySavings: number): number {
  if (monthlySavings <= 0) return Number.POSITIVE_INFINITY
  return closingCosts / monthlySavings
}

/**
 * Calculate loan-to-value ratio
 * @param loanBalance - Current loan balance
 * @param propertyValue - Current property value
 * @returns LTV as a percentage
 */
export function calculateLTV(loanBalance: number, propertyValue: number): number {
  if (propertyValue === 0) return 0
  return (loanBalance / propertyValue) * 100
}

/**
 * Calculate remaining balance after a certain number of payments
 * @param principal - Original loan amount
 * @param annualRate - Annual interest rate as a percentage
 * @param termYears - Loan term in years
 * @param paymentsMade - Number of payments already made
 * @returns Remaining balance
 */
export function calculateRemainingBalance(
  principal: number,
  annualRate: number,
  termYears: number,
  paymentsMade: number,
): number {
  if (annualRate === 0) {
    const totalPayments = termYears * 12
    return principal * (1 - paymentsMade / totalPayments)
  }

  const monthlyRate = annualRate / 100 / 12
  const numPayments = termYears * 12

  const remainingBalance =
    (principal * (Math.pow(1 + monthlyRate, numPayments) - Math.pow(1 + monthlyRate, paymentsMade))) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)

  return remainingBalance
}
