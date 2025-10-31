/**
 * Centralized API client with automatic mock mode fallback
 * Switches between real API calls and mock data based on API_BASE_URL configuration
 */

import { env } from "@/lib/env"

/**
 * Check if we're in mock mode (API not configured)
 */
function isMockMode(): boolean {
  return !env.API_BASE_URL || env.API_BASE_URL == "mock"
}

/**
 * Get standard API headers for authenticated requests
 */
function getApiHeaders(includeContentType = false): HeadersInit {
  const headers: HeadersInit = {
    Authorization: `Bearer ${env.API_SECRET_KEY}`,
  }

  if (includeContentType) {
    headers["Content-Type"] = "application/json"
  }

  return headers
}

/**
 * Centralized API client that automatically falls back to mock mode
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  mockResponse?: () => T,
): Promise<{ success: boolean; data?: T; error?: string }> {
  // If in mock mode, return mock response immediately
  if (isMockMode()) {
    if (!mockResponse) {
      console.log("[v0] Mock mode: No mock response provided for", endpoint)
      return { success: false, error: "Mock response not implemented" }
    }

    console.log("[v0] Mock mode:", options.method || "GET", endpoint)
    try {
      const data = mockResponse()
      return { success: true, data }
    } catch (error) {
      console.error("[v0] Mock mode error:", error)
      return { success: false, error: "Mock response failed" }
    }
  }

  // Real API mode
  try {
    const url = `${env.API_BASE_URL}${endpoint}`
    const headers = {
      ...getApiHeaders(true),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
      cache: options.cache || "no-store",
    })

    if (!response.ok) {
      const errorText = await response.text()
      let errorMessage = `API error: ${response.status} ${response.statusText}`

      try {
        const errorJson = JSON.parse(errorText)
        errorMessage = errorJson.message || errorMessage
      } catch {
        // Not JSON, use status text
      }

      // If API fails and we have a mock response, fall back to it
      if (mockResponse) {
        console.log("[v0] API failed, falling back to mock mode:", errorMessage)
        const data = mockResponse()
        return { success: true, data }
      }

      return { success: false, error: errorMessage }
    }

    const contentType = response.headers.get("content-type")
    if (contentType?.includes("application/json")) {
      const data = await response.json()
      return { success: true, data }
    }

    // No content response (e.g., DELETE)
    return { success: true, data: undefined as T }
  } catch (error) {
    console.error("[v0] API call failed:", error)

    // Fall back to mock if available
    if (mockResponse) {
      console.log("[v0] Network error, falling back to mock mode")
      const data = mockResponse()
      return { success: true, data }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    }
  }
}

/**
 * Convenience methods for common HTTP verbs
 */
export const apiClient = {
  get: <T>(endpoint: string, mockResponse?: () => T) => 
    apiCall<T>(endpoint, { method: "GET" }, mockResponse),

  post: <T>(endpoint: string, body: unknown, mockResponse?: () => T) =>
    apiCall<T>(endpoint, { method: "POST", body: JSON.stringify(body) }, mockResponse),

  patch: <T>(endpoint: string, body: unknown, mockResponse?: () => T) =>
    apiCall<T>(endpoint, { method: "PATCH", body: JSON.stringify(body) }, mockResponse),

  delete: <T>(endpoint: string, mockResponse?: () => T) => 
    apiCall<T>(endpoint, { method: "DELETE" }, mockResponse),
}
