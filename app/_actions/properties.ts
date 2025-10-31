"use server"

/**
 * Server actions for property/loan operations
 */

import { revalidatePath } from "next/cache"
import { apiClient } from "@/lib/api-client"
import { getMockProperty, getMockUserProperties } from "@/lib/mock-data"
import { createSuccessResponse, createErrorResponse, validateInput, type ApiResponse } from "@/lib/utils/error-handler"
import {
  propertySchema,
  propertyUpdateSchema,
  type PropertyInput,
  type PropertyUpdateInput,
} from "@/lib/validation/schemas"
import type { Property } from "@/types/api"

/**
 * Create a new property
 */
export async function createProperty(input: PropertyInput): Promise<ApiResponse<{ propertyId: string }>> {
  try {
    const userId = input.userId || "user_123"

    const validation = await validateInput(propertySchema, input)
    if (!validation.success) {
      return validation.error
    }

    const validatedInput = validation.data

    const result = await apiClient.post<{ id: string }>(
      "/properties",
      {
        ...validatedInput,
        userId,
      },
      () => ({
        id: `property_${Date.now()}`,
        userId,
        address: validatedInput.address,
        propertyPrice: validatedInput.propertyPrice,
        originalLoanAmount: validatedInput.originalLoanAmount,
        loanBalance: validatedInput.currentBalance,
        interestRate: validatedInput.interestRate,
        termLength: validatedInput.termLength,
        monthlyPayment: validatedInput.monthlyPayment,
        loanStartDate: `${validatedInput.startYear}-${String(validatedInput.startMonth).padStart(2, "0")}-01`,
        creditScore: validatedInput.creditScore,
        createdAt: new Date().toISOString(),
      }),
    )

    if (!result.success) {
      return createErrorResponse(result.error || "Failed to create property")
    }

    revalidatePath("/dash")
    return createSuccessResponse({
      propertyId: result.data?.id || `property_${Date.now()}`,
    })
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message)
    }
    return createErrorResponse("An unexpected error occurred")
  }
}

/**
 * Get all properties for a user
 */
export async function getUserProperties(userId: string): Promise<ApiResponse<Property[]>> {
  try {
    const result = await apiClient.get<Property[]>(`/users/${userId}/properties`, () => getMockUserProperties(userId))

    if (!result.success) {
      return createErrorResponse(result.error || "Failed to fetch properties")
    }

    return createSuccessResponse(result.data || [])
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message)
    }
    return createErrorResponse("An unexpected error occurred")
  }
}

/**
 * Get all properties for a user (alias for getUserProperties)
 */
async function getPropertiesByUser(userId: string): Promise<ApiResponse<Property[]>> {
  return getUserProperties(userId)
}

/**
 * Get a single property by ID
 */
async function getProperty(propertyId: string): Promise<ApiResponse<Property>> {
  try {
    const result = await apiClient.get<Property>(`/properties/${propertyId}`, () => getMockProperty(propertyId))

    if (!result.success) {
      return createErrorResponse(result.error || "Property not found")
    }

    return createSuccessResponse(result.data!)
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message)
    }
    return createErrorResponse("An unexpected error occurred")
  }
}

/**
 * Update property information
 */
export async function updateProperty(propertyId: string, input: PropertyUpdateInput): Promise<ApiResponse<void>> {
  try {
    const validation = await validateInput(propertyUpdateSchema, input)
    if (!validation.success) {
      return validation.error
    }

    const validatedInput = validation.data

    const result = await apiClient.patch(`/properties/${propertyId}`, validatedInput, () => ({ success: true }))

    if (!result.success) {
      return createErrorResponse(result.error || "Failed to update property")
    }

    revalidatePath(`/dash/loan/${propertyId}`)
    revalidatePath(`/dash/loan/${propertyId}/details`)
    return createSuccessResponse(undefined)
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message)
    }
    return createErrorResponse("An unexpected error occurred")
  }
}

/**
 * Delete a property
 */
async function deleteProperty(propertyId: string): Promise<ApiResponse<void>> {
  try {
    const result = await apiClient.delete(`/properties/${propertyId}`)

    if (!result.success) {
      return createErrorResponse(result.error || "Failed to delete property")
    }

    revalidatePath("/dash")
    return createSuccessResponse(undefined)
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message)
    }
    return createErrorResponse("An unexpected error occurred")
  }
}
