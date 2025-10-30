import { validateToken } from "@/app/_actions/tokens"
import { getClient } from "@/app/_actions/clients"
import { redirect } from "next/navigation"
import PropertyClient from "./_components/property-client"

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
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

  // Fetch client data
  const clientResult = await getClient(userId)

  if (!clientResult.success || !clientResult.data) {
    redirect("/login")
  }

  return <PropertyClient token={token} clientData={clientResult.data} />
}
