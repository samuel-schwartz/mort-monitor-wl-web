"use server"

/**
 * Server actions for client operations (broker managing clients)
 */

import { revalidatePath } from "next/cache"
import { apiClient } from "@/lib/api-client"
import { generateInvitationToken } from "./tokens"
import type { CreateClientInput, UpdateClientInput, ClientResponse } from "@/types/api"

/**
 * Create a new client (broker action)
 */
export async function createClient(
  input: CreateClientInput,
): Promise<{ success: boolean; clientId?: string; invitationToken?: string; error?: string }> {
  try {
    const result = await apiClient.post<{ id: string; invitationToken?: string }>("/clients", input)

    if (!result.success) {
      return { success: false, error: result.error || "Failed to create client" }
    }

    let invitationToken = result.data?.invitationToken

    // If API didn't return a token but we need to send invite, generate one
    if (input.sendInvite && !invitationToken) {
      const tokenResult = await generateInvitationToken(input.email, input.brokerId, result.data?.id)
      if (tokenResult.success && tokenResult.data) {
        invitationToken = tokenResult.data.token
        console.log("[v0] Generated invitation link: /onboard/invite/" + invitationToken)
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
 * Get client by ID
 */
export async function getClient(clientId: string): Promise<ClientResponse> {
  try {
    const result = await apiClient.get<ClientResponse["client"]>(`/clients/${clientId}`)

    if (!result.success) {
      return { success: false, error: result.error || "Client not found" }
    }

    return { success: true, client: result.data }
  } catch (error) {
    console.error("[v0] Error fetching client:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}

/**
 * Get client by ID
 */
export async function reinviteClient(clientId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await apiClient.post(`/clients/${clientId}/reinvite`, {}, ()=>{return {success: true}})

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
    const result = await apiClient.patch(`/clients/${clientId}`, input)

    if (!result.success) {
      return { success: false, error: result.error || "Failed to update client" }
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
      return { success: false, error: result.error || "Failed to delete client" }
    }

    revalidatePath("/broker/clients")
    return { success: true }
  } catch (error) {
    console.error("[v0] Error deleting client:", error)
    return { success: false, error: "An unexpected error occurred" }
  }
}
