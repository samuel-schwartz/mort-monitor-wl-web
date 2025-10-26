import { AlertsCard } from "./_components/alerts-card";
import { ClostingCostsCard } from "./_components/closing-costs-card";
import { LoanInfoCard } from "./_components/loan-info-card";
import { RateChangeCard } from "./_components/rate-change-card";

export default async function LoanDashboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Mock data for the dashboard
  const loanData = {
    borrowerName: "Alex Rivera",
    currentRate: 6.625,
    loanAmount: 385000,
    monthlyPayment: 2847,
    remainingBalance: 378500,
    propertyAddress: "123 Main St, Eau Claire, WI 54701",
  };

  const alertsData = [
    {
      type: "Rate Drop to 5.85%",
      message: "30 year fixed - Alert is activated",
      priority: "high",
      time: "2 hours ago",
    },
    {
      type: "Monthly payment falls below $123",
      message: "20 year fixed - Alert is on",
      priority: "medium",
      time: "1 day ago",
    },
    {
      type: "Monthly payment falls below $123",
      message: "15 year fixed - Alert is on",
      priority: "medium",
      time: "1 day ago",
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Loan Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Comprehensive overview of your loan, market opportunities, and
            alerts
          </p>
        </div>

        {/* Market Opportunity & Rate Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="lg:col-span-2">
            <AlertsCard loanId={id} alertsData={alertsData} />
          </div>

          <div className="lg:col-span-1">
            <RateChangeCard loanId={id} />
          </div>

          <div className="lg:col-span-1">
            <ClostingCostsCard loanId={id} />
          </div>

          <div className="lg:col-span-2">
            <LoanInfoCard loanId={id} loanData={loanData} />
          </div>
        </div>
      </div>
    </div>
  );
}
