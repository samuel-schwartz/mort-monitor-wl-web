"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { TrendingDown, Home, Menu} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import SidebarAccount from "@/components/shared/sidebar-account"
import { Broker, User } from "@/types/models"

function NavContent({user, broker, onLinkClick }: {user: User, broker?: Broker, onLinkClick?: () => void }) {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/")


  return (
    <>
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center gap-2">
          <TrendingDown className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold">MortMonitor Admin</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Link href="/admin" onClick={onLinkClick}>
          <Button
            variant={isActive("/admin") && pathname === "/admin" ? "secondary" : "ghost"}
            className="w-full justify-start"
          >
            <Home className="mr-3 h-5 w-5" />
            Brokers
          </Button>
        </Link>
      </nav>

      <SidebarAccount user={user} brandColor={broker?.brandColor} />
    </>
  )
}

export function AdminNav({user, broker}: {user: User, broker?: Broker}) {
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
            <NavContent user={user} broker={broker} onLinkClick={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 bg-card border-r">
        <NavContent user={user} broker={broker} />
      </div>
    </>
  )
}
