import type React from "react"
import { BrokerNav } from "./_components/broker-nav"
import { getBroker } from "@/app/actions/brokers"

export default async function BrokerLayout({
  children,
  searchParams,
}: {
  children: React.ReactNode
  searchParams?: Promise<{ viewAsBroker?: string }>
}) {
  const params = searchParams ? await searchParams : {}
  const viewAsBroker = params?.viewAsBroker

  const brokerId = viewAsBroker || "broker_123"
  const brokerResult = await getBroker(brokerId)
  const broker = brokerResult.success ? brokerResult.data : null

  console.log("[v0] BrokerLayout - viewAsBroker:", viewAsBroker)
  console.log("[v0] BrokerLayout - brokerId:", brokerId)

  return (
    <div>
      <BrokerNav broker={broker} isAdminView={!!viewAsBroker} brokerId={brokerId} />
      <main className="p-4 sm:p-6 lg:p-10 lg:pl-72">{children}</main>
    </div>
  )
}
