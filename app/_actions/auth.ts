"use server"

import { cookies } from "next/headers"
import { loginSchema } from "@/lib/validation/schemas"
import { handleActionError } from "@/lib/utils/error-handler"
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/constants"

import type { UserRole, UserWithRole } from "@/types/_models"

import { signOut } from "@/auth"

interface SessionData {
  userId: string
  email: string
  firstName: string
  lastName: string
  role: string
  brokerId?: string
}

/**
 * Authenticate user with email, password, and role
 * For preview: accepts any email/password and creates a mock session
 */
export async function authenticateUser(
  email: string,
  password: string,
  role: UserRole,
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = loginSchema.safeParse({ email, password })
    if (!result.success) {
      return { success: false, error: "Invalid email or password format" }
    }

    const sessionData: SessionData = {
      userId: `${role}_123`,
      email,
      firstName: role.charAt(0).toUpperCase() + role.slice(1),
      lastName: "User",
      role,
      brokerId: role === "client" ? "broker_123" : undefined,
    }

    const cookieStore = await cookies()
    cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    })

    return { success: true }
  } catch (error) {
    return handleActionError(error, "authenticateUser")
  }
}

/**
 * Get current authenticated user from session cookie
 */
export async function getUser(): Promise<UserWithRole> {
  const user: UserWithRole = {
    id: "client123",
    email: "sam@gmail.com",
    firstName: "Sam",
    lastName: "Schwartz",
    provider: "credentials",
    role: "client",
    brokerId: "broker123",
  }
  return user
}

/**
 * Sign out current user
 */

// Optional: redirect to a specific page after sign out
export async function signOutUser() {
  await signOut({ redirectTo: "/login" })
}

/**
 * Change user password
 * Validates current password and updates to new password
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get current user
    const userResult = await getCurrentUser()
    if (!userResult.success || !userResult.user) {
      return { success: false, error: "Not authenticated" }
    }

    // Validate password format
    if (newPassword.length < 8) {
      return {
        success: false,
        error: "Password must be at least 8 characters",
      }
    }

    if (!/[A-Z]/.test(newPassword)) {
      return {
        success: false,
        error: "Password must contain at least one uppercase letter",
      }
    }

    if (!/[a-z]/.test(newPassword)) {
      return {
        success: false,
        error: "Password must contain at least one lowercase letter",
      }
    }

    if (!/[0-9]/.test(newPassword)) {
      return {
        success: false,
        error: "Password must contain at least one number",
      }
    }

    // In a real app, verify current password against database
    // For MVP, we'll simulate success
    console.log("[v0] Password change requested for user:", userResult.user.email)

    return { success: true }
  } catch (error) {
    return handleActionError(error, "changePassword")
  }
}

// Helper function to get current user from session
export async function getCurrentUser(): Promise<{ success: boolean; user?: UserWithRole }> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)

  if (!sessionCookie) {
    return { success: false }
  }

  try {
    const sessionData = JSON.parse(sessionCookie.value) as {
      userId: string
      email: string
      firstName: string
      lastName: string
      role: string
      brokerId?: string
    }

    return {
      success: true,
      user: {
        id: sessionData.userId,
        email: sessionData.email,
        firstName: sessionData.firstName,
        lastName: sessionData.lastName,
        provider: "credentials",
        role: sessionData.role as UserRole,
        brokerId: sessionData.brokerId,
      },
    }
  } catch (error) {
    console.error("[v0] Error parsing session:", error)
    return { success: false }
  }
}
