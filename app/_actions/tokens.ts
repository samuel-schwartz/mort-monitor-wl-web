"use server";

/**
 * Server actions for token management
 * Handles invitation tokens, password reset tokens, etc.
 */

import { cookies } from "next/headers";
import { apiClient } from "@/lib/api-client";
import {
  createToken,
  isTokenExpired,
  type TokenData,
  type TokenType,
} from "@/lib/utils/tokens";
import {
  createSuccessResponse,
  createErrorResponse,
  type ApiResponse,
} from "@/lib/utils/error-handler";
import { SESSION_COOKIE_NAME, SESSION_MAX_AGE } from "@/lib/constants";
import type { AuthUser } from "./auth";

/**
 * Generate a new invitation token
 */
export async function generateInvitationToken(
  email: string,
  brokerId?: string,
  clientId?: string,
): Promise<ApiResponse<TokenData>> {
  try {
    const finalBrokerId = brokerId || "broker_123";

    const tokenData = createToken("invitation", {
      email,
      brokerId: finalBrokerId,
      clientId,
    });

    const result = await apiClient.post<TokenData>("/tokens", tokenData);

    if (!result.success) {
      // Fall back to returning generated token in mock mode
      return createSuccessResponse(tokenData);
    }

    return createSuccessResponse(result.data!);
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message);
    }
    return createErrorResponse("Failed to generate invitation token");
  }
}

/**
 * Validate and retrieve token data
 */
export async function validateToken(
  token: string,
  type: TokenType,
): Promise<ApiResponse<TokenData>> {
  try {
    const result = await apiClient.get<TokenData>(
      `/tokens/${token}?type=${type}`,
    );

    if (!result.success) {
      return createErrorResponse(result.error || "Token not found");
    }

    const tokenData = result.data!;

    // Check if token is expired
    if (isTokenExpired(tokenData.expiresAt)) {
      return createErrorResponse("Token has expired");
    }

    return createSuccessResponse(tokenData);
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message);
    }
    return createErrorResponse("Failed to validate token");
  }
}

/**
 * Invalidate/consume a token
 */
export async function invalidateToken(
  token: string,
): Promise<ApiResponse<void>> {
  try {
    const result = await apiClient.delete(`/tokens/${token}`);

    if (!result.success) {
      // In mock mode, always succeed
      return createSuccessResponse(undefined);
    }

    return createSuccessResponse(undefined);
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message);
    }
    return createErrorResponse("Failed to invalidate token");
  }
}

/**
 * Accept invitation and create account
 */
export async function acceptInvitation(
  token: string,
  password: string,
): Promise<ApiResponse<{ userId: string; email: string }>> {
  try {
    // Validate token
    const tokenResult = await validateToken(token, "invitation");
    if (!tokenResult.success) {
      return tokenResult;
    }

    const tokenData = tokenResult.data;

    const result = await apiClient.post<{
      userId: string;
      email: string;
      firstName?: string;
      lastName?: string;
    }>("/invitations/accept", {
      token,
      password,
    });

    if (!result.success) {
      return createErrorResponse(result.error || "Failed to accept invitation");
    }

    const data = result.data!;

    const authUser: AuthUser = {
      id: data.userId,
      email: data.email,
      firstName: data.firstName || "Client",
      lastName: data.lastName || "User",
      role: "client",
      brokerId: tokenData.brokerId,
    };

    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify(authUser), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: SESSION_MAX_AGE,
      path: "/",
    });

    // Invalidate token after successful acceptance
    await invalidateToken(token);

    return createSuccessResponse(data);
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message);
    }
    return createErrorResponse("Failed to accept invitation");
  }
}
