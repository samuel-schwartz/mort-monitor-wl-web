"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Clock, TrendingDown, Home, Calendar, PiggyBank, Check } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import type { AlertConfig, TemplateKind } from "@/types/alerts"
import { AlertInputFields } from "@/components/shared/alert-input-fields"
import { LoanTermSelector } from "@/components/shared/loan-term-selector"
import { useState, useEffect, useRef } from "react"

interface AlertSelectionProps {
  mode: "create" | "review"
  firstName: string
  selectedAlerts: AlertConfig[]
  propertyPrice?: string
  currentBalance?: string
  startMonth?: string
  startYear?: string
  termLength?: string
  onAlertsChange: (alerts: AlertConfig[]) => void
  onNext: () => void
  onBack?: () => void
  isLoading?: boolean
}

export default function AlertSelection({
  mode,
  firstName,
  selectedAlerts,
  propertyPrice,
  currentBalance,
  startMonth,
  startYear,
  termLength,
  onAlertsChange,
  onNext,
  onBack,
  isLoading = false,
}: AlertSelectionProps) {
  const calculateLTV = (): number | null => {
    if (!propertyPrice || !currentBalance) return null

    const price = Number.parseFloat(propertyPrice.replace(/[^0-9.]/g, ""))
    const balance = Number.parseFloat(currentBalance.replace(/[^0-9.]/g, ""))

    if (price === 0 || isNaN(price) || isNaN(balance)) return null

    return (balance / price) * 100
  }

  const currentLTV = calculateLTV()
  const shouldShowPMI = currentLTV === null || currentLTV > 80

  const alerts: (AlertTemplate & { isRecommended?: boolean })[] = [
    {
      id: "monthly-savings",
      name: "Monthly Payment Savings",
      description: "Alert me when I can save at least $X per month.",
      icon: DollarSign,
      defaultInputs: { amount: 150 },
      isRecommended: true,
    },
    {
      id: "break-even",
      name: "Break-Even by Months",
      description: "Alert me when I could break even within M months by refinancing today.",
      icon: Clock,
      defaultInputs: { months: 24 },
      isRecommended: true,
    },
    ...(shouldShowPMI
      ? [
          {
            id: "pmi-removal" as TemplateKind,
            name: "PMI Removal",
            description: "Alert me when LTV reaches 80%, so PMI can be removed.",
            icon: Home,
            defaultInputs: { ltv: 80 },
            noTermSelection: true,
            isRecommended: true,
          },
        ]
      : []),
    {
      id: "rate-improvement",
      name: "Better Rate than My Current Loan",
      description: "Alert me when the 15 or 30 year fixed-rate is at least X% lower than my current rate.",
      icon: TrendingDown,
      defaultInputs: { improvement: 1 },
      isRecommended: true,
    },
    {
      id: "break-even-date",
      name: "Break-Even by Date",
      description: "Alert me if I can break even on refinance costs on or before DD/MM/YYYY.",
      icon: Calendar,
      defaultInputs: { byDate: new Date().toISOString().slice(0, 10) },
    },
    {
      id: "interest-savings",
      name: "Total Lifetime Interest Savings",
      description: "Alert me when total lifetime interest savings would be at least $X.",
      icon: PiggyBank,
      defaultInputs: { lifetimeSavings: 5000 },
    },
  ]

  useEffect(() => {
    if (selectedAlerts.length === 0) {
      const recommendedAlerts = alerts
        .filter((alert) => alert.isRecommended)
        .map((alert) => ({
          templateId: alert.id,
          inputs: alert.defaultInputs,
          loanTerms: alert.noTermSelection ? [] : [30, 15],
        }))

      if (recommendedAlerts.length > 0) {
        onAlertsChange(recommendedAlerts)
      }
    }
  }, [])

  const [showFixedButtons, setShowFixedButtons] = useState(false)
  const staticButtonsRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardWidth, setCardWidth] = useState<number | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (staticButtonsRef.current) {
        const rect = staticButtonsRef.current.getBoundingClientRect()
        setShowFixedButtons(rect.top > window.innerHeight)
      }
    }

    const handleResize = () => {
      if (cardRef.current) {
        setCardWidth(cardRef.current.offsetWidth)
      }
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)
    handleScroll()
    handleResize()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const isAlertSelected = (alertId: string) => {
    return selectedAlerts.some((a) => a.templateId === alertId)
  }

  const getAlertConfig = (alertId: string): AlertConfig | undefined => {
    return selectedAlerts.find((a) => a.templateId === alertId)
  }

  const toggleAlert = (alertId: string) => {
    if (isAlertSelected(alertId)) {
      onAlertsChange(selectedAlerts.filter((a) => a.templateId !== alertId))
    } else {
      const alert = alerts.find((t) => t.id === alertId)
      if (alert) {
        onAlertsChange([
          ...selectedAlerts,
          {
            templateId: alertId as TemplateKind,
            inputs: alert.defaultInputs,
            loanTerms: alert.noTermSelection ? [] : [30, 15],
          },
        ])
      }
    }
  }

  const updateAlertInput = (alertId: string, key: string, value: any) => {
    onAlertsChange(
      selectedAlerts.map((alert) =>
        alert.templateId === alertId ? { ...alert, inputs: { ...alert.inputs, [key]: value } } : alert,
      ),
    )
  }

  const updateAlertLoanTerms = (alertId: string, terms: number[]) => {
    onAlertsChange(
      selectedAlerts.map((alert) => (alert.templateId === alertId ? { ...alert, loanTerms: terms } : alert)),
    )
  }

  const handleSubmit = () => {
    if (selectedAlerts.length > 0) {
      onNext()
    }
  }

  type AlertTemplate = {
    id: TemplateKind
    name: string
    description: string
    icon: any
    defaultInputs: any
    noTermSelection?: boolean
  }

  return (
    <Card ref={cardRef} className="w-full max-w-3xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl sm:text-2xl">
          {mode === "create" ? "Choose your alerts and start saving" : "Review Your Alert Preferences"}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {mode === "create"
            ? `Track rate changes that could save you hundreds per month, ${firstName}`
            : `Your broker has configured these alerts for you. Review and adjust as needed, ${firstName}`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => {
            const Icon = alert.icon
            const isSelected = isAlertSelected(alert.id)
            const config = getAlertConfig(alert.id)

            return (
              <div
                key={alert.id}
                onClick={() => toggleAlert(alert.id)}
                className={`border-2 rounded-lg p-4 sm:p-5 transition-all cursor-pointer min-h-[80px] ${
                  isSelected ? "border-primary shadow-md" : "border-border hover:border-primary/50 hover:shadow-sm"
                }`}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div
                    className={`flex-shrink-0 w-7 h-7 sm:w-6 sm:h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                      isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                    }`}
                  >
                    {isSelected && <Check className="h-5 w-5 sm:h-4 sm:w-4 text-primary-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <Icon
                        className={`h-5 w-5 flex-shrink-0 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                      />
                      <h3 className="font-semibold text-sm sm:text-base leading-tight">{alert.name}</h3>
                      {alert.isRecommended && (
                        <Badge
                          variant="secondary"
                          className="text-xs px-2 py-0.5 bg-primary/10 text-primary border-primary/20"
                        >
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 leading-relaxed">{alert.description}</p>
                  </div>
                </div>

                {isSelected && config && (
                  <div
                    className="mt-4 sm:mt-5 pl-0 sm:pl-10 space-y-4 bg-background/50 p-3 sm:p-4 rounded-md border border-border/50"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <AlertInputFields
                      templateId={alert.id}
                      inputs={config.inputs}
                      onInputChange={(key, value) => updateAlertInput(alert.id, key, value)}
                    />

                    {!alert.noTermSelection && (
                      <>
                        <Separator />
                        <LoanTermSelector
                          selectedTerms={config.loanTerms}
                          onTermsChange={(terms) => updateAlertLoanTerms(alert.id, terms)}
                        />
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div ref={staticButtonsRef} className="flex gap-3 mt-6">
          {onBack && (
            <Button
              type="button"
              variant="outline"
              onClick={onBack}
              className="flex-1 h-10 bg-transparent"
              disabled={isLoading}
            >
              Back
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            className={`${onBack ? "flex-1" : "w-full"} h-10`}
            disabled={selectedAlerts.length === 0 || isLoading}
          >
            {isLoading ? "Saving..." : mode === "create" ? "Continue" : "Complete Onboarding"}
          </Button>
        </div>
      </CardContent>

      {/* Sticky Footer Buttons */}
      {showFixedButtons && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t shadow-lg p-4 z-50">
          <div className="w-full max-w-3xl mx-auto" style={cardWidth ? { width: `${cardWidth}px` } : undefined}>
            <div className="flex gap-3">
              {onBack && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onBack}
                  className="flex-1 h-10 bg-transparent"
                  disabled={isLoading}
                >
                  Back
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                className={`${onBack ? "flex-1" : "w-full"} h-10`}
                disabled={selectedAlerts.length === 0 || isLoading}
              >
                {isLoading ? "Saving..." : mode === "create" ? "Continue" : "Complete Onboarding"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
