/**
 * Token generation and validation utilities
 * Handles invitation tokens, password reset tokens, etc.
 */

import { TOKEN_EXPIRATION } from "@/lib/constants"

export type TokenType = "invite" | "password_reset" | "email_verification"

export type TokenData = {
  tokenId: string
  type: TokenType
  email?: string
  firstName?: string
  lastName?: string
  brokerId?: string
  clientId?: string
  expiresAt: string
  role?: "admin" | "broker" | "client"
}

/**
 * Generate a secure random token
 */
export function generateToken(): string {
  // In production, this would use a cryptographically secure method
  // For now, using a simple random string
  const array = new Uint8Array(32)
  if (typeof window !== "undefined" && window.crypto) {
    window.crypto.getRandomValues(array)
  } else {
    // Server-side fallback
    for (let i = 0; i < array.length; i++) {
      array[i] = Math.floor(Math.random() * 256)
    }
  }
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
}

/**
 * Create a new token with expiration
 */
export function createToken(
  type: TokenType,
  data: Partial<Omit<TokenData, "tokenId" | "type" | "expiresAt" | "createdAt">>,
): TokenData {
  const tokenId = generateToken()
  const createdAt = new Date().toISOString()

  let expirationTime: number
  switch (type) {
    case "invite":
      expirationTime = TOKEN_EXPIRATION.INVITATION
      break
    case "password_reset":
      expirationTime = TOKEN_EXPIRATION.PASSWORD_RESET
      break
    case "email_verification":
      expirationTime = TOKEN_EXPIRATION.EMAIL_VERIFICATION
      break
    default:
      expirationTime = TOKEN_EXPIRATION.INVITATION
  }

  const expiresAt = new Date(Date.now() + expirationTime).toISOString()

  return {
    tokenId,
    type,
    expiresAt,
    createdAt,
    ...data,
  }
}

/**
 * Validate if a token is expired
 */
export function isTokenExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() < Date.now()
}

/**
 * Get days until token expiration
 */
export function getDaysUntilExpiration(expiresAt: string): number {
  const expiresDate = new Date(expiresAt)
  const now = Date.now()
  const diff = expiresDate.getTime() - now

  if (diff <= 0) return 0

  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
