"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { TrendingDown, FileText, Settings, UserCog, Menu, LogOut, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useState } from "react"
import { signOutUser } from "@/app/actions/auth"
import type { Broker } from "@/types/models"

interface BrokerNavProps {
  broker: Broker | null
  isAdminView?: boolean
  brokerId?: string
}

function NavContent({
  broker,
  isAdminView,
  brokerId,
  onLinkClick,
}: { broker: Broker | null; isAdminView?: boolean; brokerId?: string; onLinkClick?: () => void }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const viewAsBrokerParam = isAdminView && brokerId ? `?viewAsBroker=${brokerId}` : ""

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")

  const handleSignOut = async () => {
    await signOutUser()
  }

  const userInitials = broker ? `${broker.firstName[0]}${broker.lastName[0]}`.toUpperCase() : "JS"
  const userFullName = broker ? `${broker.firstName} ${broker.lastName}` : "Jane Smith"
  const companyName = broker?.companyName || "Mortgage Company"

  return (
    <>
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">MortMonitor</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link href={`/broker/invoices${viewAsBrokerParam}`} onClick={onLinkClick}>
          <Button variant={isActive("/broker/invoices") ? "secondary" : "ghost"} className="w-full justify-start">
            <FileText className="mr-3 h-5 w-5" />
            Invoices
          </Button>
        </Link>

        <Link href={`/broker/settings${viewAsBrokerParam}`} onClick={onLinkClick}>
          <Button variant={isActive("/broker/settings") ? "secondary" : "ghost"} className="w-full justify-start">
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Button>
        </Link>
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
            {userInitials}
          </div>
          <div>
            <p className="text-sm font-medium">{userFullName}</p>
            <p className="text-xs text-muted-foreground">{companyName}</p>
          </div>
        </div>
        <div className="space-y-4">
          <Link href={`/account${viewAsBrokerParam}`} onClick={onLinkClick}>
            <Button variant="outline" size="sm" className="w-full bg-transparent m-1">
              <UserCog className="mr-2 h-4 w-4" />
              Account
            </Button>
          </Link>
          <Button variant="outline" size="sm" className="w-full bg-transparent m-1" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>

          {isAdminView && (
            <Link href="/admin" onClick={onLinkClick}>
              <Button variant="default" size="sm" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Admin View
              </Button>
            </Link>
          )}
        </div>
      </div>
    </>
  )
}

export function BrokerNav({ broker, isAdminView, brokerId }: BrokerNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <NavContent
              broker={broker}
              isAdminView={isAdminView}
              brokerId={brokerId}
              onLinkClick={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 bg-card border-r">
        <NavContent broker={broker} isAdminView={isAdminView} brokerId={brokerId} />
      </div>
    </>
  )
}
