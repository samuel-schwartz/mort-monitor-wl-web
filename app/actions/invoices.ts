"use server"

import { apiClient } from "@/lib/api-client"
import { getMockInvoices, getMockBrokerInvoices } from "@/lib/mock-data"
import { createSuccessResponse, createErrorResponse } from "@/lib/utils/error-handler"

type AdminInvoice = {
  id: string
  brokerId: string
  brokerName: string
  invoiceNumber: string
  description: string
  filename: string
  pdfUrl: string
  uploadedAt: string
}

export async function getAdminInvoices() {
  try {
    const result = await apiClient.get<AdminInvoice[]>("/admin/invoices", () => getMockInvoices())

    if (!result.success) {
      return createErrorResponse(result.error || "Failed to fetch invoices")
    }

    return createSuccessResponse(result.data || [])
  } catch (error) {
    console.error("[v0] Error fetching invoices:", error)
    return createErrorResponse("Failed to fetch invoices")
  }
}

export async function uploadInvoice(data: {
  brokerId: string
  brokerName: string
  invoiceNumber: string
  description: string
  filename: string
  pdfData: string
}) {
  try {
    const result = await apiClient.post<{ id: string }>("/invoices", data)

    if (!result.success) {
      return createErrorResponse(result.error || "Failed to upload invoice")
    }

    return createSuccessResponse({ id: result.data?.id || `inv_${Date.now()}` })
  } catch (error) {
    console.error("[v0] Error uploading invoice:", error)
    return createErrorResponse("Failed to upload invoice")
  }
}

export async function deleteInvoice(invoiceId: string) {
  try {
    const result = await apiClient.delete(`/invoices/${invoiceId}`)

    if (!result.success) {
      return createErrorResponse(result.error || "Failed to delete invoice")
    }

    return createSuccessResponse({ deleted: true })
  } catch (error) {
    console.error("[v0] Error deleting invoice:", error)
    return createErrorResponse("Failed to delete invoice")
  }
}

export async function getBrokerInvoices() {
  try {
    const result = await apiClient.get<AdminInvoice[]>("/broker/invoices", () => getMockBrokerInvoices())

    if (!result.success) {
      return createErrorResponse(result.error || "Failed to fetch invoices")
    }

    return createSuccessResponse(result.data || [])
  } catch (error) {
    console.error("[v0] Error fetching broker invoices:", error)
    return createErrorResponse("Failed to fetch invoices")
  }
}
