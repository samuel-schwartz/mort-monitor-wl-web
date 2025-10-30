import { DollarSign, Clock, TrendingDown, Home, Calendar, PiggyBank } from "lucide-react"

export type TemplateKind =
  | "monthly-savings"
  | "break-even"
  | "pmi-removal"
  | "rate-improvement"
  | "break-even-date"
  | "interest-savings"

export type AlertInputs =
  | { kind: "monthly-savings"; amount: number }
  | { kind: "break-even"; months: number }
  | { kind: "pmi-removal"; ltv: number }
  | { kind: "rate-improvement"; improvement: number }
  | { kind: "break-even-date"; byDate: string }
  | { kind: "interest-savings"; lifetimeSavings: number }

export type TemplateInputs = Partial<{
  amount: number
  months: number
  ltv: number
  improvement: number
  byDate: string
  lifetimeSavings: number
}>

export type AlertTemplate = {
  id: TemplateKind
  name: string
  description: string
  icon: any
  defaultInputs: Omit<AlertInputs, "kind">
}

export type CreatedAlarm = {
  id: string
  apiId?: string
  templateId: TemplateKind
  templateName: string
  icon: any
  inputs: AlertInputs
  loanTerm?: number
  createdAt: number
  snoozed?: boolean
  snoozeUntil?: number | null
  sounding?: boolean
}

export const LOAN_TERMS = [30, 15] as const
export type LoanTerm = (typeof LOAN_TERMS)[number]

export const PRIMARY_TERMS = [30, 15] as const
export const EXTRA_TERMS = [20, 10, 7, 5] as const

export type AlertConfig = {
  templateId: TemplateKind
  inputs: TemplateInputs
  loanTerms: number[]
}

export function defaultTemplates(): AlertTemplate[] {
  return [
    {
      id: "monthly-savings",
      name: "Monthly Payment Savings",
      description: "Alert me when I can save at least $X per month.",
      icon: DollarSign,
      defaultInputs: { amount: 150 },
    },
    {
      id: "break-even",
      name: "Break-Even by Months",
      description: "Alert me when I break even within M months.",
      icon: Clock,
      defaultInputs: { months: 24 },
    },
    {
      id: "pmi-removal",
      name: "PMI Removal",
      description: "Alert me when LTV reaches X%, so PMI can be removed.",
      icon: Home,
      defaultInputs: { ltv: 20 },
    },
    {
      id: "rate-improvement",
      name: "Better Rate than My Current Loan",
      description: "Alert me when the 15 or 30 year fixed-rate is at least X% lower than my current rate.",
      icon: TrendingDown,
      defaultInputs: { improvement: 0.5 },
    },
    {
      id: "break-even-date",
      name: "Break-Even by Date",
      description: "Alert me if I can break even on refinance costs on or before this date.",
      icon: Calendar,
      defaultInputs: { byDate: new Date().toISOString().slice(0, 10) },
    },
    {
      id: "interest-savings",
      name: "Total Lifetime Interest Savings",
      description: "Alert me when total lifetime interest savings would be at least $X.",
      icon: PiggyBank,
      defaultInputs: { lifetimeSavings: 2500 },
    },
  ]
}

export function summarizeInputs(inputs: AlertInputs): string {
  switch (inputs.kind) {
    case "monthly-savings":
      return `$${inputs.amount}+ / mo`
    case "break-even":
      return `${inputs.months} mo`
    case "rate-improvement":
      return `${inputs.improvement}% better`
    case "pmi-removal":
      return `LTV ≤ ${inputs.ltv}%`
    case "break-even-date":
      return `By ${inputs.byDate}`
    case "interest-savings":
      return `$${inputs.lifetimeSavings}+ lifetime`
  }
}
