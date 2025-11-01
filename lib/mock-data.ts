/**
 * Centralized mock data for development and testing
 * All mock responses are defined here to ensure consistency
 */

import { TIME } from "@/lib/constants"
import type { User, Property, Alert, Broker, ClientSummary} from "@/types/_models"

export const MOCK_BROKERS: Broker[] = [
  {
    id: "broker_1",
    emails: ["jane.smith@smithmortgage.com", "jane@example.com"],
    companyName: "Smith Mortgage Group",
    brandColor: "#2563eb",
    logoUrl: undefined,
    createdAt: new Date(Date.now() - 90 * TIME.DAY).toISOString(),
    updatedAt: new Date(Date.now() - 2 * TIME.DAY).toISOString(),
  },
  {
    id: "broker_2",
    emails: ["john.doe@doefinancial.com"],
    companyName: "Doe Financial Services",
    brandColor: "#16a34a",
    logoUrl: undefined,
    createdAt: new Date(Date.now() - 60 * TIME.DAY).toISOString(),
    updatedAt: new Date(Date.now() - 5 * TIME.DAY).toISOString(),
  },
  {
    id: "broker_3",
    emails: ["sarah.johnson@acmemortgage.com", "sjohnson@example.com"],
    companyName: "Acme Mortgage",
    brandColor: "#dc2626",
    logoUrl: undefined,
    createdAt: new Date(Date.now() - 120 * TIME.DAY).toISOString(),
    updatedAt: new Date(Date.now() - 1 * TIME.DAY).toISOString(),
  },
  {
    id: "broker_4",
    emails: ["mike.wilson@wilsonloans.com"],
    companyName: "Wilson Home Loans",
    brandColor: "#9333ea",
    logoUrl: undefined,
    createdAt: new Date(Date.now() - 30 * TIME.DAY).toISOString(),
    updatedAt: new Date(Date.now() - 7 * TIME.DAY).toISOString(),
  },
  {
    id: "broker_5",
    emails: ["emily.chen@chenfinancial.com", "echen@example.com"],
    companyName: "Chen Financial Group",
    brandColor: "#ea580c",
    logoUrl: undefined,
    createdAt: new Date(Date.now() - 15 * TIME.DAY).toISOString(),
    updatedAt: new Date(Date.now() - 3 * TIME.DAY).toISOString(),
  },
]

/**
 * Mock data getter functions
 * These are used by apiClient as fallback when API is unavailable
 */

export function getMockUser(userId: string): User {
  return {
    id: userId,
    email: userId.includes("client") ? "client@example.com" : "user@example.com",
    firstName: "John",
    lastName: "Doe",
    provider: "credentials"
  }
}

export function getMockUpdatedUser(userId: string, updates: Partial<User>): User {
  const existingUser = getMockUser(userId)
  return {
    ...existingUser,
    ...updates,
  }
}

export function getMockProperty(propertyId: string): Property {
  const mockProperties: Record<string, Property> = {
    property_123: {
      id: "property_123",
      userId: "client_123", // Updated to match session user ID
      address: "1348 Armstrong Pl",
      city: "Eau Claire",
      state: "WI",
      zipCode: "54701",
      propertyPrice: 750000,
      originalLoanAmount: 600000,
      loanBalance: 550000,
      interestRate: 6.5,
      monthlyPayment: 3795,
      loanStartDate: "2020-01-15",
      termLength: 30,
      creditScore: "740-759",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    property_456: {
      id: "property_456",
      userId: "client_123", // Updated to match session user ID
      address: "456 Oak Avenue",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      propertyPrice: 950000,
      originalLoanAmount: 760000,
      loanBalance: 720000,
      interestRate: 7.0,
      monthlyPayment: 5068,
      loanStartDate: "2019-06-01",
      termLength: 30,
      creditScore: "760-779",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  }

  return (
    mockProperties[propertyId] || {
      id: propertyId,
      userId: "client_123", // Updated to match session user ID
      address: "123 Main Street",
      city: "San Francisco",
      state: "CA",
      zipCode: "94102",
      propertyPrice: 750000,
      originalLoanAmount: 600000,
      currentBalance: 550000,
      interestRate: 6.5,
      monthlyPayment: 3795,
      loanStartDate: "2020-01-15",
      termLength: 30,
      creditScore: "740-759",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  )
}

function getMockPropertiesByUser(userId: string): Property[] {
  const mockProperties: Property[] = [
    {
      id: "property_123",
      userId: userId, // Use the actual userId parameter
      address: "1348 Armstrong Pl",
      city: "Eau Claire",
      state: "WI",
      zipCode: "54701",
      propertyPrice: 750000,
      originalLoanAmount: 600000,
      loanBalance: 550000,
      interestRate: 6.5,
      monthlyPayment: 3795,
      loanStartDate: "2020-01-15",
      termLength: 30,
      creditScore: "740-759",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "property_456",
      userId: userId, // Use the actual userId parameter
      address: "456 Oak Avenue",
      city: "San Francisco",
      state: "CA",
      zipCode: "94103",
      propertyPrice: 950000,
      originalLoanAmount: 760000,
      loanBalance: 720000,
      interestRate: 7.0,
      monthlyPayment: 5068,
      loanStartDate: "2019-06-01",
      termLength: 30,
      creditScore: "760-779",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  return mockProperties
}

function getMockAlertsByProperty(propertyId: string): Alert[] {
  const mockAlerts: Alert[] = [
    {
      id: "alert_1",
      propertyId: "property_123",
      templateId: "rate-improvement",
      inputs: {kind: "rate-improvement", improvement: 6.2},
      isActive: true,
      isSounding: true,
      isSnoozed: false,
      snoozeUntil: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  return mockAlerts.filter((a) => a.propertyId === propertyId)
}

export function getMockBroker(brokerId: string): Broker {
  return (
    MOCK_BROKERS.find((b) => b.id === brokerId) || {
      id: brokerId,
      emails: ["broker@example.com"],
      companyName: "Smith Mortgage Group",
      brandColor: "#2563eb",
      logoUrl: undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  )
}

export function getMockBrokerClients(): ClientSummary[] {
  return [
    {
      id: "client_1",
      firstName: "Michael",
      lastName: "Johnson",
      email: "michael@example.com",
      propertyCount: 2,
      activeAlertCount: 3,
      soundingAlertCount: 1,
      onboardingStatus: "invited",
      provider: "credentials",
      role: "client",
      invitedAt: new Date().toISOString(),
    },
    {
      id: "client_2",
      firstName: "Sarah",
      lastName: "Williams",
      email: "sarah@example.com",
      propertyCount: 1,
      activeAlertCount: 2,
      soundingAlertCount: 2,
      onboardingStatus: "onboarded",
      provider: "credentials",
      role: "client",
      invitedAt: new Date().toISOString(),
    },
    {
      id: "client_3",
      firstName: "David",
      lastName: "Brown",
      email: "david@example.com",
      propertyCount: 0,
      activeAlertCount: 0,
      soundingAlertCount: 0,
      onboardingStatus: "onboarded",
      provider: "credentials",
      role: "client",
      invitedAt: new Date().toISOString(),
    },
  ]
}



export const getMockPropertyAlerts = getMockAlertsByProperty
export const getMockUserProperties = getMockPropertiesByUser
