import { Suspense } from "react"
import { notFound } from "next/navigation"
import { validateToken } from "@/app/actions/tokens"
import { InvitePasswordSetup } from "./_components/invite-password-setup"
import { Skeleton } from "@/components/ui/skeleton"

export default async function InviteAcceptPage({ params }: { params: { token: string } }) {
  const { token } = await params

  // Validate the invitation token
  const tokenResult = await validateToken(token, "invitation")

  if (!tokenResult.success || !tokenResult.data) {
    notFound()
  }

  const tokenData = tokenResult.data

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Suspense fallback={<Skeleton className="h-screen w-full" />}>
        <InvitePasswordSetup token={token} email={tokenData.email || ""} />
      </Suspense>
    </div>
  )
}
