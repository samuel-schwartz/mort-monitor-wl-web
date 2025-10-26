import { getAllBrokers } from "@/app/_actions/brokers"
import { Button } from "@/components/ui/button"
import { Building2, Plus } from "lucide-react"
import { BrokersTable } from "./_components/brokers-table"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Manage broker accounts and platform settings",
}

export default async function AdminDashboardPage() {
  const brokersResult = await getAllBrokers()
  const brokers = brokersResult.success ? brokersResult.data || [] : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-4 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brokers</h1>
          <p className="text-muted-foreground mt-1">
            {brokers.length} {brokers.length === 1 ? "broker" : "brokers"} on the platform
          </p>
        </div>
        <Link href="/admin/brokers/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Broker
          </Button>
        </Link>
      </div>

      {brokers.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">No brokers yet</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-6 max-w-sm mx-auto">
            Start by adding your first broker to the platform
          </p>
          <Link href="/admin/brokers/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Broker
            </Button>
          </Link>
        </div>
      ) : (
        <div className="container">
          <BrokersTable brokers={brokers} />
        </div>
      )}
    </div>
  )
}
