"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  TrendingDown,
  Home,
  Bell,
  UserPlus as HousePlus,
  ReceiptText,
  Menu,
  Activity,
  UserCog,
  LogOut,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useState } from "react";
import { signOutUser } from "@/app/_actions/auth";
import type { User } from "@/types/_models";
import type { Property, Broker } from "@/types/_models";
import Image from "next/image";
import { getBrokerFromContext } from "@/app/_providers/broker-provider";
import SidebarAccount from "@/components/shared/sidebar-account";

interface DashboardNavClientProps {
  user: User | null;
  properties: Property[];
  broker: Broker | null;
  isSpyView: boolean;
}

function NavContent({
  onLinkClick,
  user,
  properties,
  brandName,
  brandColor,
  logoUrl,
  isSpyView,
}: {
  onLinkClick?: () => void;
  user: User | null;
  properties: Property[];
  brandName: string;
  brandColor?: string;
  logoUrl?: string;
  isSpyView: boolean
}) {
  const params = useParams<{ id: string }>();
  const currentPropertyId = params.id;

  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.endsWith(path);
  const broker = getBrokerFromContext();
  const viewAsBrokerParam = isSpyView && broker ? "viewAsBroker=" + broker.id : "";


  return (
    <>
      <div className="flex h-16 items-center px-6 border-b">
        <div className="flex items-center gap-2">
          {logoUrl ? (
            <Image
              src={logoUrl || "/placeholder.svg"}
              alt={brandName}
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          ) : (
            <TrendingDown
              className="h-6 w-6 text-primary"
              style={brandColor ? { color: brandColor } : undefined}
            />
          )}
          <span className="text-lg font-bold">{brandName}</span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {properties.length > 0 ? (
          properties.map((property) => {
            const urlSafeId = encodeURIComponent(property.id);

            const loanPath = `/dash/loan/${urlSafeId}`
            const alertsPath = `/dash/loan/${urlSafeId}/alerts`
            const ratesPath = `/dash/loan/${urlSafeId}/rates`
            const closingCostsPath = `/dash/loan/${urlSafeId}/closing-costs`


            return (
              <div key={property.id} className="border-b pb-2" >

                <Link href={loanPath} onClick={onLinkClick}>
                  <Button
                    variant={isActive(loanPath) ? "secondary" : "ghost"}
                    className="w-full justify-start m-1"
                  >
                    <Home className="mr-3 h-5 w-5" />
                    {property.address}
                  </Button>
                </Link>

                <Link
                  href={alertsPath}
                  onClick={onLinkClick}
                >
                  <Button

                    variant={isActive(alertsPath) ? "secondary" : "ghost"}
                    className="w-full justify-start m-1"
                  >
                    <Bell className="mx-3 h-4 w-4" />
                    Alerts
                  </Button>
                </Link>

                <Link
                  href={ratesPath}
                  onClick={onLinkClick}
                >
                  <Button
                    
                    variant={isActive(ratesPath) ? "secondary" : "ghost"}
                    className="w-full justify-start m-1"
                  >
                    <Activity className="mx-3 h-4 w-4" />
                    Rate Trends
                  </Button>
                </Link>

                <Link
                  href={closingCostsPath}
                  onClick={onLinkClick}
                >
                  <Button
                    
                    variant={isActive(closingCostsPath) ? "secondary" : "ghost"}
                    className="w-full justify-start m-1"
                  >
                    <ReceiptText className="mx-3 h-4 w-4" />
                    Closing Costs
                  </Button>
                </Link>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground px-3 py-2">
            No properties yet
          </p>
        )}

        <Link
          href="/dash/add-property"
          onClick={onLinkClick}
          className="block mt-6"
        >
          <Button variant="ghost" className="w-full justify-start">
            <HousePlus className="mr-3 h-5 w-5" />
            Add Loan/Property
          </Button>
        </Link>
      </nav>

      <SidebarAccount />

      {isSpyView && (
        <Link href={"/broker"} onClick={onLinkClick}>
          <Button variant="default" size="sm" className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Broker View
          </Button>
        </Link>
      )}
    </>
  );
}

export function DashboardNavClient({
  user,
  properties,
  broker,
  isSpyView
}: DashboardNavClientProps) {
  const [open, setOpen] = useState(false);

  const brandName = broker?.companyName || "MortMonitor";
  const brandColor = broker?.brandColor;
  const logoUrl = broker?.logoUrl;

  return (
    <>
      {/* Mobile menu */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
            <NavContent
              onLinkClick={() => setOpen(false)}
              user={user}
              properties={properties}
              brandName={brandName}
              brandColor={brandColor}
              logoUrl={logoUrl}
              isSpyView={isSpyView}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block fixed inset-y-0 left-0 z-50 w-64 bg-card border-r">
        <NavContent
          user={user}
          properties={properties}
          brandName={brandName}
          brandColor={brandColor}
          logoUrl={logoUrl}
          isSpyView={isSpyView}
        />
      </div>
    </>
  );
}
