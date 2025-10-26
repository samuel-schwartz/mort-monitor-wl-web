"use server";

/**
 * Server actions for alert operations
 * Updated to handle per-alert subscription creation
 */

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api-client";
import { getMockPropertyAlerts } from "@/lib/mock-data";
import type { Alert, CreateAlertInput, UpdateAlertInput } from "@/types/api";

// Re-export types for backwards compatibility
export type { Alert, CreateAlertInput, UpdateAlertInput };

export type TemplateKind = string;

/**
 * Create a new alert with subscription
 */
export async function createAlert(input: CreateAlertInput): Promise<{
  success: boolean;
  alertId?: string;
  subscriptionId?: string;
  error?: string;
}> {
  try {
    const result = await apiClient.post<{ id: string; subscriptionId: string }>(
      "/alerts",
      input,
    );

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to create alert",
      };
    }

    revalidatePath(`/dash/loan/${input.propertyId}/alerts`);
    revalidatePath("/dash/account");
    return {
      success: true,
      alertId: result.data?.id,
      subscriptionId: result.data?.subscriptionId,
    };
  } catch (error) {
    console.error("[v0] Error creating alert:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Get all alerts for a property
 */
export async function getPropertyAlerts(
  propertyId: string,
): Promise<{ success: boolean; alerts?: Alert[]; error?: string }> {
  try {
    const result = await apiClient.get<Alert[]>(
      `/properties/${propertyId}/alerts`,
      () => getMockPropertyAlerts(propertyId),
    );

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to fetch alerts",
      };
    }

    return { success: true, alerts: result.data || [] };
  } catch (error) {
    console.error("[v0] Error fetching alerts:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Update an alert
 */
export async function updateAlert(
  alertId: string,
  propertyId: string,
  input: UpdateAlertInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await apiClient.patch(`/alerts/${alertId}`, input);

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to update alert",
      };
    }

    revalidatePath(`/dash/loan/${propertyId}/alerts`);
    return { success: true };
  } catch (error) {
    console.error("[v0] Error updating alert:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Delete an alert
 */
export async function deleteAlert(
  alertId: string,
  propertyId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const result = await apiClient.delete(`/alerts/${alertId}`);

    if (!result.success) {
      return {
        success: false,
        error: result.error || "Failed to delete alert",
      };
    }

    revalidatePath(`/dash/loan/${propertyId}/alerts`);
    return { success: true };
  } catch (error) {
    console.error("[v0] Error deleting alert:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
}

/**
 * Get all alerts for a property (alias for getPropertyAlerts)
 */
export async function getAlertsByProperty(
  propertyId: string,
): Promise<{ success: boolean; alerts?: Alert[]; error?: string }> {
  return getPropertyAlerts(propertyId);
}
