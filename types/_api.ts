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
} from "./_models"
import type { AlertInputs, TemplateKind } from "@/types/_alerts"

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

type UserResponse = {
  success: boolean
  user?: User
  error?: string
}

type CreateUserResponse = {
  success: boolean
  userId?: string
  error?: string
}

// ============================================================================
// Property API Types
// ============================================================================

type CreatePropertyInput = {
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

type UpdatePropertyInput = {
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

type PropertyResponse = {
  success: boolean
  property?: Property
  error?: string
}

type PropertiesResponse = {
  success: boolean
  properties?: Property[]
  error?: string
}

type CreatePropertyResponse = {
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

type AlertResponse = {
  success: boolean
  alert?: Alert
  error?: string
}

type AlertsResponse = {
  success: boolean
  alerts?: Alert[]
  error?: string
}

type CreateAlertResponse = {
  success: boolean
  alertId?: string
  subscriptionId?: string
  error?: string
}


// ============================================================================
// Broker API Types
// ============================================================================

type CreateBrokerInput = {
  email: string
  password: string
  firstName: string
  lastName: string
  companyName: string
  phone?: string
  subscriptionPlan: "starter" | "professional" | "enterprise"
}

type UpdateBrokerInput = {
  firstName?: string
  lastName?: string
  companyName?: string
  phone?: string
  brandColor?: string
  logoUrl?: string
  customDomain?: string
  defaultRateThreshold?: number
}

type BrokerResponse = {
  success: boolean
  broker?: Broker
  error?: string
}

type BrokersResponse = {
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

type ClientResponse = {
  success: boolean
  client?: Client
  error?: string
}

type ClientsResponse = {
  success: boolean
  clients?: Client[]
  error?: string
}

type ClientSummariesResponse = {
  success: boolean
  clients?: ClientSummary[]
  error?: string
}

// ============================================================================
// Analytics API Types
// ============================================================================

type BrokerAnalyticsResponse = {
  success: boolean
  analytics?: BrokerAnalytics
  error?: string
}

// ============================================================================
// Generic API Response
// ============================================================================

type ApiResponse<T = unknown> = {
  success: boolean
  data?: T
  error?: string
}
