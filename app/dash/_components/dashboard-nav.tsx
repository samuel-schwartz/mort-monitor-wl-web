import { DashboardNavClient } from "./dashboard-nav-client"
import type { AuthUser } from "@/app/_actions/auth"
import type { Property, Broker } from "@/types/models"

interface DashboardNavProps {
  user: AuthUser | null
  properties: Property[]
  broker: Broker | null
}

export function DashboardNav({ user, properties, broker }: DashboardNavProps) {
  return <DashboardNavClient user={user} properties={properties} broker={broker} />
}
