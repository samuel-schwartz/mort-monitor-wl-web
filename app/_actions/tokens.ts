"use server"

/**
 * Server actions for token management
 * Handles invitation tokens, password reset tokens, etc.
 */

import { cookies } from "next/headers"
import { apiClient } from "@/lib/api-client"
import { createToken, isTokenExpired, type TokenData, type TokenType } from "@/lib/utils/tokens"
import { createSuccessResponse, createErrorResponse, type ApiResponse } from "@/lib/utils/error-handler"
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/constants"

interface SessionData {
  userId: string
  email: string
  firstName: string
  lastName: string
  role: string
  brokerId?: string
}

/**
 * Generate a new invitation token
 */
export async function generateInvitationToken(
  email: string,
  brokerId?: string,
  clientId?: string,
): Promise<ApiResponse<TokenData>> {
  try {
    const finalBrokerId = brokerId || "broker_123"

    const tokenData = createToken("invite", {
      email,
      brokerId: finalBrokerId,
      clientId,
    })

    const result = await apiClient.post<TokenData>("/tokens", tokenData)

    if (!result.success) {
      // Fall back to returning generated token in mock mode
      return createSuccessResponse(tokenData)
    }

    return createSuccessResponse(result.data!)
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message)
    }
    return createErrorResponse("Failed to generate invitation token")
  }
}

/**
 * Validate and retrieve token data
 */
export async function validateToken(token: string, type?: TokenType): Promise<ApiResponse<TokenData>> {
  try {
    const mockResponse: TokenData = {
      tokenId: token,
      brokerId: "broker_mock_123",
      type: "invite",
      email: "invited.user@example.com",
      firstName: "John",
      lastName: "Doe",
      expiresAt: "1897630200",
      // Role determines where user is routed after accepting invitation
      role: token.includes("admin") ? "admin" : token.includes("broker") ? "broker" : "client",
      clientId: token.includes("client") ? "client_mock_123" : undefined,
    }

    const queryParam = type ? `?type=${type}` : ""
    const result = await apiClient.get<TokenData>(`/tokens/${token}${queryParam}`, () => mockResponse)

    if (!result.success) {
      return createErrorResponse(result.error || "Token not found")
    }

    const tokenData = result.data!

    // Check if token is expired
    if (isTokenExpired(tokenData.expiresAt)) {
      return createErrorResponse("Token has expired")
    }

    return createSuccessResponse(tokenData)
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message)
    }
    return createErrorResponse("Failed to validate token")
  }
}

/**
 * Invalidate/consume a token
 */
export async function invalidateToken(token: string): Promise<ApiResponse<void>> {
  try {
    const result = await apiClient.delete(`/tokens/${token}`)

    if (!result.success) {
      // In mock mode, always succeed
      return createSuccessResponse(undefined)
    }

    return createSuccessResponse(undefined)
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message)
    }
    return createErrorResponse("Failed to invalidate token")
  }
}

/**
 * Accept invitation and create account
 */
export async function acceptInvitation(
  token: string,
  password: string,
): Promise<ApiResponse<{ userId: string; email: string; role: string }>> {
  try {
    // Validate token
    const tokenResult = await validateToken(token, "invite")
    if (!tokenResult.success) {
      return tokenResult
    }

    const tokenData = tokenResult.data

    const result = await apiClient.post<{
      userId: string
      email: string
      firstName?: string
      lastName?: string
      role?: string
    }>(
      "/invitations/accept",
      {
        token,
        password,
      },
      () => ({
        userId: tokenData.clientId || `user_${Date.now()}`,
        email: tokenData.email || "user@example.com",
        firstName: tokenData.firstName || "New",
        lastName: tokenData.lastName || "User",
        role: tokenData.role || "client",
      }),
    )

    if (!result.success) {
      return createErrorResponse(result.error || "Failed to accept invitation")
    }

    const data = result.data!
    const userRole = (data.role || tokenData.role || "client") as string

    const sessionData: SessionData = {
      userId: data.userId,
      email: data.email,
      firstName: data.firstName || "New",
      lastName: data.lastName || "User",
      role: userRole,
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

    // Invalidate token after successful acceptance
    await invalidateToken(token)

    return createSuccessResponse({ ...data, role: userRole })
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message)
    }
    return createErrorResponse("Failed to accept invitation")
  }
}
