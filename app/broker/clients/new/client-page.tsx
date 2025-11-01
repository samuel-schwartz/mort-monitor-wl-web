"use client"

import { useReducer, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TrendingDown } from "lucide-react"
import ClientInfoStep from "../_components/client-info-step"
import PropertyForm from "@/components/onboard/property-form"
import AlertSelection from "@/components/onboard/alert-selection"
import { createClient } from "@/app/_actions/clients"
import { createProperty } from "@/app/_actions/properties"
import { createAlert } from "@/app/_actions/alerts"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"
import { getBrokerFromContext } from "@/app/_providers/broker-provider" // Fixed import path to use correct broker provider
import type { AlertConfig } from "@/types/_alerts"

interface OnboardingState {
  currentStep: number
  clientId: string | null
  propertyId: string | null
  firstName: string
  lastName: string
  email: string
  phone: string
  creditScore: string
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
  selectedAlerts: AlertConfig[]
}

type OnboardingAction =
  | { type: "SET_STEP"; step: number }
  | { type: "SET_FIELD"; field: keyof OnboardingState; value: any }
  | { type: "SET_ALERTS"; alerts: AlertConfig[] }
  | { type: "SET_CLIENT_ID"; clientId: string }
  | { type: "SET_PROPERTY_ID"; propertyId: string }

const initialState: OnboardingState = {
  currentStep: 1,
  clientId: null,
  propertyId: null,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  creditScore: "",
  propertyAddress: "",
  propertyCity: "",
  propertyState: "",
  propertyZip: "",
  propertyPrice: "",
  originalLoanAmount: "",
  currentBalance: "",
  interestRate: "",
  termLength: "",
  startMonth: "",
  startYear: "",
  monthlyPayment: "",
  selectedAlerts: [],
}

function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.step }
    case "SET_FIELD":
      return { ...state, [action.field]: action.value }
    case "SET_ALERTS":
      return { ...state, selectedAlerts: action.alerts }
    case "SET_CLIENT_ID":
      return { ...state, clientId: action.clientId }
    case "SET_PROPERTY_ID":
      return { ...state, propertyId: action.propertyId }
    default:
      return state
  }
}

export default function BrokerClientOnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const broker = getBrokerFromContext() // Use getBrokerFromContext instead of useBrokerContext
  const brokerId = broker?.id || "broker_123" // Fallback for development
  const [state, dispatch] = useReducer(onboardingReducer, initialState)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [state.currentStep])

  const handleClientInfoComplete = async () => {
    setIsSubmitting(true)

    try {
      const clientResult = await createClient({
        brokerId: brokerId, // Use brokerId from context
        firstName: state.firstName,
        lastName: state.lastName,
        email: state.email,
        phone: state.phone,
        sendInvite: false, // Don't send invite yet
      })

      if (!clientResult.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: clientResult.error || "Failed to create client",
        })
        setIsSubmitting(false)
        return
      }

      dispatch({ type: "SET_CLIENT_ID", clientId: clientResult.clientId! })

      setIsSubmitting(false)
      dispatch({ type: "SET_STEP", step: 2 })
    } catch (error) {
      console.error("[v0] Client creation failed:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      })
      setIsSubmitting(false)
    }
  }

  const handlePropertyComplete = async () => {
    if (!state.clientId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Client ID not found. Please start over.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const fullAddress = `${state.propertyAddress}, ${state.propertyCity}, ${state.propertyState} ${state.propertyZip}`

      const property = await createProperty({
        userId: state.clientId,
        address: fullAddress,
        propertyPrice: Number.parseFloat(state.propertyPrice.replace(/[^0-9.]/g, "")),
        originalLoanAmount: Number.parseFloat(state.originalLoanAmount.replace(/[^0-9.]/g, "") || "0"),
        creditScore: state.creditScore,
        currentBalance: Number.parseFloat(state.currentBalance.replace(/[^0-9.]/g, "")),
        interestRate: Number.parseFloat(state.interestRate),
        termLength: Number.parseInt(state.termLength || "30"),
        startMonth: Number.parseInt(state.startMonth),
        startYear: Number.parseInt(state.startYear),
        monthlyPayment: Number.parseFloat(state.monthlyPayment.replace(/[^0-9.]/g, "")),
      })

      if (!property.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: property.error || "Failed to create property",
        })
        setIsSubmitting(false)
        return
      }

      dispatch({
        type: "SET_PROPERTY_ID",
        propertyId: property.data?.propertyId!,
      })

      setIsSubmitting(false)
      dispatch({ type: "SET_STEP", step: 3 })
    } catch (error) {
      console.error("[v0] Property creation failed:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      })
      setIsSubmitting(false)
    }
  }

  const handleFinalSubmit = async () => {
    if (!state.clientId || !state.propertyId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Missing client or property information. Please start over.",
      })
      return
    }

    setIsSubmitting(true)

    try {
      for (const alertConfig of state.selectedAlerts) {
        await createAlert({
          userId: state.clientId,
          propertyId: state.propertyId,
          ...alertConfig,
        })
      }

      toast({
        title: "Client Added Successfully",
        description: `${state.firstName} ${state.lastName} has been added to your client list`,
      })

      router.push("/broker")
    } catch (error) {
      console.error("[v0] Alert creation failed:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create alerts",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
            <Spinner className="h-12 w-12 sm:h-8 sm:w-8 text-blue-600" />
            <p className="text-lg font-semibold">
              {state.currentStep === 1 && "Creating client..."}
              {state.currentStep === 2 && "Adding property..."}
              {state.currentStep === 3 && "Setting up alerts..."}
            </p>
            <p className="text-sm text-muted-foreground">This will only take a moment</p>
          </div>
        </div>
      )}

      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">MortMonitor</h1>
          </div>
          <div className="text-sm text-muted-foreground">Step {state.currentStep} of 3</div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-12">
        {state.currentStep === 1 && (
          <ClientInfoStep
            firstName={state.firstName}
            lastName={state.lastName}
            email={state.email}
            phone={state.phone}
            onFirstNameChange={(value) => dispatch({ type: "SET_FIELD", field: "firstName", value })}
            onLastNameChange={(value) => dispatch({ type: "SET_FIELD", field: "lastName", value })}
            onEmailChange={(value) => dispatch({ type: "SET_FIELD", field: "email", value })}
            onPhoneChange={(value) => dispatch({ type: "SET_FIELD", field: "phone", value })}
            onNext={handleClientInfoComplete}
            onCancel={() => router.push("/broker/clients")}
          />
        )}

        {state.currentStep === 2 && (
          <PropertyForm
            mode="create"
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
            onOriginalLoanAmountChange={(value) =>
              dispatch({
                type: "SET_FIELD",
                field: "originalLoanAmount",
                value,
              })
            }
            onCurrentBalanceChange={(value) => dispatch({ type: "SET_FIELD", field: "currentBalance", value })}
            onInterestRateChange={(value) => dispatch({ type: "SET_FIELD", field: "interestRate", value })}
            onTermLengthChange={(value) => dispatch({ type: "SET_FIELD", field: "termLength", value })}
            onStartMonthChange={(value) => dispatch({ type: "SET_FIELD", field: "startMonth", value })}
            onStartYearChange={(value) => dispatch({ type: "SET_FIELD", field: "startYear", value })}
            onMonthlyPaymentChange={(value) => dispatch({ type: "SET_FIELD", field: "monthlyPayment", value })}
            onCreditScoreChange={(value) => dispatch({ type: "SET_FIELD", field: "creditScore", value })}
            onNext={handlePropertyComplete}
            onBack={() => dispatch({ type: "SET_STEP", step: 1 })}
          />
        )}

        {state.currentStep === 3 && (
          <AlertSelection
            mode="create"
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
