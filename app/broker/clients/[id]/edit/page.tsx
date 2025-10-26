import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getClient } from "@/app/actions/clients"
import { EditClientForm } from "../_components/edit-client-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default async function EditClientPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const result = await getClient(id)

  if (!result.success || !result.client) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Edit Client</h1>
        <p className="text-muted-foreground mt-2">Update client information and settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
          <CardDescription>Make changes to the client's profile</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <EditClientForm client={result.client} />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
