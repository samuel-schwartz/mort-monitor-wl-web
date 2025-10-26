"use server"

/**
 * Server actions for user operations
 * These actions call third-party RESTful endpoints that are only accessible from the server
 */

import { revalidatePath } from "next/cache"
import { apiClient } from "@/lib/api-client"
import { getMockUser, getMockUpdatedUser } from "@/lib/mock-data"
import type { User, CreateUserInput, UpdateUserInput } from "@/types/api"

// Re-export types for backwards compatibility
export type { User, CreateUserInput, UpdateUserInput }

/**
 * Create a new user account
 */
export async function createUser(
  input: CreateUserInput,
): Promise<{ success: boolean; userId?: string; error?: string }> {
  const result = await apiClient.post<{ id: string }>("/users", input)

  if (!result.success) {
    return { success: false, error: result.error }
  }

  return { success: true, userId: result.data?.id }
}

/**
 * Get user by ID
 */
export async function getUser(userId: string): Promise<{ success: boolean; user?: User; error?: string }> {
  const result = await apiClient.get<User>(`/users/${userId}`, () => getMockUser(userId))

  if (!result.success) {
    return { success: false, error: result.error }
  }

  return { success: true, user: result.data }
}

/**
 * Update user information
 */
export async function updateUser(
  userId: string,
  input: UpdateUserInput,
): Promise<{ success: boolean; error?: string }> {
  console.log("[v0] Updating user:", userId, input)

  const result = await apiClient.patch(`/users/${userId}`, input, () => getMockUpdatedUser(userId, input))

  if (!result.success) {
    console.log("[v0] Update user failed:", result.error)
    return { success: false, error: result.error }
  }

  console.log("[v0] Update user succeeded")
  revalidatePath("/dash/account")
  return { success: true }
}

/**
 * Authenticate user with email and password
 */
export async function authenticateUser(
  email: string,
  password: string,
): Promise<{ success: boolean; userId?: string; error?: string }> {
  const result = await apiClient.post<{ userId: string }>("/auth/login", { email, password })

  if (!result.success) {
    return { success: false, error: result.error || "Invalid credentials" }
  }

  return { success: true, userId: result.data?.userId }
}

export const loginUser = authenticateUser

/**
 * Authenticate user with Google OAuth
 */
export async function authenticateWithGoogle(
  googleToken: string,
): Promise<{ success: boolean; userId?: string; error?: string }> {
  const result = await apiClient.post<{ userId: string }>("/auth/google", { token: googleToken })

  if (!result.success) {
    return { success: false, error: result.error || "Google authentication failed" }
  }

  return { success: true, userId: result.data?.userId }
}
