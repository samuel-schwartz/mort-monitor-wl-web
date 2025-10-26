"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PropertyDetails } from "@/app/onboard/_components/property-details"
import { AlertSelection } from "@/app/onboard/_components/alert-selection"
import { useToast } from "@/hooks/use-toast"
import { createProperty } from "@/app/actions/properties"
import { createAlert } from "@/app/actions/alerts"
import type { AlertConfig } from "@/types/alerts"
import type { Client } from "@/types/models"

export function AddPropertyForClientForm({ client }: { client: Client }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Property/Loan Details
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
  const [creditScore, setCreditScore] = useState(client.creditScore || "")

  // Alerts
  const [selectedAlerts, setSelectedAlerts] = useState<AlertConfig[]>([])

  const handleFinalSubmit = async () => {
    setIsSubmitting(true)

    try {
      toast({
        title: "Adding property...",
        description: "Please wait while we set up the property for your client.",
      })

      const fullAddress = `${propertyAddress}, ${propertyCity}, ${propertyState} ${propertyZip}`

      const property = await createProperty({
        userId: client.id,
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
          userId: client.id,
          propertyId: property.propertyId!,
          ...alertConfig,
        })
      }

      toast({
        title: "Property added successfully",
        description: `Property and alerts have been set up for ${client.firstName}.`,
      })

      router.push(`/broker/clients/${client.id}`)
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
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">Step {currentStep} of 2</div>

      {currentStep === 1 && (
        <PropertyDetails
          firstName={client.firstName}
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
          onBack={() => router.back()}
          showCreditScore={false}
        />
      )}

      {currentStep === 2 && (
        <AlertSelection
          firstName={client.firstName}
          selectedAlerts={selectedAlerts}
          onAlertsChange={setSelectedAlerts}
          onNext={handleFinalSubmit}
          onBack={() => setCurrentStep(1)}
        />
      )}
    </div>
  )
}
