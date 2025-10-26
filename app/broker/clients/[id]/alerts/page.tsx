import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getClient } from "@/app/actions/clients"
import { getPropertiesByUser } from "@/app/actions/properties"
import { getAlertsByProperty } from "@/app/actions/alerts"
import { ClientAlertsView } from "./_components/client-alerts-view"
import { Skeleton } from "@/components/ui/skeleton"

export default async function BrokerClientAlertsPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const clientResult = await getClient(id)

  if (!clientResult.success || !clientResult.client) {
    notFound()
  }

  const propertiesResult = await getPropertiesByUser(id)
  const properties = propertiesResult.success ? propertiesResult.properties || [] : []

  // Get alerts for all properties
  const alertsPromises = properties.map((property) => getAlertsByProperty(property.id))
  const alertsResults = await Promise.all(alertsPromises)

  const propertiesWithAlerts = properties.map((property, index) => ({
    property,
    alerts: alertsResults[index].success ? alertsResults[index].alerts || [] : [],
  }))

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          Alerts for {clientResult.client.firstName} {clientResult.client.lastName}
        </h1>
        <p className="text-muted-foreground mt-2">View and manage all refinancing alerts for this client</p>
      </div>

      <Suspense fallback={<Skeleton className="h-96 w-full" />}>
        <ClientAlertsView client={clientResult.client} propertiesWithAlerts={propertiesWithAlerts} />
      </Suspense>
    </div>
  )
}
