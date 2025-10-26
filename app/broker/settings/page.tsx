import { getBroker } from "@/app/_actions/brokers"
import { BrokerSettingsForm } from "./_components/broker-settings-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage your brokerage settings",
}


export default async function BrokerSettingsPage(){

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b pb-4">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your brokerage information and preferences</p>
      </div>

      <BrokerSettingsForm />
    </div>
  )
}
