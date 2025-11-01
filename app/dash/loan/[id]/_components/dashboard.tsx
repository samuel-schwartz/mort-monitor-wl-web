import { getMockProperty } from "@/lib/mock-data";
import { AlertsCard } from "./alerts-card";
import { ClostingCostsCard } from "./closing-costs-card";
import { LoanInfoCard } from "./loan-info-card";
import { RateChangeCard } from "./rate-change-card";

export default function Dashboard({id, alertsData, loanData}: {id: string, alertsData: any, loanData:any}){

    //Placeholder
    const property = getMockProperty(id)

 return (
    <div className="p-4 sm:p-6 lg:p-10">
      <div className="space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Loan Dashboard &mdash; {property.address}
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