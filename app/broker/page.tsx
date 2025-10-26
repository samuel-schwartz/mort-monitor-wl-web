import { getBroker, getBrokerClients } from "@/app/actions/brokers"
import { Button } from "@/components/ui/button"
import { Users, Plus } from "lucide-react"
import { ClientsTable } from "./_components/clients-table"
import Link from "next/link"
import type { Metadata } from "next"
import { getCurrentBrokerId } from "@/lib/session"

export const metadata: Metadata = {
  title: "Broker Dashboard",
  description: "Manage your clients and view analytics",
}

export default async function BrokerDashboardPage() {
  const brokerId = await getCurrentBrokerId()

  const [brokerResult, clientsResult] = await Promise.all([getBroker(brokerId), getBrokerClients(brokerId)])

  const broker = brokerResult.success ? brokerResult.data : null
  const clients = clientsResult.success ? clientsResult.data || [] : []

  if (!broker) {
    return (
      <div className="space-y-6">
        <div className="border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-2">Error Loading Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            Unable to load broker information. Please try refreshing the page or contact support if the issue persists.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
          <p className="text-muted-foreground mt-1">
            {clients.length} {clients.length === 1 ? "client" : "clients"} in your portfolio
          </p>
        </div>
        <Link href="/broker/clients/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No clients yet</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-sm mx-auto">
            Start building your portfolio by adding your first client
          </p>
          <Link href="/broker/clients/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          </Link>
        </div>
      ) : (
        <div className="border rounded-lg">
          <ClientsTable clients={clients} />
        </div>
      )}
    </div>
  )
}
