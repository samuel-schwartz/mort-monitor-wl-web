"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { AlertInputs, TemplateKind } from "@/types/alerts"

interface AlertInputFieldsProps {
  templateId: TemplateKind
  inputs: Partial<AlertInputs>
  onInputChange: (key: string, value: string | number) => void
  idPrefix?: string
}

export function AlertInputFields({ templateId, inputs, onInputChange, idPrefix = "" }: AlertInputFieldsProps) {
  const id = (suffix: string) => (idPrefix ? `${idPrefix}-${suffix}` : suffix)

  switch (templateId) {
    case "monthly-savings":
      return (
        <div className="space-y-2">
          <Label htmlFor={id("amount")} className="text-sm font-medium">
            Minimum monthly savings
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">$</span>
            <Input
              id={id("amount")}
              type="number"
              className="w-32 h-11 sm:h-10"
              value={(inputs as { amount?: number }).amount ?? 150}
              onChange={(e) => onInputChange("amount", Number.parseInt(e.target.value || "0") || 100)}
              step={25}
              min={25}
            />
            <span className="text-xs sm:text-sm text-muted-foreground">per month</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Example: $150 means you'll be alerted when refinancing saves you at least $150/month
          </p>
        </div>
      )

    case "break-even":
      return (
        <div className="space-y-2">
          <Label htmlFor={id("months")} className="text-sm font-medium">
            Maximum break-even period
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={id("months")}
              type="number"
              className="w-32 h-11 sm:h-10"
              value={(inputs as { months?: number }).months ?? 24}
              onChange={(e) => onInputChange("months", Number.parseInt(e.target.value || "0") || 24)}
              step={3}
              min={3}
            />
            <span className="text-xs sm:text-sm text-muted-foreground">months</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Example: 24 months means you'll recoup closing costs within 2 years
          </p>
        </div>
      )

    case "pmi-removal":
      return (
        <div className="space-y-2">
          <Label htmlFor={id("ltv")} className="text-sm font-medium">
            Loan-to-Value (LTV) threshold
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={id("ltv")}
              type="number"
              className="w-32 h-11 sm:h-10"
              value={(inputs as { ltv?: number }).ltv ?? 20}
              onChange={(e) => onInputChange("ltv", Number.parseInt(e.target.value || "0") || 20)}
            />
            <span className="text-xs sm:text-sm text-muted-foreground">%</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Typically 20% equity (80% LTV) is required to remove PMI
          </p>
        </div>
      )

    case "rate-improvement":
      return (
        <div className="space-y-2">
          <Label htmlFor={id("improvement")} className="text-sm font-medium">
            Minimum rate improvement
          </Label>
          <div className="flex items-center gap-2">
            <Input
              id={id("improvement")}
              type="number"
              className="w-32 h-11 sm:h-10"
              value={(inputs as { improvement?: number }).improvement ?? 0.5}
              onChange={(e) => onInputChange("improvement", Number.parseFloat(e.target.value) || 0.5)}
              step={0.25}
              min={0.25}
            />
            <span className="text-xs sm:text-sm text-muted-foreground">% lower</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Example: 0.5% means alert when rates are at least 0.5% below your current rate
          </p>
        </div>
      )

    case "break-even-date":
      return (
        <div className="space-y-2">
          <Label htmlFor={id("byDate")} className="text-sm font-medium">
            Target break-even date
          </Label>
          <Input
            id={id("byDate")}
            type="date"
            className="h-11 sm:h-10 max-w-xs"
            value={(inputs as { byDate?: string }).byDate ?? new Date().toISOString().slice(0, 10)}
            onChange={(e) => onInputChange("byDate", e.target.value)}
          />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Alert when you can recoup closing costs by this date
          </p>
        </div>
      )

    case "interest-savings":
      return (
        <div className="space-y-2">
          <Label htmlFor={id("lifetimeSavings")} className="text-sm font-medium">
            Minimum lifetime interest savings
          </Label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">$</span>
            <Input
              id={id("lifetimeSavings")}
              type="number"
              className="w-32 h-11 sm:h-10"
              value={(inputs as { lifetimeSavings?: number }).lifetimeSavings ?? 2500}
              onChange={(e) => onInputChange("lifetimeSavings", Number.parseInt(e.target.value || "0") || 2500)}
              step={500}
              min={1000}
            />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Total interest saved over the life of the loan
          </p>
        </div>
      )

    default:
      return null
  }
}
