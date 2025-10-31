"use server"

/**
 * Server actions for user operations
 * These actions call third-party RESTful endpoints that are only accessible from the server
 */

import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { apiClient } from "@/lib/api-client"
import { getMockUser, getMockUpdatedUser } from "@/lib/mock-data"
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/constants"
import { validateToken } from "./tokens"
import type { User, CreateUserInput, UpdateUserInput } from "@/types/api"

// Re-export types for backwards compatibility


interface SessionData {
  userId: string
  email: string
  firstName: string
  lastName: string
  role: string
  brokerId?: string
}

/**
 * Create a new user account
 */
async function createUser(
  input: CreateUserInput,
): Promise<{ success: boolean; userId?: string; error?: string }> {
  const result = await apiClient.post<{ id: string }>("/users", input, () => ({ id: `user_${Date.now()}` }))

  if (!result.success) {
    return { success: false, error: result.error }
  }

  return { success: true, userId: result.data?.id }
}

/**
 * Get user by ID
 */
async function getUser(userId: string): Promise<{ success: boolean; user?: User; error?: string }> {
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
async function authenticateUser(
  email: string,
  password: string,
): Promise<{ success: boolean; userId?: string; error?: string }> {
  const result = await apiClient.post<{ userId: string }>("/auth/login", {
    email,
    password,
  })

  if (!result.success) {
    return { success: false, error: result.error || "Invalid credentials" }
  }

  return { success: true, userId: result.data?.userId }
}

const loginUser = authenticateUser

/**
 * Authenticate user with Google OAuth during invitation acceptance
 * Creates a session cookie after successful authentication
 */
export async function authenticateWithGoogle(
  invitationToken: string,
): Promise<{ success: boolean; userId?: string; error?: string }> {
  try {
    const tokenResult = await validateToken(invitationToken, "invite")
    if (!tokenResult.success || !tokenResult.data) {
      return { success: false, error: "Invalid invitation token" }
    }

    const tokenData = tokenResult.data

    const result = await apiClient.post<{ userId: string }>("/auth/google", { token: invitationToken }, () => ({
      userId: tokenData.clientId || `user_google_${Date.now()}`,
    }))

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Google authentication failed",
      }
    }

    const sessionData: SessionData = {
      userId: result.data!.userId,
      email: tokenData.email || "user@example.com",
      firstName: tokenData.firstName || "User",
      lastName: tokenData.lastName || "Name",
      role: tokenData.role || "client",
      brokerId: tokenData.brokerId,
    }

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    })

    return { success: true, userId: result.data?.userId }
  } catch (error) {
    console.error("[v0] Error in authenticateWithGoogle:", error)
    return {
      success: false,
      error: "An unexpected error occurred during Google authentication",
    }
  }
}
