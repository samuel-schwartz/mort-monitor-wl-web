import { validateToken } from "@/app/_actions/tokens"
import { BrokerPasswordSetup } from "./_components/broker-password-setup"
import { notFound } from "next/navigation"

export default async function BrokerSetupPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params

  // Validate the invitation token
  const tokenResult = await validateToken(token, "invitation")

  if (!tokenResult.success || !tokenResult.data) {
    notFound()
  }

  const tokenData = tokenResult.data

  return <BrokerPasswordSetup token={token} email={tokenData.email || ""} brokerCompany={tokenData.brokerCompany} />
}
