"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MonthYearPicker } from "@/components/shared/month-year-picker"
import { Pencil } from "lucide-react"

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

interface ClientPropertyReviewProps {
  firstName: string
  lastName: string
  phone: string
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
  creditScore: string
  brokerName: string
  brokerCompany: string
  isEditing: boolean
  onFirstNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
  onPhoneChange: (value: string) => void
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
  onCreditScoreChange: (value: string) => void
  onEdit: () => void
  onSave: () => void
  onContinue: () => void
}

export function ClientPropertyReview({
  firstName,
  lastName,
  phone,
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
  creditScore,
  brokerName,
  brokerCompany,
  isEditing,
  onFirstNameChange,
  onLastNameChange,
  onPhoneChange,
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
  onEdit,
  onSave,
  onContinue,
}: ClientPropertyReviewProps) {
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

  return (
    <>
      <div className="container mx-auto px-4 py-12 pb-32">
        <Card className="w-full max-w-4xl mx-auto">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-xl sm:text-2xl">Review Your Property Information</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              {brokerName} at {brokerCompany} has already filled out information on your behalf. Please review it below
              in case something was missed or entered by mistake.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm sm:text-base">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => onFirstNameChange(e.target.value)}
                    disabled={!isEditing}
                    className={`h-11 sm:h-10 ${!isEditing ? "bg-muted" : ""}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm sm:text-base">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(e) => onLastNameChange(e.target.value)}
                    disabled={!isEditing}
                    className={`h-11 sm:h-10 ${!isEditing ? "bg-muted" : ""}`}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="phone" className="text-sm sm:text-base">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => onPhoneChange(e.target.value)}
                    disabled={!isEditing}
                    className={`h-11 sm:h-10 ${!isEditing ? "bg-muted" : ""}`}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Property</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm sm:text-base">
                    Street Address
                  </Label>
                  <Input
                    id="address"
                    type="text"
                    value={propertyAddress}
                    onChange={(e) => onPropertyAddressChange(e.target.value)}
                    disabled={!isEditing}
                    className={`h-11 sm:h-10 ${!isEditing ? "bg-muted" : ""}`}
                  />
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
                      onChange={(e) => onPropertyCityChange(e.target.value)}
                      disabled={!isEditing}
                      className={`h-11 sm:h-10 ${!isEditing ? "bg-muted" : ""}`}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm sm:text-base">
                      State
                    </Label>
                    <Select value={propertyState} onValueChange={onPropertyStateChange} disabled={!isEditing}>
                      <SelectTrigger
                        id="state"
                        className={`h-11 sm:h-10 ${!isEditing ? "bg-muted" : ""}`}
                        disabled={!isEditing}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state.value} value={state.value}>
                            {state.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zip" className="text-sm sm:text-base">
                      ZIP Code
                    </Label>
                    <Input
                      id="zip"
                      type="text"
                      value={propertyZip}
                      onChange={(e) => handleNumericInput(e.target.value, onPropertyZipChange)}
                      disabled={!isEditing}
                      maxLength={5}
                      className={`h-11 sm:h-10 ${!isEditing ? "bg-muted" : ""}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyPrice" className="text-sm sm:text-base">
                    Property Price When It Was Purchased
                  </Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base pointer-events-none">
                      $
                    </span>
                    <Input
                      id="propertyPrice"
                      type="text"
                      value={isEditing ? propertyPrice : Number.parseInt(propertyPrice).toLocaleString()}
                      onChange={(e) => handleCurrencyInput(e.target.value, onPropertyPriceChange)}
                      disabled={!isEditing}
                      className={`h-11 sm:h-10 pl-7 ${!isEditing ? "bg-muted" : ""}`}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-semibold">Credit Information</h3>
              <div className="space-y-2">
                <Label htmlFor="creditScore" className="text-sm sm:text-base">
                  Credit Score
                </Label>
                <Select value={creditScore} onValueChange={onCreditScoreChange} disabled={!isEditing}>
                  <SelectTrigger
                    id="creditScore"
                    className={`h-11 sm:h-10 ${!isEditing ? "bg-muted" : ""}`}
                    disabled={!isEditing}
                  >
                    <SelectValue />
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
              </div>
            </div>

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
                      value={isEditing ? originalLoanAmount : Number.parseInt(originalLoanAmount).toLocaleString()}
                      onChange={(e) => handleCurrencyInput(e.target.value, onOriginalLoanAmountChange)}
                      disabled={!isEditing}
                      className={`h-11 sm:h-10 pl-7 ${!isEditing ? "bg-muted" : ""}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="termLength" className="text-sm sm:text-base">
                    Original Term Length
                  </Label>
                  <div className="relative">
                    <Input
                      id="termLength"
                      type="text"
                      value={isEditing ? termLength : `${termLength} years`}
                      onChange={(e) => handleNumericInput(e.target.value, onTermLengthChange)}
                      disabled={!isEditing}
                      className={`h-11 sm:h-10 ${!isEditing ? "bg-muted" : ""}`}
                    />
                  </div>
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
                      value={isEditing ? monthlyPayment : Number.parseInt(monthlyPayment).toLocaleString()}
                      onChange={(e) => handleCurrencyInput(e.target.value, onMonthlyPaymentChange)}
                      disabled={!isEditing}
                      className={`h-11 sm:h-10 pl-7 ${!isEditing ? "bg-muted" : ""}`}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm sm:text-base">
                    When Was The Very First Payment?
                  </Label>
                  <MonthYearPicker
                    month={startMonth}
                    year={startYear}
                    onMonthChange={isEditing ? onStartMonthChange : () => {}}
                    onYearChange={isEditing ? onStartYearChange : () => {}}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="interestRate" className="text-sm sm:text-base">
                    Interest Rate (APR)
                  </Label>
                  <div className="relative">
                    <Input
                      id="interestRate"
                      type="text"
                      value={interestRate}
                      onChange={(e) => handleNumericInput(e.target.value, onInterestRateChange, true)}
                      disabled={!isEditing}
                      className={`h-11 sm:h-10 pr-8 ${!isEditing ? "bg-muted" : ""}`}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm sm:text-base pointer-events-none">
                      %
                    </span>
                  </div>
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
                      value={isEditing ? currentBalance : Number.parseInt(currentBalance).toLocaleString()}
                      onChange={(e) => handleCurrencyInput(e.target.value, onCurrentBalanceChange)}
                      disabled={!isEditing}
                      className={`h-11 sm:h-10 pl-7 ${!isEditing ? "bg-muted" : ""}`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="max-w-4xl mx-auto flex gap-3">
            {isEditing ? (
              <Button onClick={onSave} className="flex-1" size="lg">
                Save Changes
              </Button>
            ) : (
              <>
                <Button onClick={onEdit} variant="outline" className="flex-1 bg-transparent" size="lg">
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Details
                </Button>
                <Button onClick={onContinue} className="flex-1" size="lg">
                  Continue to Alerts
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
