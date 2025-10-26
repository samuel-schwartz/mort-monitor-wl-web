"use client"

// TODO: Fix Alert Config Import Issue
// TODO: Remove Hardcoded Mock Data

import { useState } from "react"
import { useRouter } from "next/navigation"
import { TrendingDown, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PropertyDetails } from "@/app/onboard/_components/property-details"
import { AlertSelection } from "@/app/onboard/_components/alert-selection"
import { useToast } from "@/hooks/use-toast"
import { createProperty } from "@/app/actions/properties"
import { createAlert } from "@/app/actions/alerts"
import type { AlertConfig } from "@/types/alerts"

export default function AddPropertyPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Mock user data - in production, fetch from auth context
  const firstName = "John"
  const userId = "user_123"

  // Step 1 (Property/Loan Details)
  const [propertyAddress, setPropertyAddress] = useState("")
  const [propertyCity, setPropertyCity] = useState("")
  const [propertyState, setPropertyState] = useState("")
  const [propertyZip, setPropertyZip] = useState("")
  const [propertyPrice, setPropertyPrice] = useState("")
  const [originalLoanAmount, setOriginalLoanAmount] = useState("")
  const [currentBalance, setCurrentBalance] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [termLength, setTermLength] = useState("")
  const [startMonth, setStartMonth] = useState("")
  const [startYear, setStartYear] = useState("")
  const [monthlyPayment, setMonthlyPayment] = useState("")
  const [creditScore, setCreditScore] = useState("")

  // Step 2 (Alerts)
  const [selectedAlerts, setSelectedAlerts] = useState<AlertConfig[]>([])

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)

    try {
      toast({
        title: "Adding property...",
        description: "Please wait while we set up your new property.",
      })

      const fullAddress = `${propertyAddress}, ${propertyCity}, ${propertyState} ${propertyZip}`

      const property = await createProperty({
        userId,
        address: fullAddress,
        propertyPrice: Number.parseFloat(propertyPrice.replace(/[^0-9.]/g, "")),
        originalLoanAmount: Number.parseFloat(originalLoanAmount.replace(/[^0-9.]/g, "") || "0"),
        currentBalance: Number.parseFloat(currentBalance.replace(/[^0-9.]/g, "")),
        interestRate: Number.parseFloat(interestRate),
        termLength: Number.parseInt(termLength || "30"),
        startMonth: Number.parseInt(startMonth),
        startYear: Number.parseInt(startYear),
        monthlyPayment: Number.parseFloat(monthlyPayment.replace(/[^0-9.]/g, "")),
      })

      if (!property.success) {
        toast({
          variant: "destructive",
          title: "Failed to add property",
          description: property.error || "Please try again.",
        })
        setIsSubmitting(false)
        return
      }

      for (const alertConfig of selectedAlerts) {
        await createAlert({
          userId,
          propertyId: property.propertyId!,
          ...alertConfig,
        })
      }

      toast({
        title: "Property added successfully",
        description: "Your new property and alerts have been set up.",
      })

      router.push("/dash")
    } catch (error) {
      console.error("[v0] Error adding property:", error)
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Failed to add property. Please try again.",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dash")} aria-label="Back to dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">Add Loan/Property</h1>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">Step {currentStep} of 2</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 sm:py-12">
        {currentStep === 1 && (
          <PropertyDetails
            firstName={firstName}
            propertyAddress={propertyAddress}
            propertyCity={propertyCity}
            propertyState={propertyState}
            propertyZip={propertyZip}
            propertyPrice={propertyPrice}
            originalLoanAmount={originalLoanAmount}
            currentBalance={currentBalance}
            interestRate={interestRate}
            termLength={termLength}
            startMonth={startMonth}
            startYear={startYear}
            monthlyPayment={monthlyPayment}
            creditScore={creditScore}
            onPropertyAddressChange={setPropertyAddress}
            onPropertyCityChange={setPropertyCity}
            onPropertyStateChange={setPropertyState}
            onPropertyZipChange={setPropertyZip}
            onPropertyPriceChange={setPropertyPrice}
            onOriginalLoanAmountChange={setOriginalLoanAmount}
            onCurrentBalanceChange={setCurrentBalance}
            onInterestRateChange={setInterestRate}
            onTermLengthChange={setTermLength}
            onStartMonthChange={setStartMonth}
            onStartYearChange={setStartYear}
            onMonthlyPaymentChange={setMonthlyPayment}
            onCreditScoreChange={setCreditScore}
            onNext={() => setCurrentStep(2)}
            onBack={() => router.push("/dash")}
            showCreditScore={false}
          />
        )}

        {currentStep === 2 && (
          <AlertSelection
            firstName={firstName}
            selectedAlerts={selectedAlerts}
            onAlertsChange={setSelectedAlerts}
            onNext={handleFinalSubmit}
            onBack={() => setCurrentStep(1)}
          />
        )}
      </main>
    </div>
  )
}
