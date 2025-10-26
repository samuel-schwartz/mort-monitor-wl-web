"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { updateBroker } from "@/app/actions/brokers"
import { useToast } from "@/hooks/use-toast"
import { X } from "lucide-react"
import type { Broker } from "@/types/models"

interface BrokerSettingsFormProps {
  broker: Broker
}

export function BrokerSettingsForm({ broker }: BrokerSettingsFormProps) {
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>(broker.logoUrl || "")
  const [emails, setEmails] = useState<string[]>(broker.emails || [])
  const [emailInput, setEmailInput] = useState("")
  const [emailError, setEmailError] = useState("")

  const [formData, setFormData] = useState({
    firstName: broker.firstName || "",
    lastName: broker.lastName || "",
    phone: broker.phone || "",
    companyName: broker.companyName || "",
  })

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const handleAddEmail = () => {
    const trimmedEmail = emailInput.trim()

    if (!trimmedEmail) {
      setEmailError("Please enter an email address")
      return
    }

    if (!validateEmail(trimmedEmail)) {
      setEmailError("Please enter a valid email address")
      return
    }

    if (emails.includes(trimmedEmail)) {
      setEmailError("This email has already been added")
      return
    }

    setEmails([...emails, trimmedEmail])
    setEmailInput("")
    setEmailError("")
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    if (emails.length <= 1) {
      setEmailError("At least one email address is required")
      return
    }
    setEmails(emails.filter((email) => email !== emailToRemove))
    setEmailError("")
  }

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddEmail()
    }
  }

  const handleSave = async () => {
    if (emails.length === 0) {
      toast({
        title: "Error",
        description: "At least one email address is required",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const updateData: any = { ...formData }

      if (logoFile) {
        updateData.logoUrl = logoPreview
      }

      const result = await updateBroker(broker.id, updateData)

      if (result.success) {
        toast({
          title: "Settings Updated",
          description: "Your settings have been saved successfully",
        })
        setIsEditing(false)
        setLogoFile(null)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update settings",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: broker.firstName || "",
      lastName: broker.lastName || "",
      phone: broker.phone || "",
      companyName: broker.companyName || "",
    })
    setLogoPreview(broker.logoUrl || "")
    setLogoFile(null)
    setEmails(broker.emails || [])
    setEmailInput("")
    setEmailError("")
    setIsEditing(false)
  }

  return (
    <div className="border rounded-lg">
      <div className="p-6 space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Personal Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!isEditing || isSaving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!isEditing || isSaving}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing || isSaving}
              placeholder="(555) 123-4567"
            />
          </div>
        </div>

        {/* Company Information */}
        <div className="border-t pt-6 space-y-4">
          <h2 className="text-lg font-medium">Company Information</h2>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              disabled={!isEditing || isSaving}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo</Label>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  id="logo"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  disabled={!isEditing || isSaving}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">Upload a logo for white-label branding</p>
              </div>
              {logoPreview && (
                <div className="w-16 h-16 border rounded-md overflow-hidden bg-muted flex items-center justify-center">
                  <img
                    src={logoPreview || "/placeholder.svg"}
                    alt="Logo preview"
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Team Email Management */}
        <div className="border-t pt-6 space-y-4">
          <h2 className="text-lg font-medium">Team Access</h2>
          <p className="text-sm text-muted-foreground">
            Manage email addresses for team members who can access this brokerage account
          </p>

          <div className="space-y-2">
            <Label htmlFor="emailInput">Team Email Addresses</Label>
            <div className="flex gap-2">
              <Input
                id="emailInput"
                type="email"
                value={emailInput}
                onChange={(e) => {
                  setEmailInput(e.target.value)
                  setEmailError("")
                }}
                onKeyDown={handleEmailKeyDown}
                placeholder="email@example.com"
                disabled={!isEditing || isSaving}
              />
              <Button type="button" onClick={handleAddEmail} disabled={!isEditing || isSaving} variant="secondary">
                Add
              </Button>
            </div>
            {emailError && <p className="text-xs text-red-600 dark:text-red-400">{emailError}</p>}
            <p className="text-xs text-muted-foreground">
              All team members can log in with their email and have broker access
            </p>

            {emails.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3 p-3 border rounded-md bg-muted/50">
                {emails.map((email) => (
                  <Badge key={email} variant="secondary" className="gap-1 pr-1">
                    {email}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(email)}
                        disabled={isSaving}
                        className="ml-1 hover:bg-muted rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="border-t pt-6">
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>Edit Settings</Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={isSaving}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
