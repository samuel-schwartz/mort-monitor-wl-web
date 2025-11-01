import { AlertsCard } from "./_components/alerts-card";
import { ClostingCostsCard } from "./_components/closing-costs-card";
import Dashboard from "./_components/dashboard";
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
   <Dashboard id={id} alertsData={alertsData} loanData={loanData} />
  );
}
