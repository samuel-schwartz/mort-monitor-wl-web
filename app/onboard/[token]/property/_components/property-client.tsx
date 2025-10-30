"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import PropertyForm from "@/components/onboard/property-form"
import { updateProperty } from "@/app/_actions/properties"
import { toast } from "sonner"
import type { Client } from "@/types/models"

interface PropertyClientProps {
  token: string
  clientData: Client
}

export default function PropertyClient({ token, clientData }: PropertyClientProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [formData, setFormData] = useState({
    propertyAddress: clientData.property?.address?.split(",")[0] || "1348 Armstrong Pl",
    propertyCity: clientData.property?.city || "Eau Claire",
    propertyState: clientData.property?.state || "WI",
    propertyZip: clientData.property?.zipCode || "54701",
    propertyPrice: clientData.property?.purchasePrice?.toString() || "750000",
    originalLoanAmount: clientData.property?.originalLoanAmount?.toString() || "600000",
    currentBalance: clientData.property?.currentBalance?.toString() || "550000",
    interestRate: clientData.property?.interestRate?.toString() || "6.5",
    termLength: clientData.property?.termLength?.toString() || "30",
    startMonth: clientData.property?.loanStartMonth?.toString() || "1",
    startYear: clientData.property?.loanStartYear?.toString() || "2020",
    monthlyPayment: clientData.property?.monthlyPayment?.toString() || "3795",
    creditScore: clientData.creditScore || "700-749",
  })

  const handleContinue = async () => {
    console.log("[v0] PropertyClient handleContinue called")
    console.log("[v0] PropertyClient token:", token)
    console.log("[v0] PropertyClient propertyId:", clientData.property?.id)

    setIsLoading(true)

    try {
      console.log("[v0] PropertyClient calling updateProperty")

      const startMonth = Number.parseInt(formData.startMonth)
      const startYear = Number.parseInt(formData.startYear)

      // Validate that month and year are valid numbers
      if (Number.isNaN(startMonth) || Number.isNaN(startYear)) {
        toast.error("Please enter a valid first payment date")
        setIsLoading(false)
        return
      }

      // Update property with any changes
      const result = await updateProperty(clientData.property?.id || "", {
        address: `${formData.propertyAddress}, ${formData.propertyCity}, ${formData.propertyState} ${formData.propertyZip}`,
        propertyPrice: Number.parseFloat(formData.propertyPrice.replace(/[^0-9.]/g, "")),
        originalLoanAmount: Number.parseFloat(formData.originalLoanAmount.replace(/[^0-9.]/g, "") || "0"),
        currentBalance: Number.parseFloat(formData.currentBalance.replace(/[^0-9.]/g, "")),
        interestRate: Number.parseFloat(formData.interestRate),
        termLength: Number.parseInt(formData.termLength || "30"),
        startMonth, // Now properly validated as number
        startYear, // Now properly validated as number
        monthlyPayment: Number.parseFloat(formData.monthlyPayment.replace(/[^0-9.]/g, "")),
        creditScore: formData.creditScore, // Keep as string enum, don't convert to number
      })

      console.log("[v0] PropertyClient updateProperty result:", result)

      if (result.success) {
        toast.success("Property details saved")
        console.log("[v0] PropertyClient navigating to alerts")
        router.push(`/onboard/${token}/alerts`)
      } else {
        console.log("[v0] PropertyClient update failed:", result.error)
        toast.error(result.error || "Failed to save property details")
      }
    } catch (error) {
      console.log("[v0] PropertyClient error:", error)
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <PropertyForm
        mode="review"
        firstName={clientData.firstName}
        propertyAddress={formData.propertyAddress}
        propertyCity={formData.propertyCity}
        propertyState={formData.propertyState}
        propertyZip={formData.propertyZip}
        propertyPrice={formData.propertyPrice}
        originalLoanAmount={formData.originalLoanAmount}
        currentBalance={formData.currentBalance}
        interestRate={formData.interestRate}
        termLength={formData.termLength}
        startMonth={formData.startMonth}
        startYear={formData.startYear}
        monthlyPayment={formData.monthlyPayment}
        creditScore={formData.creditScore}
        onPropertyAddressChange={(value) => setFormData((prev) => ({ ...prev, propertyAddress: value }))}
        onPropertyCityChange={(value) => setFormData((prev) => ({ ...prev, propertyCity: value }))}
        onPropertyStateChange={(value) => setFormData((prev) => ({ ...prev, propertyState: value }))}
        onPropertyZipChange={(value) => setFormData((prev) => ({ ...prev, propertyZip: value }))}
        onPropertyPriceChange={(value) => setFormData((prev) => ({ ...prev, propertyPrice: value }))}
        onOriginalLoanAmountChange={(value) => setFormData((prev) => ({ ...prev, originalLoanAmount: value }))}
        onCurrentBalanceChange={(value) => setFormData((prev) => ({ ...prev, currentBalance: value }))}
        onInterestRateChange={(value) => setFormData((prev) => ({ ...prev, interestRate: value }))}
        onTermLengthChange={(value) => setFormData((prev) => ({ ...prev, termLength: value }))}
        onStartMonthChange={(value) => setFormData((prev) => ({ ...prev, startMonth: value }))}
        onStartYearChange={(value) => setFormData((prev) => ({ ...prev, startYear: value }))}
        onMonthlyPaymentChange={(value) => setFormData((prev) => ({ ...prev, monthlyPayment: value }))}
        onCreditScoreChange={(value) => setFormData((prev) => ({ ...prev, creditScore: value }))}
        onNext={handleContinue}
        onBack={() => router.push(`/onboard/${token}`)}
      />
    </div>
  )
}
