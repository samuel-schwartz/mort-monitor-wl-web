import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getClient } from "@/app/actions/clients"
import { AddPropertyForClientForm } from "./_components/add-property-for-client-form"
import { Skeleton } from "@/components/ui/skeleton"

export default async function AddPropertyForClientPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const result = await getClient(id)

  if (!result.success || !result.client) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            Add Property for {result.client.firstName} {result.client.lastName}
          </h1>
          <p className="text-muted-foreground mt-2">Enter property and loan details for your client</p>
        </div>

        <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
          <AddPropertyForClientForm client={result.client} />
        </Suspense>
      </div>
    </div>
  )
}
