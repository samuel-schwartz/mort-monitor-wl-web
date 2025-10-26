import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  TrendingDown,
  Bell,
  DollarSign,
  Users,
  FileText,
  Activity,
  HandCoins,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function LoanInfoCardShort({ loanId, loanData }: any) {
  return (
    <>
      {/* Current Loan Overview */}
      <Card className="border-l-4 border-l-slate-500 gap-0">
        <CardHeader>
          <CardTitle className="flex justify-between gap-2">
            <span className="flex justify-between gap-2 items-center">
              <HandCoins className="text-slate-500" />
              <span>Current Loan Details</span>

              <span className="text-sm text-gray-500">
                {loanData.propertyAddress}
              </span>
            </span>
            <Button variant="outline" className="bg-transparent">
              <Link
                href={`/dash/loan/${loanId}/details/#edit`}
                className="flex items-center"
              >
                <Pencil />
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-8 gap-1 text-center">
            <div>
              <p className="text-sm text-gray-500">Property Price</p>
              <p className="text-2xl font-bold">
                ${loanData.loanAmount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                At the time of last appraisal
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Loan Amount</p>
              <p className="text-2xl font-bold">
                ${loanData.loanAmount.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Current Rate</p>
              <p className="text-2xl font-bold">{loanData.currentRate}%</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Term Length</p>
              <p className="text-2xl font-bold">30 years</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Min. Monthly Payment</p>
              <p className="text-2xl font-bold">
                ${loanData.monthlyPayment.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Money You Still Owe</p>
              <p className="text-2xl font-bold">
                ${loanData.remainingBalance.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Future Interest To Pay</p>
              <p className="text-2xl font-bold">
                ${loanData.remainingBalance.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">
                Based on what you still owe and your minimum monthly payment.
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Forcasted End Date</p>
              <p className="text-2xl font-bold">30 years</p>
              <p className="text-xs text-gray-500">
                Based on what you still owe and your minimum monthly payment.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
