export type { OnboardingState, OnboardingAction } from "@/types/forms"

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
  password: "",
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
  creditScore: "",
  selectedAlerts: [],
  cardNumber: "",
  cardExpiry: "",
  cardCvc: "",
  cardName: "",
}
