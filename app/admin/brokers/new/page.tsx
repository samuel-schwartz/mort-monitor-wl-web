import { AddBrokerForm } from "@/app/admin/_components/add-broker-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Add New Broker",
  description: "Create a new broker account",
}

export default function NewBrokerPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Broker</h1>
        <p className="text-muted-foreground">Create a new broker account</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Broker Information</CardTitle>
          <CardDescription>Enter the broker details</CardDescription>
        </CardHeader>
        <CardContent>
          <AddBrokerForm />
        </CardContent>
      </Card>
    </div>
  )
}
