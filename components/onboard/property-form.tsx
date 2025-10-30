"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MonthYearPicker } from "@/components/shared/month-year-picker"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

const US_STATES = [
  { value: "AL", label: "Alabama" },
  { value: "AK", label: "Alaska" },
  { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" },
  { value: "CA", label: "California" },
  { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" },
  { value: "DE", label: "Delaware" },
  { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" },
  { value: "HI", label: "Hawaii" },
  { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" },
  { value: "IN", label: "Indiana" },
  { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" },
  { value: "KY", label: "Kentucky" },
  { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" },
  { value: "MD", label: "Maryland" },
  { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" },
  { value: "MN", label: "Minnesota" },
  { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" },
  { value: "MT", label: "Montana" },
  { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" },
  { value: "NH", label: "New Hampshire" },
  { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" },
  { value: "NY", label: "New York" },
  { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" },
  { value: "OH", label: "Ohio" },
  { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" },
  { value: "PA", label: "Pennsylvania" },
  { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" },
  { value: "SD", label: "South Dakota" },
  { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" },
  { value: "UT", label: "Utah" },
  { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" },
  { value: "WA", label: "Washington" },
  { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" },
  { value: "WY", label: "Wyoming" },
]

function toNumber(v: any): number {
  const n = typeof v === "number" ? v : Number.parseFloat(String(v).replace(/[^0-9.-]/g, ""))
  return Number.isFinite(n) ? n : 0
}

function clamp(n: number, low: number, high: number) {
  return Math.min(Math.max(n, low), high)
}

interface PropertyFormProps {
  mode?: "create" | "review"
  firstName: string
  propertyAddress: string
  propertyCity: string
  propertyState: string
  propertyZip: string
  propertyPrice: string
  originalLoanAmount: string
  currentBalance: string
  interestRate: string
  termLength: string
  startMonth: string
  startYear: string
  monthlyPayment: string
  creditScore: string // Made required - creditScore always visible
  onPropertyAddressChange: (value: string) => void
  onPropertyCityChange: (value: string) => void
  onPropertyStateChange: (value: string) => void
  onPropertyZipChange: (value: string) => void
  onPropertyPriceChange: (value: string) => void
  onOriginalLoanAmountChange: (value: string) => void
  onCurrentBalanceChange: (value: string) => void
  onInterestRateChange: (value: string) => void
  onTermLengthChange: (value: string) => void
  onStartMonthChange: (value: string) => void
  onStartYearChange: (value: string) => void
  onMonthlyPaymentChange: (value: string) => void
  onCreditScoreChange: (value: string) => void // Made required
  onNext: () => void
  onBack?: () => void
}

export default function PropertyForm({
  mode = "create",
  firstName,
  propertyAddress,
  propertyCity,
  propertyState,
  propertyZip,
  propertyPrice,
  originalLoanAmount,
  currentBalance,
  interestRate,
  termLength,
  startMonth,
  startYear,
  monthlyPayment,
  creditScore, // No default value, required prop
  onPropertyAddressChange,
  onPropertyCityChange,
  onPropertyStateChange,
  onPropertyZipChange,
  onPropertyPriceChange,
  onOriginalLoanAmountChange,
  onCurrentBalanceChange,
  onInterestRateChange,
  onTermLengthChange,
  onStartMonthChange,
  onStartYearChange,
  onMonthlyPaymentChange,
  onCreditScoreChange,
  onNext,
  onBack,
}: PropertyFormProps) {
  const [loanStage, setLoanStage] = useState<1 | 2>(mode === "review" ? 2 : 1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [termType, setTermType] = useState<"30" | "15" | "other" | "">("")

  useEffect(() => {
    if (!startMonth || !startYear) {
      const now = new Date()
      if (!startMonth) {
        onStartMonthChange(String(now.getMonth() + 1))
      }
      if (!startYear) {
        onStartYearChange(String(now.getFullYear()))
      }
    }
  }, [startMonth, startYear, onStartMonthChange, onStartYearChange])

  useEffect(() => {
    if (termLength === "30") {
      setTermType("30")
    } else if (termLength === "15") {
      setTermType("15")
    } else if (termLength && termLength !== "30" && termLength !== "15") {
      setTermType("other")
    }
  }, [termLength])

  const handleCurrencyInput = (value: string, onChange: (value: string) => void) => {
    const numericValue = value.replace(/[^0-9]/g, "")
    onChange(numericValue)
  }

  const handleNumericInput = (value: string, onChange: (value: string) => void, allowDecimal = false) => {
    const pattern = allowDecimal ? /[^0-9.]/g : /[^0-9]/g
    const numericValue = value.replace(pattern, "")
    if (allowDecimal && numericValue.split(".").length > 2) return
    onChange(numericValue)
  }

  const calculateDerivedValues = () => {
    const principal = toNumber(originalLoanAmount)
    const payment = toNumber(monthlyPayment)
    const term = toNumber(termLength)

    if (principal <= 0 || payment <= 0 || term <= 0) return

    const firstPaymentDate = new Date(Number.parseInt(startYear), Number.parseInt(startMonth) - 1, 1)
    const now = new Date()
    const monthsPassed =
      (now.getFullYear() - firstPaymentDate.getFullYear()) * 12 + (now.getMonth() - firstPaymentDate.getMonth())

    if (!interestRate) {
      onInterestRateChange("6.5")
    }

    const rate = toNumber(interestRate || "6.5") / 100 / 12
    const totalMonths = term * 12
    const monthsRemaining = Math.max(0, totalMonths - monthsPassed)

    if (rate > 0 && monthsRemaining > 0) {
      const remainingBalance =
        payment * ((Math.pow(1 + rate, monthsRemaining) - 1) / (rate * Math.pow(1 + rate, monthsRemaining)))
      onCurrentBalanceChange(Math.round(remainingBalance).toString())
    } else if (monthsRemaining > 0) {
      onCurrentBalanceChange(Math.round(payment * monthsRemaining).toString())
    }
  }

  const handleStage1Continue = () => {
    const newErrors: Record<string, string> = {}

    if (!propertyAddress.trim()) newErrors.propertyAddress = "Street address is required"
    if (!propertyCity.trim()) newErrors.propertyCity = "City is required"
    if (!propertyState) newErrors.propertyState = "State is required"
    if (!propertyZip || propertyZip.length !== 5) newErrors.propertyZip = "Valid 5-digit ZIP code is required"
    if (!propertyPrice || Number.parseFloat(propertyPrice) <= 0) newErrors.propertyPrice = "Property price is required"
    if (!originalLoanAmount || Number.parseFloat(originalLoanAmount) <= 0)
      newErrors.originalLoanAmount = "Original loan amount is required"
    if (!termLength || Number.parseInt(termLength) <= 0) newErrors.termLength = "Term length is required"
    if (!monthlyPayment || Number.parseFloat(monthlyPayment) <= 0)
      newErrors.monthlyPayment = "Monthly payment is required"
    if (!startMonth || !startYear) newErrors.startDate = "First payment date is required"
    if (!creditScore) newErrors.creditScore = "Credit score is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    calculateDerivedValues()
    setLoanStage(2)
  }

  const isStage1Complete =
    propertyAddress.trim() !== "" &&
    propertyCity.trim() !== "" &&
    propertyState !== "" &&
    propertyZip !== "" &&
    propertyPrice !== "" &&
    creditScore !== "" &&
    originalLoanAmount !== "" &&
    termLength !== "" &&
    monthlyPayment !== "" &&
    startMonth !== "" &&
    startYear !== ""

  const handleContinue = (e: React.MouseEvent) => {
    console.log("[v0] PropertyForm handleContinue called", { mode, loanStage })
    e.preventDefault()
    e.stopPropagation()

    if (mode === "create" && loanStage === 1) {
      console.log("[v0] PropertyForm advancing to stage 2")
      handleStage1Continue()
      return
    }

    console.log("[v0] PropertyForm validating stage 2")
    const newErrors: Record<string, string> = {}

    if (!currentBalance || Number.parseFloat(currentBalance) <= 0)
      newErrors.currentBalance = "Current balance is required"
    if (!interestRate || Number.parseFloat(interestRate) <= 0) newErrors.interestRate = "Interest rate is required"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    const isValid =
      propertyAddress &&
      propertyCity &&
      propertyState &&
      propertyZip &&
      propertyPrice &&
      currentBalance &&
      interestRate &&
      monthlyPayment &&
      creditScore

    if (isValid) {
      console.log("[v0] PropertyForm calling onNext")
      setErrors({})
      onNext()
    } else {
      console.log("[v0] PropertyForm validation failed", { isValid })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    console.log("[v0] PropertyForm handleSubmit called")
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl sm:text-2xl">
          {mode === "review" ? `Review Your Property Details, ${firstName}` : `Awesome, ${firstName}!`}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {mode === "review"
            ? "Your broker has pre-filled this information. Please review and make any necessary changes."
            : "Let's personalize your refinance alerts with your property and loan details"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Property Section */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Property</h3>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm sm:text-base">
                  Street Address
                </Label>
                <Input
                  id="address"
                  type="text"
                  value={propertyAddress}
                  onChange={(e) => {
                    onPropertyAddressChange(e.target.value)
                    if (errors.propertyAddress) setErrors({ ...errors, propertyAddress: "" })
                  }}
                  placeholder="123 Main Street"
                  className="h-11 sm:h-10"
                  autoFocus
                  required
                  aria-invalid={!!errors.propertyAddress}
                />
                {errors.propertyAddress && <p className="text-sm text-destructive">{errors.propertyAddress}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2 sm:col-span-1">
                  <Label htmlFor="city" className="text-sm sm:text-base">
                    City
                  </Label>
                  <Input
                    id="city"
                    type="text"
                    value={propertyCity}
                    onChange={(e) => {
                      onPropertyCityChange(e.target.value)
                      if (errors.propertyCity) setErrors({ ...errors, propertyCity: "" })
                    }}
                    placeholder="San Francisco"
                    className="h-11 sm:h-10"
                    required
                    aria-invalid={!!errors.propertyCity}
                  />
                  {errors.propertyCity && <p className="text-sm text-destructive">{errors.propertyCity}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-sm sm:text-base">
                    State
                  </Label>
                  <Select
                    value={propertyState}
                    onValueChange={(value) => {
                      onPropertyStateChange(value)
                      if (errors.propertyState) setErrors({ ...errors, propertyState: "" })
                    }}
                    required
                  >
                    <SelectTrigger
                      id="state"
                      className="h-11 sm:h-10 !py-1 text-base md:text-sm w-full"
                      aria-invalid={!!errors.propertyState}
                    >
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state.value} value={state.value}>
                          {state.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.propertyState && <p className="text-sm text-destructive">{errors.propertyState}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip" className="text-sm sm:text-base">
                    ZIP Code
                  </Label>
                  <Input
                    id="zip"
                    type="text"
                    value={propertyZip}
                    onChange={(e) => {
                      handleNumericInput(e.target.value, onPropertyZipChange)
                      if (errors.propertyZip) setErrors({ ...errors, propertyZip: "" })
                    }}
                    placeholder="94102"
                    className="h-11 sm:h-10"
                    maxLength={5}
                    inputMode="numeric"
                    required
                    aria-invalid={!!errors.propertyZip}
                  />
                  {errors.propertyZip && <p className="text-sm text-destructive">{errors.propertyZip}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="propertyPrice" className="text-sm sm:text-base">
                  Property Price When You Bought It
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base pointer-events-none">
                    $
                  </span>
                  <Input
                    id="propertyPrice"
                    type="text"
                    value={propertyPrice}
                    onChange={(e) => {
                      handleCurrencyInput(e.target.value, onPropertyPriceChange)
                      if (errors.propertyPrice) setErrors({ ...errors, propertyPrice: "" })
                    }}
                    placeholder="350000"
                    className="h-11 sm:h-10 pl-7"
                    inputMode="numeric"
                    required
                    aria-invalid={!!errors.propertyPrice}
                  />
                </div>
                {errors.propertyPrice && <p className="text-sm text-destructive">{errors.propertyPrice}</p>}
              </div>
            </div>
          </div>

          {/* Credit Information */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Credit Information</h3>
            <div className="space-y-2">
              <Label htmlFor="creditScore" className="text-sm sm:text-base">
                {"What's your credit score?"}
              </Label>
              <Select
                value={creditScore}
                onValueChange={(value) => {
                  onCreditScoreChange(value)
                  if (errors.creditScore) setErrors({ ...errors, creditScore: "" })
                }}
                required
              >
                <SelectTrigger
                  id="creditScore"
                  className="h-11 sm:h-10 !py-1 text-base md:text-sm w-full"
                  aria-invalid={!!errors.creditScore}
                >
                  <SelectValue placeholder="Select your credit score range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="750+">750+</SelectItem>
                  <SelectItem value="700-749">700-749</SelectItem>
                  <SelectItem value="650-699">650-699</SelectItem>
                  <SelectItem value="600-649">600-649</SelectItem>
                  <SelectItem value="<600">&lt;600</SelectItem>
                  <SelectItem value="Unsure">
                    Not Sure (we'll assume you're around or slightly above the average credit score).
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.creditScore && <p className="text-sm text-destructive">{errors.creditScore}</p>}
            </div>
          </div>

          {/* Loan Details */}
          <div className="space-y-4">
            <h3 className="text-base sm:text-lg font-semibold">Loan Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="originalLoanAmount" className="text-sm sm:text-base">
                  Original Loan Amount
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base pointer-events-none">
                    $
                  </span>
                  <Input
                    id="originalLoanAmount"
                    type="text"
                    value={originalLoanAmount}
                    onChange={(e) => {
                      handleCurrencyInput(e.target.value, onOriginalLoanAmountChange)
                      if (errors.originalLoanAmount) setErrors({ ...errors, originalLoanAmount: "" })
                    }}
                    placeholder="300000"
                    className="h-11 sm:h-10 pl-7"
                    inputMode="numeric"
                    required
                    aria-invalid={!!errors.originalLoanAmount}
                  />
                </div>
                {errors.originalLoanAmount && <p className="text-sm text-destructive">{errors.originalLoanAmount}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="termType" className="text-sm sm:text-base">
                  Original Term Length
                </Label>
                <div className="flex gap-2">
                  <Select
                    value={termType}
                    onValueChange={(value: "30" | "15" | "other" | "") => {
                      setTermType(value)
                      if (value === "30") {
                        onTermLengthChange("30")
                      } else if (value === "15") {
                        onTermLengthChange("15")
                      }
                      if (value === "other") {
                        onTermLengthChange("")
                      }
                      if (errors.termLength) setErrors({ ...errors, termLength: "" })
                    }}
                    required
                  >
                    <SelectTrigger
                      id="termType"
                      className={`h-11 sm:h-10 !py-1 text-base md:text-sm ${termType === "other" ? "flex-1" : "w-full"}`}
                      aria-invalid={!!errors.termLength}
                    >
                      <SelectValue placeholder="Select term length" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 years</SelectItem>
                      <SelectItem value="15">15 years</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {termType === "other" && (
                    <div className="relative flex-1">
                      <Input
                        id="termYears"
                        type="text"
                        value={termLength}
                        onChange={(e) => {
                          handleNumericInput(e.target.value, onTermLengthChange)
                          if (errors.termLength) setErrors({ ...errors, termLength: "" })
                        }}
                        placeholder="20"
                        className="h-11 sm:h-10 pr-16"
                        inputMode="numeric"
                        required
                        aria-invalid={!!errors.termLength}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base pointer-events-none">
                        years
                      </span>
                    </div>
                  )}
                </div>
                {errors.termLength && <p className="text-sm text-destructive">{errors.termLength}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="monthlyPayment" className="text-sm sm:text-base">
                  Current Monthly Payment
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base pointer-events-none">
                    $
                  </span>
                  <Input
                    id="monthlyPayment"
                    type="text"
                    value={monthlyPayment}
                    onChange={(e) => {
                      handleCurrencyInput(e.target.value, onMonthlyPaymentChange)
                      if (errors.monthlyPayment) setErrors({ ...errors, monthlyPayment: "" })
                    }}
                    placeholder="1750"
                    className="h-11 sm:h-10 pl-7"
                    inputMode="numeric"
                    required
                    aria-invalid={!!errors.monthlyPayment}
                  />
                </div>
                {errors.monthlyPayment && <p className="text-sm text-destructive">{errors.monthlyPayment}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="startMonth" className="text-sm sm:text-base">
                  When Was Your Very First Payment?
                </Label>
                <MonthYearPicker
                  month={startMonth ? Number.parseInt(startMonth) : 1}
                  year={startYear ? Number.parseInt(startYear) : new Date().getFullYear()}
                  onMonthChange={(value) => {
                    onStartMonthChange(String(value))
                    if (errors.startDate) setErrors({ ...errors, startDate: "" })
                  }}
                  onYearChange={(value) => {
                    onStartYearChange(String(value))
                    if (errors.startDate) setErrors({ ...errors, startDate: "" })
                  }}
                />
                {errors.startDate && <p className="text-sm text-destructive">{errors.startDate}</p>}
              </div>
            </div>
          </div>

          {/* Stage 2: Calculated Values - Show in create mode stage 2 OR always in review mode */}
          {(loanStage === 2 || mode === "review") && (
            <>
              {mode === "create" && (
                <Alert>
                  <InfoIcon className="h-4 w-4" />
                  <AlertDescription>
                    Based on your loan information, we've calculated your interest rate and current balance. Please
                    review these values and adjust them if needed.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rate" className="text-sm sm:text-base">
                      Interest Rate (APR)
                    </Label>
                    <div className="relative">
                      <Input
                        id="rate"
                        type="text"
                        value={interestRate}
                        onChange={(e) => {
                          handleNumericInput(e.target.value, onInterestRateChange, true)
                          if (errors.interestRate) setErrors({ ...errors, interestRate: "" })
                        }}
                        placeholder="6.25"
                        className="h-11 sm:h-10 pr-8"
                        inputMode="decimal"
                        required
                        aria-invalid={!!errors.interestRate}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base pointer-events-none">
                        %
                      </span>
                    </div>
                    {mode === "create" && (
                      <p className="text-xs text-muted-foreground">Edit if this doesn't look right</p>
                    )}
                    {errors.interestRate && <p className="text-sm text-destructive">{errors.interestRate}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentBalance" className="text-sm sm:text-base">
                      Current Balance
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base pointer-events-none">
                        $
                      </span>
                      <Input
                        id="currentBalance"
                        type="text"
                        value={currentBalance}
                        onChange={(e) => {
                          handleCurrencyInput(e.target.value, onCurrentBalanceChange)
                          if (errors.currentBalance) setErrors({ ...errors, currentBalance: "" })
                        }}
                        placeholder="285500"
                        className="h-11 sm:h-10 pl-7"
                        inputMode="numeric"
                        required
                        aria-invalid={!!errors.currentBalance}
                      />
                    </div>
                    {mode === "create" && (
                      <p className="text-xs text-muted-foreground">Edit if this doesn't look right</p>
                    )}
                    {errors.currentBalance && <p className="text-sm text-destructive">{errors.currentBalance}</p>}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            {onBack && (
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  if (mode === "create" && loanStage === 2) {
                    setLoanStage(1)
                    setErrors({})
                  } else {
                    onBack()
                  }
                }}
                className="flex-1 h-11 sm:h-12 bg-transparent"
              >
                Back
              </Button>
            )}
            <Button
              type="button"
              onClick={handleContinue}
              className={`${onBack ? "flex-1" : "w-full"} h-11 sm:h-12`}
              disabled={
                mode === "create" && loanStage === 1
                  ? !isStage1Complete
                  : !propertyAddress ||
                    !propertyCity ||
                    !propertyState ||
                    !propertyZip ||
                    !propertyPrice ||
                    !currentBalance ||
                    !interestRate ||
                    !monthlyPayment ||
                    !creditScore
              }
            >
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
