import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogOut, UserCog } from "lucide-react"
import Image from "next/image"
import { signOutUser } from "@/app/_actions/auth"
import { getUserFromContext } from "@/app/_providers/user-provider"
import { getBrokerFromContext } from "@/app/_providers/broker-provider"

export default function SidebarAccount() {

    const user = getUserFromContext()
    if(!user) return

    const broker = getBrokerFromContext()
    const brandColor = broker ? broker.brandColor : undefined


    const userInitials = user.firstName.charAt(0).toUpperCase() + user.lastName.charAt(0).toUpperCase()
    console.log(user)
    return (
        <div className="p-4 border-t">
            <div className="flex items-center gap-3 mb-3">

                {user.iconUrl ?

                    (
                        <Image src={user.iconUrl ? `${user.iconUrl}` : ""} alt={`${userInitials}`} className="w-8 h-8 bg-primary rounded-full flex items-center justify-center" />

                    ) :
                    (
                        <div
                            className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium"
                            style={brandColor ? { backgroundColor: brandColor } : undefined}
                        >
                            {userInitials}
                        </div>
                    )
                }
                <div>
                    <p className="text-sm font-medium">{user ? `${user.firstName} ${user.lastName}` : "Guest"}</p>
                    <p className="text-xs text-muted-foreground">{user?.email || "Not logged in"}</p>
                </div>
            </div>
            <div className="space-y-4">
                {user.provider == "credentials" && (
                    <Link href="/account">
                        <Button variant="outline" size="sm" className="w-full bg-transparent m-1">
                            <UserCog className="mr-2 h-4 w-4" />
                            Account
                        </Button>
                    </Link>
                )
                }
                <Button variant="outline" size="sm" className="w-full bg-transparent m-1" onClick={signOutUser}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                </Button>
            </div>
        </div>
    )
}