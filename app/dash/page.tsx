import { getUserProperties } from "@/app/actions/properties"
import { getCurrentUserId } from "@/lib/session"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Home, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { AlertsCard } from "./loan/[id]/_components/alerts-card"
import { ClostingCostsCard } from "./loan/[id]/_components/closing-costs-card"
import { LoanInfoCard } from "./loan/[id]/_components/loan-info-card"
import { RateChangeCard } from "./loan/[id]/_components/rate-change-card"

export default async function DashboardPage() {
  const userId = await getCurrentUserId()
  const propertiesResult = await getUserProperties(userId)
  const properties = propertiesResult.success ? propertiesResult.data || [] : []

  if (properties.length > 0) {
    const firstProperty = properties[0]

    // Mock data for the dashboard
    const loanData = {
      borrowerName: "Alex Rivera",
      currentRate: 6.625,
      loanAmount: 385000,
      monthlyPayment: 2847,
      remainingBalance: 378500,
      propertyAddress: firstProperty.address,
    }

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
    ]

    return (
      <div className="p-4 sm:p-6 lg:p-10 lg:pl-72">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Loan Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive overview of your loan, market opportunities, and alerts
            </p>
          </div>

          {/* Market Opportunity & Rate Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-2">
              <AlertsCard loanId={firstProperty.id} alertsData={alertsData} />
            </div>

            <div className="lg:col-span-1">
              <RateChangeCard loanId={firstProperty.id} />
            </div>

            <div className="lg:col-span-1">
              <ClostingCostsCard loanId={firstProperty.id} />
            </div>

            <div className="lg:col-span-2">
              <LoanInfoCard loanId={firstProperty.id} loanData={loanData} />
            </div>
          </div>
        </div>
      </div>
    )
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
            Get started by adding your first property to begin monitoring refinance opportunities.
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
  )
}
