import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getProperty } from "@/app/actions/properties"
import { LoanDetailsClient } from "@/app/dash/loan/[id]/details/_components/loan-details-client"
import { Skeleton } from "@/components/ui/skeleton"

export default async function BrokerClientPropertyPage({
  params,
}: {
  params: { id: string; propertyId: string }
}) {
  const { propertyId } = await params
  const result = await getProperty(propertyId)

  if (!result.success || !result.property) {
    notFound()
  }

  // Transform property to loan format expected by LoanDetailsClient
  const loan = {
    id: result.property.id,
    propertyAddress: result.property.address.split(",")[0] || "",
    propertyCity: result.property.city || "",
    propertyState: result.property.state || "",
    propertyZip: result.property.zipCode || "",
    propertyPrice: result.property.propertyPrice,
    loanAmount: result.property.originalLoanAmount,
    currentRate: result.property.interestRate,
    termYears: result.property.loanTermYears,
    startMonth: new Date(result.property.loanStartDate).getMonth() + 1,
    startYear: new Date(result.property.loanStartDate).getFullYear(),
    remainingBalance: result.property.loanBalance,
    monthlyPayment: result.property.monthlyPayment,
  }

  return (
    <Suspense fallback={<Skeleton className="h-screen w-full" />}>
      <LoanDetailsClient initialLoan={loan} />
    </Suspense>
  )
}
