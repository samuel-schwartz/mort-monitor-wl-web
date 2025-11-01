/**
 * Domain model types for the application
 * Centralized type definitions for User, Property, Alert, and Billing entities
 */

import type { AlertInputs, TemplateKind } from "@/types/_alerts"


/**
 * OAuth provider
 */
type OAuthProvider = "credentials" | "google"

/**
 * User account information
 */
export type User = {
  id: string
  email: string
  iconUrl?: string
  firstName: string
  lastName: string
  provider: OAuthProvider
}
/**
 * User role types for multi-tenant system
 */
export type UserRole = "admin" | "broker" | "client"

/**
 * Extended User with role information
 */
export type UserWithRole = User & {
  role: UserRole
  brokerId?: string // For clients, links to their broker
}

/**
 * Property/Loan information
 */
export type Property = {
  id: string
  userId: string
  address: string
  city: string
  state: string
  zipCode: string
  propertyPrice: number
  originalLoanAmount: number
  loanBalance: number
  interestRate: number
  termLength: number
  monthlyPayment: number
  loanStartDate: string
  creditScore: string
  createdAt: string
  updatedAt?: string
}

/**
 * Alert/notification configuration
 * Removed all subscription-related fields for proper separation of concerns
 */
export type Alert = {
  id: string
  propertyId: string
  templateId: TemplateKind
  inputs: AlertInputs
  isActive: boolean
  isSounding: boolean
  isSnoozed: boolean
  snoozeUntil: string | null
  createdAt: string
  updatedAt?: string
}

/**
 * Broker/Tenant account information
 */
export type Broker = {
  id: string
  emails: string[] // Multiple emails for team members who can access the brokerage
  companyName: string
  // White-label settings
  brandColor?: string
  logoUrl?: string
  // Client management
  createdAt: string
  updatedAt?: string
}

/**
 * Client Onboarding Status
 */
type OnboardingStatus = "invited" | "onboarded"

/**
 * Client information (end users managed by brokers)
 */
export type Client = UserWithRole & {
  // Onboarding status
  onboardingStatus: OnboardingStatus
  invitedAt: string
}

/**
 * Analytics data for broker dashboard
 */
export type BrokerAnalytics = {
  totalClients: number
  activeClients: number
  totalProperties: number
  totalAlerts: number
  activeAlerts: number
  soundingAlerts: number
}

/**
 * Client summary for broker dashboard list view
 */
export type ClientSummary = Client & {
  propertyCount: number
  activeAlertCount: number
  soundingAlertCount: number
}
