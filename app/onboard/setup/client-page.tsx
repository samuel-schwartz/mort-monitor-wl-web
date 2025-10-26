"use client"

import { useReducer, useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { TrendingDown } from "lucide-react"
import { PropertyDetails } from "../_components/property-details"
import { AlertSelection } from "../_components/alert-selection"
import { onboardingReducer, initialOnboardingState } from "../types"
import { createProperty } from "@/app/_actions/properties"
import { createAlert } from "@/app/_actions/alerts"
import { Spinner } from "@/components/ui/spinner"

export default function OnboardingSetupClientPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [state, dispatch] = useReducer(onboardingReducer, {
    ...initialOnboardingState,
    currentStep: 2,
    firstName: searchParams.get("firstName") || "",
    lastName: searchParams.get("lastName") || "",
    email: searchParams.get("email") || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const userId = searchParams.get("userId")

  useEffect(() => {
    if (!userId) {
      router.push("/onboard")
      return
    }
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [state.currentStep, userId, router])

  const handleFinalSubmit = async () => {
    if (!userId) {
      console.error("[v0] No userId found")
      return
    }

    setIsSubmitting(true)

    try {
      const fullAddress = `${state.propertyAddress}, ${state.propertyCity}, ${state.propertyState} ${state.propertyZip}`

      let cleanedCreditScore: string | undefined = undefined
      if (state.creditScore && state.creditScore.trim() !== "") {
        const numericOnly = state.creditScore.replace(/\D/g, "")
        if (numericOnly.length === 3) {
          cleanedCreditScore = numericOnly
        }
      }

      const propertyData = {
        userId: userId,
        address: fullAddress,
        propertyPrice: Number.parseFloat(state.propertyPrice.replace(/[^0-9.]/g, "")),
        originalLoanAmount: Number.parseFloat(state.originalLoanAmount.replace(/[^0-9.]/g, "") || "0"),
        currentBalance: Number.parseFloat(state.currentBalance.replace(/[^0-9.]/g, "")),
        interestRate: Number.parseFloat(state.interestRate),
        termLength: Number.parseInt(state.termLength || "30"),
        startMonth: Number.parseInt(state.startMonth),
        startYear: Number.parseInt(state.startYear),
        monthlyPayment: Number.parseFloat(state.monthlyPayment.replace(/[^0-9.]/g, "")),
        creditScore: cleanedCreditScore,
      }

      console.log("[v0] Creating property with data:", propertyData)

      const property = await createProperty(propertyData)

      if (!property.success) {
        console.error("[v0] Property creation failed:", property.error)
        setIsSubmitting(false)
        return
      }

      for (const alertConfig of state.selectedAlerts) {
        await createAlert({
          userId: userId,
          propertyId: property.propertyId!,
          ...alertConfig,
        })
      }

      router.push("/dash/welcome?firstName=" + encodeURIComponent(state.firstName))
    } catch (error) {
      console.error("[v0] Onboarding submission failed:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
            <Spinner className="h-12 w-12" />
            <p className="text-lg font-semibold">Setting up your account...</p>
            <p className="text-sm text-muted-foreground">This will only take a moment</p>
          </div>
        </div>
      )}

      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">RefinanceAlert</h1>
          </div>
          <div className="text-sm text-muted-foreground">Step {state.currentStep - 1} of 2</div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-12">
        {state.currentStep === 2 && (
          <PropertyDetails
            firstName={state.firstName}
            propertyAddress={state.propertyAddress}
            propertyCity={state.propertyCity}
            propertyState={state.propertyState}
            propertyZip={state.propertyZip}
            propertyPrice={state.propertyPrice}
            originalLoanAmount={state.originalLoanAmount}
            currentBalance={state.currentBalance}
            interestRate={state.interestRate}
            termLength={state.termLength}
            startMonth={state.startMonth}
            startYear={state.startYear}
            monthlyPayment={state.monthlyPayment}
            creditScore={state.creditScore}
            onPropertyAddressChange={(value) => dispatch({ type: "SET_FIELD", field: "propertyAddress", value })}
            onPropertyCityChange={(value) => dispatch({ type: "SET_FIELD", field: "propertyCity", value })}
            onPropertyStateChange={(value) => dispatch({ type: "SET_FIELD", field: "propertyState", value })}
            onPropertyZipChange={(value) => dispatch({ type: "SET_FIELD", field: "propertyZip", value })}
            onPropertyPriceChange={(value) => dispatch({ type: "SET_FIELD", field: "propertyPrice", value })}
            onOriginalLoanAmountChange={(value) => dispatch({ type: "SET_FIELD", field: "originalLoanAmount", value })}
            onCurrentBalanceChange={(value) => dispatch({ type: "SET_FIELD", field: "currentBalance", value })}
            onInterestRateChange={(value) => dispatch({ type: "SET_FIELD", field: "interestRate", value })}
            onTermLengthChange={(value) => dispatch({ type: "SET_FIELD", field: "termLength", value })}
            onStartMonthChange={(value) => dispatch({ type: "SET_FIELD", field: "startMonth", value })}
            onStartYearChange={(value) => dispatch({ type: "SET_FIELD", field: "startYear", value })}
            onMonthlyPaymentChange={(value) => dispatch({ type: "SET_FIELD", field: "monthlyPayment", value })}
            onCreditScoreChange={(value) => dispatch({ type: "SET_FIELD", field: "creditScore", value })}
            onNext={() => dispatch({ type: "SET_STEP", step: 3 })}
            onBack={() => router.push("/onboard")}
          />
        )}

        {state.currentStep === 3 && (
          <AlertSelection
            firstName={state.firstName}
            selectedAlerts={state.selectedAlerts}
            propertyPrice={state.propertyPrice}
            currentBalance={state.currentBalance}
            startMonth={state.startMonth}
            startYear={state.startYear}
            termLength={state.termLength}
            onAlertsChange={(alerts) => dispatch({ type: "SET_ALERTS", alerts })}
            onNext={handleFinalSubmit}
            onBack={() => dispatch({ type: "SET_STEP", step: 2 })}
          />
        )}
      </main>
    </div>
  )
}
