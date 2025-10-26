/**
 * Centralized mock data for development and testing
 * All mock responses are defined here to ensure consistency
 */

import { TIME } from "@/lib/constants"
import type { User, Property, Alert, Broker, BrokerAnalytics, ClientSummary, Invoice } from "@/types/api"

export const MOCK_BROKERS: Broker[] = [
  {
    id: "broker_1",
    emails: ["jane.smith@smithmortgage.com", "jane@example.com"],
    firstName: "Jane",
    lastName: "Smith",
    companyName: "Smith Mortgage Group",
    phone: "(555) 123-4567",
    brandColor: "#2563eb",
    logoUrl: undefined,
    customDomain: undefined,
    defaultRateThreshold: 0.5,
    clientCount: 24,
    maxClients: 50,
    createdAt: new Date(Date.now() - 90 * TIME.DAY).toISOString(),
    updatedAt: new Date(Date.now() - 2 * TIME.DAY).toISOString(),
  },
  {
    id: "broker_2",
    emails: ["john.doe@doefinancial.com"],
    firstName: "John",
    lastName: "Doe",
    companyName: "Doe Financial Services",
    phone: "(555) 987-6543",
    brandColor: "#16a34a",
    logoUrl: undefined,
    customDomain: undefined,
    defaultRateThreshold: 0.75,
    clientCount: 18,
    maxClients: 30,
    createdAt: new Date(Date.now() - 60 * TIME.DAY).toISOString(),
    updatedAt: new Date(Date.now() - 5 * TIME.DAY).toISOString(),
  },
  {
    id: "broker_3",
    emails: ["sarah.johnson@acmemortgage.com", "sjohnson@example.com"],
    firstName: "Sarah",
    lastName: "Johnson",
    companyName: "Acme Mortgage",
    phone: "(555) 456-7890",
    brandColor: "#dc2626",
    logoUrl: undefined,
    customDomain: undefined,
    defaultRateThreshold: 0.5,
    clientCount: 32,
    maxClients: 50,
    createdAt: new Date(Date.now() - 120 * TIME.DAY).toISOString(),
    updatedAt: new Date(Date.now() - 1 * TIME.DAY).toISOString(),
  },
  {
    id: "broker_4",
    emails: ["mike.wilson@wilsonloans.com"],
    firstName: "Mike",
    lastName: "Wilson",
    companyName: "Wilson Home Loans",
    phone: "(555) 234-5678",
    brandColor: "#9333ea",
    logoUrl: undefined,
    customDomain: undefined,
    defaultRateThreshold: 0.625,
    clientCount: 12,
    maxClients: 25,
    createdAt: new Date(Date.now() - 30 * TIME.DAY).toISOString(),
    updatedAt: new Date(Date.now() - 7 * TIME.DAY).toISOString(),
  },
  {
    id: "broker_5",
    emails: ["emily.chen@chenfinancial.com", "echen@example.com"],
    firstName: "Emily",
    lastName: "Chen",
    companyName: "Chen Financial Group",
    phone: "(555) 345-6789",
    brandColor: "#ea580c",
    logoUrl: undefined,
    customDomain: undefined,
    defaultRateThreshold: 0.5,
    clientCount: 8,
    maxClients: 20,
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
    creditScore: "700-749",
    pricingVersion: "v1",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}

export function getMockUpdatedUser(userId: string, updates: Partial<User>): User {
  const existingUser = getMockUser(userId)
  return {
    ...existingUser,
    ...updates,
    updatedAt: new Date().toISOString(),
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
      currentBalance: 550000,
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
      currentBalance: 720000,
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

export function getMockPropertiesByUser(userId: string): Property[] {
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
      currentBalance: 550000,
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
      currentBalance: 720000,
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

export function getMockAlertsByProperty(propertyId: string): Alert[] {
  const mockAlerts: Alert[] = [
    {
      id: "alert_1",
      propertyId: "property_123",
      templateId: "rate_drop",
      name: "Rate Drop Alert",
      description: "Get notified when rates drop below your current rate",
      isActive: true,
      snoozed: false,
      snoozeUntil: null,
      threshold: 0.5,
      currentValue: 6.0,
      isSounding: true,
      potentialSavings: 12000,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "alert_2",
      propertyId: "property_123",
      templateId: "equity_threshold",
      name: "Equity Threshold Alert",
      description: "Get notified when you reach 20% equity",
      isActive: true,
      snoozed: false,
      snoozeUntil: null,
      threshold: 20,
      currentValue: 18.5,
      isSounding: false,
      potentialSavings: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "alert_3",
      propertyId: "property_123",
      templateId: "lifetime_savings",
      name: "Lifetime Savings Alert",
      description: "Get notified when potential lifetime savings exceed threshold",
      isActive: true,
      snoozed: false,
      snoozeUntil: null,
      threshold: 10000,
      currentValue: 15000,
      isSounding: true,
      potentialSavings: 15000,
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
      firstName: "Jane",
      lastName: "Smith",
      companyName: "Smith Mortgage Group",
      phone: "(555) 123-4567",
      brandColor: "#2563eb",
      logoUrl: undefined,
      customDomain: undefined,
      defaultRateThreshold: 0.5,
      clientCount: 12,
      maxClients: 50,
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
      potentialSavings: 8500,
      lastLoginAt: new Date(Date.now() - 2 * TIME.DAY).toISOString(),
      onboardingComplete: true,
    },
    {
      id: "client_2",
      firstName: "Sarah",
      lastName: "Williams",
      email: "sarah@example.com",
      propertyCount: 1,
      activeAlertCount: 2,
      soundingAlertCount: 2,
      potentialSavings: 12000,
      lastLoginAt: new Date(Date.now() - 5 * TIME.DAY).toISOString(),
      onboardingComplete: true,
    },
    {
      id: "client_3",
      firstName: "David",
      lastName: "Brown",
      email: "david@example.com",
      propertyCount: 0,
      activeAlertCount: 0,
      soundingAlertCount: 0,
      potentialSavings: 0,
      lastLoginAt: new Date(Date.now() - 10 * TIME.DAY).toISOString(),
      onboardingComplete: false,
    },
  ]
}

export function getMockBrokerAnalytics(): BrokerAnalytics {
  return {
    totalClients: 12,
    activeClients: 10,
    totalProperties: 18,
    totalAlerts: 24,
    activeAlerts: 20,
    soundingAlerts: 5,
    potentialSavings: 48500,
    averageSavingsPerClient: 4850,
    clientsWithSavings: 5,
  }
}

export function getMockInvoices(): Invoice[] {
  const mockInvoices: Invoice[] = [
    {
      id: "inv_1",
      brokerId: "broker_1",
      brokerName: "Jane Smith - Smith Mortgage Group",
      invoiceNumber: "INV-2024-001",
      description: "Monthly subscription - January 2024",
      filename: "invoice_jan_2024.pdf",
      pdfUrl: "/placeholder.pdf",
      uploadedAt: new Date(Date.now() - 15 * TIME.DAY).toISOString(),
    },
    {
      id: "inv_2",
      brokerId: "broker_2",
      brokerName: "John Doe - Doe Financial Services",
      invoiceNumber: "INV-2024-002",
      description: "Monthly subscription - January 2024",
      filename: "invoice_jan_2024.pdf",
      pdfUrl: "/placeholder.pdf",
      uploadedAt: new Date(Date.now() - 14 * TIME.DAY).toISOString(),
    },
    {
      id: "inv_3",
      brokerId: "broker_1",
      brokerName: "Jane Smith - Smith Mortgage Group",
      invoiceNumber: "INV-2024-003",
      description: "Monthly subscription - February 2024",
      filename: "invoice_feb_2024.pdf",
      pdfUrl: "/placeholder.pdf",
      uploadedAt: new Date(Date.now() - 5 * TIME.DAY).toISOString(),
    },
  ]

  return mockInvoices
}

export function getMockBrokerInvoices(brokerId?: string): Invoice[] {
  const mockInvoices = getMockInvoices()

  if (brokerId) {
    return mockInvoices.filter((inv) => inv.brokerId === brokerId)
  }
  return mockInvoices
}

export const getMockPropertyAlerts = getMockAlertsByProperty
export const getMockUserProperties = getMockPropertiesByUser
