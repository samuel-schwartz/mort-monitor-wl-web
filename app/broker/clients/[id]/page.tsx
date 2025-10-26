import { getClient } from "@/app/actions/clients"
import { getUserProperties } from "@/app/actions/properties"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import type { Metadata } from "next"
import BrokerClientOnboardingPage from "../new/client-page"

export const metadata: Metadata = {
  title: "Client Details",
  description: "View and manage client information",
}

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
  if (params.id === "new") {
    return <BrokerClientOnboardingPage />
  }

  const clientResult = await getClient(params.id)

  if (!clientResult.success || !clientResult.client) {
    notFound()
  }

  const client = clientResult.client
  const propertiesResult = await getUserProperties(client.id)
  const properties = propertiesResult.success ? propertiesResult.data || [] : []

  if (properties.length >= 1) {
    redirect(`/dash?viewAsClient=${client.id}`)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {client.firstName} {client.lastName}
          </h1>
          <Link href={`/broker/clients/${client.id}/add-property`}>
            <Button>Add Property</Button>
          </Link>
        </div>
        <p className="text-gray-600 dark:text-gray-300">
          {client.email} • {client.phone || "No phone"} • Member since{" "}
          {new Date(client.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Properties</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {properties.length} {properties.length === 1 ? "property" : "properties"} tracked
            </p>
          </div>
        </div>

        <div className="text-center py-12 border rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">No properties yet</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Add a property to start tracking refinancing opportunities
          </p>
          <Link href={`/broker/clients/${client.id}/add-property`}>
            <Button className="mt-4">Add Property</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
