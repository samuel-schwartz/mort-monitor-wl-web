import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { HandCoins } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function LoanInfoCard({ loanId, loanData }: any) {
  const ltv = ((loanData.remainingBalance / loanData.loanAmount) * 100).toFixed(1)
  const originationDate = "Jan 2020" // Mock data

  return (
    <Card className="border-l-4 border-l-emerald-500 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HandCoins className="h-5 w-5 text-emerald-500" />
          Current Loan Details
        </CardTitle>
        <CardDescription>{loanData.propertyAddress}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 flex-1">
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500 min-h-[3rem] flex items-center justify-center sm:justify-start">
              Property Price
            </p>
            <p className="text-2xl font-bold">${loanData.loanAmount.toLocaleString()}</p>
            <p className="text-xs sm:text-xs text-gray-500 mt-1">At the time of last appraisal</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500 min-h-[3rem] flex items-center justify-center sm:justify-start">
              Loan Amount
            </p>
            <p className="text-2xl font-bold">${loanData.loanAmount.toLocaleString()}</p>
          </div>

          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500 min-h-[3rem] flex items-center justify-center sm:justify-start">
              Current Rate
            </p>
            <p className="text-2xl font-bold">{loanData.currentRate}%</p>
          </div>

          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500 min-h-[3rem] flex items-center justify-center sm:justify-start">
              Term Length
            </p>
            <p className="text-2xl font-bold">30 years</p>
          </div>

          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500 min-h-[3rem] flex items-center justify-center sm:justify-start">
              Min. Monthly Payment
            </p>
            <p className="text-2xl font-bold">${loanData.monthlyPayment.toLocaleString()}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500 min-h-[3rem] flex items-center justify-center sm:justify-start">
              Money You Still Owe
            </p>
            <p className="text-2xl font-bold">${loanData.remainingBalance.toLocaleString()}</p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500 min-h-[3rem] flex items-center justify-center sm:justify-start">
              Future Interest To Pay
            </p>
            <p className="text-2xl font-bold">${loanData.remainingBalance.toLocaleString()}</p>
            <p className="text-xs sm:text-xs text-gray-500 mt-1">
              Based on what you still owe and your minimum monthly payment.
            </p>
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm text-gray-500 min-h-[3rem] flex items-center justify-center sm:justify-start">
              Forcasted End Date
            </p>
            <p className="text-2xl font-bold">30 years</p>
            <p className="text-xs sm:text-xs text-gray-500 mt-1">
              Based on what you still owe and your minimum monthly payment.
            </p>
          </div>
        </div>
        <Button variant="outline" className="w-full bg-transparent mt-6">
          <Link href={`/dash/loan/${loanId}/details#edit`} className="flex items-center">
            Update Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
