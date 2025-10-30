"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AlertSelection from "@/components/onboard/alert-selection"
import { updateClient } from "@/app/_actions/clients"
import { toast } from "sonner"
import type { Client } from "@/types/models"
import type { AlertConfig } from "@/types/alerts"

interface AlertsClientProps {
  clientData: Client
  token: string
}

export default function AlertsClient({ clientData, token }: AlertsClientProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Initialize with pre-selected alerts from broker
  const [selectedAlerts, setSelectedAlerts] = useState<AlertConfig[]>(clientData.alerts || [])

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      // Update client with selected alerts
      const result = await updateClient(clientData.id, {
        alerts: selectedAlerts,
      })

      if (result.success) {
        toast.success("Alert preferences saved")
        router.push("/dash/welcome")
      } else {
        toast.error(result.error || "Failed to save alert preferences")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <AlertSelection
        mode="review"
        firstName={clientData.firstName}
        selectedAlerts={selectedAlerts}
        propertyPrice={clientData.property?.purchasePrice}
        currentBalance={clientData.property?.currentBalance}
        startMonth={clientData.property?.loanStartMonth}
        startYear={clientData.property?.loanStartYear}
        termLength={clientData.property?.termLength}
        onAlertsChange={setSelectedAlerts}
        onNext={handleComplete}
        isLoading={isLoading}
      />
    </div>
  )
}
