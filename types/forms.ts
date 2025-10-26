/**
 * Form-specific types
 * Type definitions for form state and validation
 */

import type { AlertConfig } from "@/types/alerts"

/**
 * Onboarding form state
 */
export type OnboardingState = {
  currentStep: number
  firstName: string
  lastName: string
  email: string
  password: string
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
  selectedAlerts: AlertConfig[]
  cardNumber: string
  cardExpiry: string
  cardCvc: string
  cardName: string
}

/**
 * Onboarding form actions
 */
export type OnboardingAction =
  | { type: "SET_STEP"; step: number }
  | { type: "SET_FIELD"; field: keyof OnboardingState; value: unknown }
  | { type: "SET_ALERTS"; alerts: AlertConfig[] }
  | { type: "RESET" }
