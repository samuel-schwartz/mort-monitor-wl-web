"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateClient } from "@/app/actions/clients"
import type { Client } from "@/types/models"
import { useToast } from "@/hooks/use-toast"

export function EditClientForm({ client }: { client: Client }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const [formData, setFormData] = useState({
    firstName: client.firstName,
    lastName: client.lastName,
    email: client.email,
    phone: client.phone || "",
    creditScore: client.creditScore || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const result = await updateClient(client.id, formData)

      if (result.success) {
        toast({
          title: "Client updated",
          description: "Client information has been saved successfully.",
        })
        router.push(`/broker/clients/${client.id}`)
      } else {
        setError(result.error || "Failed to update client")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="creditScore">Credit Score Range</Label>
        <Select
          value={formData.creditScore}
          onValueChange={(value) => setFormData({ ...formData, creditScore: value })}
        >
          <SelectTrigger id="creditScore" disabled={isLoading}>
            <SelectValue placeholder="Select credit score range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="800+">800+ (Excellent)</SelectItem>
            <SelectItem value="750-799">750-799 (Very Good)</SelectItem>
            <SelectItem value="700-749">700-749 (Good)</SelectItem>
            <SelectItem value="650-699">650-699 (Fair)</SelectItem>
            <SelectItem value="600-649">600-649 (Poor)</SelectItem>
            <SelectItem value="<600">Below 600</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
