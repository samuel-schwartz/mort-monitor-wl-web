import { getUserProperties } from "@/app/_actions/properties";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AlertsCard } from "./loan/[id]/_components/alerts-card";
import { ClostingCostsCard } from "./loan/[id]/_components/closing-costs-card";
import { LoanInfoCard } from "./loan/[id]/_components/loan-info-card";
import { RateChangeCard } from "./loan/[id]/_components/rate-change-card";
import Dashboard from "./loan/[id]/_components/dashboard";

export default async function DashboardPage() {
  const userId = "123";
  const propertiesResult = await getUserProperties(userId);
  const properties = propertiesResult.success
    ? propertiesResult.data || []
    : [];

  if (properties.length > 0) {
    const firstProperty = properties[0];

    // Mock data for the dashboard
    const loanData = {
      borrowerName: "Alex Rivera",
      currentRate: 6.625,
      loanAmount: 385000,
      monthlyPayment: 2847,
      remainingBalance: 378500,
      propertyAddress: firstProperty.address,
    };

    const alertsData = [
      {
        type: "Rate Drop to 5.85%",
        message: "30 year fixed - Alert is activated",
        priority: "high" as const,
        time: "2 hours ago",
      },
      {
        type: "Monthly payment falls below $123",
        message: "20 year fixed - Alert is on",
        priority: "medium" as const,
        time: "1 day ago",
      },
      {
        type: "Monthly payment falls below $123",
        message: "15 year fixed - Alert is on",
        priority: "medium" as const,
        time: "1 day ago",
      },
    ];

    return (
     
        <Dashboard id={firstProperty.id} alertsData={alertsData} loanData={loanData} />
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-4">
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Home className="h-8 w-8" />
          </EmptyMedia>
          <EmptyTitle>No properties yet</EmptyTitle>
          <EmptyDescription>
            Get started by adding your first property to begin monitoring
            refinance opportunities.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/dash/add-property">
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Property
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </div>
  );
}
