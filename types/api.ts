/**
 * API request and response types
 * Centralized type definitions for all API operations
 */

import type {
  User,
  Property,
  Alert,
  Broker,
  Client,
  ClientSummary,
  BrokerAnalytics,
} from "./models"
import type { AlertInputs, TemplateKind } from "@/types/alerts"

// ============================================================================
// User API Types
// ============================================================================

export type CreateUserInput = {
  email: string
  firstName: string
  lastName: string
}

export type UpdateUserInput = {
  firstName?: string
  lastName?: string
}

export type UserResponse = {
  success: boolean
  user?: User
  error?: string
}

export type CreateUserResponse = {
  success: boolean
  userId?: string
  error?: string
}

// ============================================================================
// Property API Types
// ============================================================================

export type CreatePropertyInput = {
  userId: string
  address: string
  city?: string
  state?: string
  zipCode?: string
  propertyPrice: number
  originalLoanAmount: number
  loanBalance: number
  interestRate: number
  loanTermYears: number
  monthlyPayment: number
  loanStartDate?: string
}

export type UpdatePropertyInput = {
  address?: string
  city?: string
  state?: string
  zipCode?: string
  propertyPrice?: number
  originalLoanAmount?: number
  loanBalance?: number
  interestRate?: number
  loanTermYears?: number
  monthlyPayment?: number
  loanStartDate?: string
}

export type PropertyResponse = {
  success: boolean
  property?: Property
  error?: string
}

export type PropertiesResponse = {
  success: boolean
  properties?: Property[]
  error?: string
}

export type CreatePropertyResponse = {
  success: boolean
  propertyId?: string
  error?: string
}

// ============================================================================
// Alert API Types
// ============================================================================

export type CreateAlertInput = {
  propertyId: string
  userId: string
  templateId: TemplateKind
  inputs: AlertInputs
  loanTerms: number[]
  paymentMethodId?: string
}

export type UpdateAlertInput = {
  inputs?: AlertInputs
  loanTerms?: number[]
  active?: boolean
  snoozed?: boolean
  snoozeUntil?: string | null
}

export type AlertResponse = {
  success: boolean
  alert?: Alert
  error?: string
}

export type AlertsResponse = {
  success: boolean
  alerts?: Alert[]
  error?: string
}

export type CreateAlertResponse = {
  success: boolean
  alertId?: string
  subscriptionId?: string
  error?: string
}


// ============================================================================
// Broker API Types
// ============================================================================

export type CreateBrokerInput = {
  email: string
  password: string
  firstName: string
  lastName: string
  companyName: string
  phone?: string
  subscriptionPlan: "starter" | "professional" | "enterprise"
}

export type UpdateBrokerInput = {
  firstName?: string
  lastName?: string
  companyName?: string
  phone?: string
  brandColor?: string
  logoUrl?: string
  customDomain?: string
  defaultRateThreshold?: number
}

export type BrokerResponse = {
  success: boolean
  broker?: Broker
  error?: string
}

export type BrokersResponse = {
  success: boolean
  brokers?: Broker[]
  error?: string
}

// ============================================================================
// Client API Types
// ============================================================================

export type CreateClientInput = {
  brokerId: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  creditScore?: string
  sendInvite?: boolean
}

export type UpdateClientInput = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  creditScore?: string
}

export type ClientResponse = {
  success: boolean
  client?: Client
  error?: string
}

export type ClientsResponse = {
  success: boolean
  clients?: Client[]
  error?: string
}

export type ClientSummariesResponse = {
  success: boolean
  clients?: ClientSummary[]
  error?: string
}

// ============================================================================
// Analytics API Types
// ============================================================================

export type BrokerAnalyticsResponse = {
  success: boolean
  analytics?: BrokerAnalytics
  error?: string
}

// ============================================================================
// Generic API Response
// ============================================================================

export type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}
