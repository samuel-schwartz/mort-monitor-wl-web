"use server"

import { getCurrentUser } from "@/app/actions/auth"
import { redirect } from "next/navigation"

/**
 * Get the current user's ID from session
 * Redirects to login if not authenticated
 */
export async function getCurrentUserId(): Promise<string> {
  const result = await getCurrentUser()

  if (!result.success || !result.user) {
    redirect("/login")
  }

  return result.user.id
}

/**
 * Get the current broker's ID from session
 * Redirects to login if not authenticated or not a broker
 */
export async function getCurrentBrokerId(): Promise<string> {
  const result = await getCurrentUser()

  if (!result.success || !result.user) {
    redirect("/login")
  }

  if (result.user.role !== "broker" && result.user.role !== "admin") {
    redirect("/login")
  }

  return result.user.id
}
