import { getBroker } from "@/app/actions/brokers"
import { BrokerSettingsForm } from "./_components/broker-settings-form"
import type { Metadata } from "next"
import { getCurrentBrokerId } from "@/lib/session"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your brokerage settings",
}

export default async function BrokerSettingsPage() {
  const brokerId = await getCurrentBrokerId()
  const brokerResult = await getBroker(brokerId)

  const broker = brokerResult.success ? brokerResult.data : null

  if (!broker) {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your brokerage information and preferences</p>
        </div>
        <div className="border rounded-lg p-6">
          <p className="text-muted-foreground">Unable to load settings</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your brokerage information and preferences</p>
      </div>

      <BrokerSettingsForm broker={broker} />
    </div>
  )
}
