export type { UserRole } from "@/types/models"

// Client onboarding state for property and alerts review
export interface ClientOnboardingData {
  clientId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  creditScore: string
  propertyId: string
  propertyAddress: string
  propertyCity: string
  propertyState: string
  propertyZip: string
  propertyPrice: number
  originalLoanAmount: number
  currentBalance: number
  interestRate: number
  termLength: number
  startMonth: number
  startYear: number
  monthlyPayment: number
  brokerName: string
  brokerCompany: string
}

// Keep the reducer and initial state here as they're specific to onboarding
import type { OnboardingState, OnboardingAction } from "@/types/forms"

export function onboardingReducer(state: OnboardingState, action: OnboardingAction): OnboardingState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, currentStep: action.step }
    case "SET_FIELD":
      return { ...state, [action.field]: action.value }
    case "SET_ALERTS":
      return { ...state, selectedAlerts: action.alerts }
    case "RESET":
      return initialOnboardingState
    default:
      return state
  }
}

export const initialOnboardingState: OnboardingState = {
  currentStep: 1,
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  creditScore: "",
  propertyId: "",
  propertyAddress: "",
  propertyCity: "",
  propertyState: "",
  propertyZip: "",
  propertyPrice: 0,
  originalLoanAmount: 0,
  currentBalance: 0,
  interestRate: 0,
  termLength: 0,
  startMonth: 0,
  startYear: 0,
  monthlyPayment: 0,
  brokerName: "",
  brokerCompany: "",
  selectedAlerts: [],
}
