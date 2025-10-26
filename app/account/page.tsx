import { AccountSettings } from "@/app/account/_components/account-settings"
import { getUser } from "@/app/actions/users"
import { getBroker } from "@/app/actions/brokers"
import { getCurrentUserId } from "@/lib/session"
import { BackButton } from "./_components/back-button"

export default async function AccountPage() {
  const userId = await getCurrentUserId()
  const userResult = await getUser(userId)
  const user = userResult.success ? userResult.user : null

  let brandColor: string | undefined
  if (user && "brokerId" in user && user.brokerId) {
    const brokerResult = await getBroker(user.brokerId)
    if (brokerResult.success && brokerResult.data) {
      brandColor = brokerResult.data.brandColor
    }
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <BackButton brandColor={brandColor} />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Account Settings</h1>
          <p className="text-muted-foreground mt-2">Manage your personal account settings and preferences</p>
        </div>
        <AccountSettings user={user} />
      </div>
    </div>
  )
}
