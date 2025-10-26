"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { TrendingDown, FileText, Settings, UserCog, Menu, LogOut, ArrowLeft, Home } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import SidebarAccount from "@/components/shared/sidebar-account"
import { getBrokerFromContext } from "@/app/_providers/broker-provider"

function NavContent({
  isSpyView,
  onLinkClick,
}: { isSpyView?: boolean, onLinkClick?: () => void }) {

  const pathname = usePathname()

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")
  const broker = getBrokerFromContext()
  const viewAsBrokerParam = isSpyView && broker ? "viewAsBroker=" + broker.id : ""

  return (
    <>
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">MortMonitor</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link href={`/broker${viewAsBrokerParam}`} onClick={onLinkClick}>
          <Button
            variant={isActive("/broker") && pathname === "/broker" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </Button>
        </Link>
        <Link href={`/broker/settings${viewAsBrokerParam}`} onClick={onLinkClick}>
          <Button variant={isActive("/broker/settings") ? "secondary" : "ghost"} className="w-full justify-start">
            <Settings className="mr-3 h-5 w-5" />
            Settings
          </Button>
        </Link>
      </nav>


      <SidebarAccount />


      {isSpyView && (
        <Link href={"/admin"} onClick={onLinkClick}>
          <Button variant="default" size="sm" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Admin View
          </Button>
        </Link>
      )}
    </>
  )
}

export function BrokerNav({ isSpyView }: { isSpyView: boolean }) {
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
              isSpyView={isSpyView}
              onLinkClick={() => setOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 bg-card border-r">
        <NavContent
          isSpyView={isSpyView}
          onLinkClick={() => setOpen(false)} />
      </div>
    </>
  )
}
