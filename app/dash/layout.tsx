import type React from "react"
import { DashboardNav } from "./_components/dashboard-nav"
import { getCurrentUser } from "@/app/actions/auth"
import { getUserProperties } from "@/app/actions/properties"
import { getBroker } from "@/app/actions/brokers"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userResult = await getCurrentUser()
  const user = userResult.success ? userResult.user : null

  let properties = []
  let broker = null

  if (user) {
    const propertiesResult = await getUserProperties(user.id)
    properties = propertiesResult.success ? propertiesResult.data || [] : []

    if (user.brokerId) {
      const brokerResult = await getBroker(user.brokerId)
      broker = brokerResult.success ? brokerResult.data : null
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardNav user={user} properties={properties} broker={broker} />
      <div className="lg:ml-64">
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
