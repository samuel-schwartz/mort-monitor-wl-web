import { Suspense } from "react"
import { notFound } from "next/navigation"
import { validateToken } from "@/app/actions/tokens"
import { getClient } from "@/app/actions/clients"
import { PrefilledOnboarding } from "./_components/prefilled-onboarding"
import { Skeleton } from "@/components/ui/skeleton"

export default async function PrefilledOnboardingPage({ params }: { params: { token: string } }) {
  const { token } = await params

  const tokenResult = await validateToken(token, "invitation")

  if (!tokenResult.success || !tokenResult.data) {
    notFound()
  }

  const tokenData = tokenResult.data

  const clientResult = await getClient(tokenData.clientId || "")

  if (!clientResult.success || !clientResult.client) {
    notFound()
  }

  const client = clientResult.client

  // For now, using mock data structure
  const prefilledData = {
    token,
    clientId: client.id,
    clientFirstName: client.firstName,
    clientLastName: client.lastName,
    clientEmail: client.email,
    clientPhone: client.phone || "(555) 123-4567",
    brokerName: "John Smith",
    brokerCompany: "Acme Mortgage",
    propertyId: "property_123",
    propertyAddress: "123 Main Street",
    propertyCity: "San Francisco",
    propertyState: "CA",
    propertyZip: "94105",
    propertyPrice: "750000",
    originalLoanAmount: "600000",
    currentBalance: "550000",
    interestRate: "4.5",
    termLength: "30",
    startMonth: "1",
    startYear: "2020",
    monthlyPayment: "3040",
    creditScore: client.creditScore || "750-799",
    preSelectedAlerts: [],
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <Suspense fallback={<Skeleton className="h-screen w-full" />}>
        <PrefilledOnboarding data={prefilledData} />
      </Suspense>
    </div>
  )
}
