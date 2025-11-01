"use server";

/**
 * Server actions for broker operations
 */

import { revalidatePath } from "next/cache";
import { apiClient } from "@/lib/api-client";
import {
  getMockBroker,
  getMockBrokerClients,
  MOCK_BROKERS,
} from "@/lib/mock-data";
import {
  createSuccessResponse,
  createErrorResponse,
  validateInput,
  type ApiResponse,
} from "@/lib/utils/error-handler";
import {
  brokerUpdateSchema,
  type BrokerInput,
  type BrokerUpdateInput,
} from "@/lib/validation/schemas";
import type { Broker, BrokerAnalytics, ClientSummary } from "@/types/_models";

/**
 * Create a new broker account (admin only)
 */
export async function createBroker(
  input: BrokerInput & { logoFile?: File },
): Promise<ApiResponse<{ brokerId: string }>> {
  return createSuccessResponse({ brokerId: `broker_${Date.now()}` });
  // Do this later
  try {
    const formData = new FormData();
    formData.append("companyName", input.companyName);
    formData.append("brandColor", input.brandColor || "#3b82f6");
    formData.append("emails", input.emails);

    if (input.logoFile) {
      formData.append("logo", input.logoFile);
    }

    const response = await fetch(`${process.env.API_BASE_URL || ""}/brokers`, {
      method: "POST",
      body: formData,
    });

    console.log(response);
    console.log(await response.json());
    if (!response.ok) {
      return createErrorResponse("Failed to create broker");
    }

    const result = await response.json();

    revalidatePath("/admin/brokers");
    return createSuccessResponse({
      brokerId: result.id || `broker_${Date.now()}`,
    });
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message);
    }
    return createErrorResponse("An unexpected error occurred");
  }
}

/**
 * Get broker by ID
 */
export async function getBroker(
  brokerId: string,
): Promise<ApiResponse<Broker>> {
  try {
    const result = await apiClient.get<Broker>(`/brokers/${brokerId}`, () =>
      getMockBroker(brokerId),
    );

    if (!result.success) {
      return createErrorResponse(result.error || "Broker not found");
    }

    return createSuccessResponse(result.data!);
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message);
    }
    return createErrorResponse("An unexpected error occurred");
  }
}

/**
 * Get all brokers (admin only)
 */
export async function getAllBrokers(): Promise<ApiResponse<Broker[]>> {
  try {
    const result = await apiClient.get<Broker[]>(
      "/brokers",
      () => MOCK_BROKERS,
    );

    if (!result.success) {
      return createErrorResponse(result.error || "Failed to fetch brokers");
    }

    return createSuccessResponse(result.data || []);
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message);
    }
    return createErrorResponse("An unexpected error occurred");
  }
}

/**
 * Update broker information
 */
export async function updateBroker(
  brokerId: string,
  input: BrokerUpdateInput,
): Promise<ApiResponse<void>> {
  try {
    const validation = await validateInput(brokerUpdateSchema, input);
    if (!validation.success) {
      return validation.error;
    }

    const validatedInput = validation.data;

    const result = await apiClient.patch(
      `/brokers/${brokerId}`,
      validatedInput,
      () => {},
    );

    if (!result.success) {
      return createErrorResponse(result.error || "Failed to update broker");
    }

    revalidatePath("/broker/settings");
    return createSuccessResponse(undefined);
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message);
    }
    return createErrorResponse("An unexpected error occurred");
  }
}

/**
 * Delete broker account (admin only)
 */
export async function deleteBroker(
  brokerId: string,
): Promise<ApiResponse<void>> {
  try {
    const result = await apiClient.delete(`/brokers/${brokerId}`);

    if (!result.success) {
      return createErrorResponse(result.error || "Failed to delete broker");
    }

    revalidatePath("/admin/brokers");
    return createSuccessResponse(undefined);
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message);
    }
    return createErrorResponse("An unexpected error occurred");
  }
}
/**
 * Get client summaries for broker dashboard
 */
export async function getBrokerClients(
  brokerId: string,
): Promise<ApiResponse<ClientSummary[]>> {
  try {
    const result = await apiClient.get<ClientSummary[]>(
      `/brokers/${brokerId}/clients`,
      () => getMockBrokerClients(),
    );

    if (!result.success) {
      return createErrorResponse(result.error || "Failed to fetch clients");
    }

    return createSuccessResponse(result.data || []);
  } catch (error) {
    if (error instanceof Error) {
      return createErrorResponse(error.message);
    }
    return createErrorResponse("An unexpected error occurred");
  }
}
