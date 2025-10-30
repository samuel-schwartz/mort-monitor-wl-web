"use server"

/**
 * Server actions for client operations (broker managing clients)
 */

import { revalidatePath } from "next/cache"
import { apiClient } from "@/lib/api-client"
import { generateInvitationToken } from "./tokens"
import type { CreateClientInput, UpdateClientInput } from "@/types/api"
import type { Client, Property } from "@/types/models"
import type { AlertConfig } from "@/types/alerts"

/**
 * Create a new client (broker action)
 */
export async function createClient(input: CreateClientInput): Promise<{
  success: boolean
  clientId?: string
  invitationToken?: string
  error?: string
}> {
  try {
    const result = await apiClient.post<{
      id: string
      invitationToken?: string
    }>("/clients", input, () => ({
      id: `client_${Date.now()}`,
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
      phone: input.phone || "",
      role: "client" as const,
      brokerId: input.brokerId,
      onboardingStatus: "invited" as const,
      invitedAt: new Date().toISOString(),
      provider: "credentials" as const,
      creditScore: input.creditScore || "700-749",
      invitationToken: input.sendInvite ? `invite_${Date.now()}` : undefined,
    }))

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to create client",
      }
    }

    let invitationToken = result.data?.invitationToken

    // If API didn't return a token but we need to send invite, generate one
    if (input.sendInvite && !invitationToken) {
      const tokenResult = await generateInvitationToken(input.email, input.brokerId, result.data?.id)
      if (tokenResult.success && tokenResult.data) {
        invitationToken = tokenResult.data.token
        console.log("[v0] Generated invitation link: /onboard/" + invitationToken)
      }
    }

    revalidatePath("/broker/clients")
    return { success: true, clientId: result.data?.id, invitationToken }
  } catch (error) {
    console.error("[v0] Error creating client:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Get client by ID with full onboarding data
 */
export async function getClient(clientId: string): Promise<{
  success: boolean
  data?: {
    client: Client
    property: Property
    broker: {
      firstName: string
      lastName: string
      companyName: string
    }
    preSelectedAlerts: AlertConfig[]
  }
  error?: string
}> {
  try {
    const result = await apiClient.get<{
      client: Client
      property: Property
      broker: {
        firstName: string
        lastName: string
        companyName: string
      }
      preSelectedAlerts: AlertConfig[]
    }>(`/clients/${clientId}/onboarding-data`, () => ({
      client: {
        id: clientId,
        email: "client@example.com",
        firstName: "John",
        lastName: "Doe",
        phone: "(555) 123-4567",
        role: "client" as const,
        brokerId: "broker_123",
        onboardingStatus: "invited" as const,
        invitedAt: new Date().toISOString(),
        provider: "credentials" as const,
        iconUrl: undefined,
        creditScore: "excellent",
      },
      property: {
        id: "property_123",
        userId: clientId,
        address: "123 Main Street",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        propertyPrice: 750000,
        originalLoanAmount: 600000,
        loanBalance: 550000,
        interestRate: 4.5,
        termLength: 30,
        monthlyPayment: 3040,
        loanStartDate: "2020-01-01",
        creditScore: "excellent",
        createdAt: new Date().toISOString(),
      },
      broker: {
        firstName: "Jane",
        lastName: "Smith",
        companyName: "Premier Mortgage Solutions",
      },
      preSelectedAlerts: [
        {
          templateId: "monthly-savings",
          inputs: { amount: 150 },
          loanTerms: [30, 15],
        },
        {
          templateId: "break-even",
          inputs: { months: 24 },
          loanTerms: [30, 15],
        },
        {
          templateId: "rate-improvement",
          inputs: { improvement: 1 },
          loanTerms: [30, 15],
        },
      ],
    }))

    if (!result.success) {
      return { success: false, error: result.error || "Client not found" }
    }

    return { success: true, data: result.data }
  } catch (error) {
    console.error("[v0] Error fetching client:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Reinvite client
 */
export async function reinviteClient(clientId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await apiClient.post(`/clients/${clientId}/reinvite`, {}, () => {
      return { success: true }
    })

    if (!result.success) {
      return { success: false, error: result.error || "Client not found" }
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error fetching client:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Update client information
 */
export async function updateClient(
  clientId: string,
  input: UpdateClientInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await apiClient.patch(`/clients/${clientId}`, input, () => ({ success: true }))

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to update client",
      }
    }

    revalidatePath("/broker/clients")
    revalidatePath(`/broker/clients/${clientId}`)
    return { success: true }
  } catch (error) {
    console.error("[v0] Error updating client:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Delete client
 */
export async function deleteClient(clientId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await apiClient.delete(`/clients/${clientId}`)

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to delete client",
      }
    }

    revalidatePath("/broker/clients")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting client:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
