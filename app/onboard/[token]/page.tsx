import type { Metadata } from "next"
import { redirect } from "next/navigation"
import { validateToken } from "@/app/_actions/tokens"
import { InviteAcceptance } from "./_components/invite-acceptance"

export const metadata: Metadata = {
  title: "Accept Invitation | MortMonitor",
  description: "Accept your invitation to MortMonitor",
}

interface PageProps {
  params: Promise<{ token: string }>
}

export default async function OnboardPage({ params }: PageProps) {
  const { token } = await params

  // Validate the token
  const result = await validateToken(token)

  if (!result.success || !result.data) {
    redirect("/login?error=invalid-token")
  }

  const { email, firstName, lastName, role } = result.data

  return <InviteAcceptance token={token} email={email} firstName={firstName} lastName={lastName} role={role} />
}
