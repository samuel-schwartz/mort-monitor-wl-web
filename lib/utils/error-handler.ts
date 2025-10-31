/**
 * Centralized error handling utilities
 * Provides consistent error responses across the application
 */

import { ZodError } from "zod"

type ErrorResponse = {
  success: false
  error: string
  details?: Record<string, string[]>
}

type SuccessResponse<T = unknown> = {
  success: true
  data: T
}

export type ApiResponse<T = unknown> = SuccessResponse<T> | ErrorResponse

/**
 * Handle Zod validation errors
 */
function handleValidationError(error: ZodError): ErrorResponse {
  const details: Record<string, string[]> = {}

  error.errors.forEach((err) => {
    const path = err.path.join(".")
    if (!details[path]) {
      details[path] = []
    }
    details[path].push(err.message)
  })

  return {
    success: false,
    error: "Validation failed",
    details,
  }
}

/**
 * Handle generic errors
 */
function handleError(error: unknown): ErrorResponse {
  if (error instanceof ZodError) {
    return handleValidationError(error)
  }

  if (error instanceof Error) {
    return {
      success: false,
      error: error.message,
    }
  }

  return {
    success: false,
    error: "An unexpected error occurred",
  }
}

/**
 * Handle errors in server actions with context
 */
export function handleActionError(error: unknown, actionName: string): ErrorResponse {
  console.error(`[${actionName}] Error:`, error)
  return handleError(error)
}

/**
 * Create success response
 */
export function createSuccessResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
  }
}

/**
 * Create error response
 */
export function createErrorResponse(error: string, details?: Record<string, string[]>): ErrorResponse {
  return {
    success: false,
    error,
    details,
  }
}

/**
 * Validate input with Zod schema
 */
export async function validateInput<T>(
  schema: { parseAsync: (data: unknown) => Promise<T> },
  data: unknown,
): Promise<{ success: true; data: T } | { success: false; error: ErrorResponse }> {
  try {
    const validated = await schema.parseAsync(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, error: handleValidationError(error) }
    }
    return { success: false, error: handleError(error) }
  }
}
