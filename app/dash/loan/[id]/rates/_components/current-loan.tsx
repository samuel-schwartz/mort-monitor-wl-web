import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(amount)
}

type CurrentLoanProps = {
  loan: {
    balance: number
    rate: number
    monthlyPayment: number
    remainingTerm: number
    lender?: string
  }
  property: {
    value: number
    address: string
  }
}

export function CurrentLoan({ loan, property }: CurrentLoanProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Loan Details</CardTitle>
        <CardDescription>Existing mortgage information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500">Current Balance</p>
            <p className="text-2xl font-bold">{formatCurrency(loan.balance)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Interest Rate</p>
            <p className="text-2xl font-bold">{loan.rate}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Monthly Payment</p>
            <p className="text-2xl font-bold">{formatCurrency(loan.monthlyPayment)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Remaining Term</p>
            <p className="text-2xl font-bold">{loan.remainingTerm} years</p>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Property: {property.address} • Value: {formatCurrency(property.value)}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
