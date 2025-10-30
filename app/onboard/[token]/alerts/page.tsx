import { validateToken } from "@/app/_actions/tokens"
import { getClient } from "@/app/_actions/clients"
import { redirect } from "next/navigation"
import AlertsClient from "./_components/alerts-client"

export default async function AlertsPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  // Validate token and get user info
  const tokenResult = await validateToken(token)

  if (!tokenResult.success || !tokenResult.data) {
    redirect("/login")
  }

  const { userId, role } = tokenResult.data

  // Only clients should access this page
  if (role !== "client") {
    redirect(role === "admin" ? "/admin" : "/broker")
  }

  // Fetch client data with pre-selected alerts
  const clientResult = await getClient(userId)

  if (!clientResult.success || !clientResult.data) {
    redirect("/login")
  }

  return <AlertsClient clientData={clientResult.data} token={token} />
}
