"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createBroker } from "@/app/actions/brokers"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export function AddBrokerForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>("")
  const [emails, setEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState("")
  const [emailError, setEmailError] = useState("")

  const [formData, setFormData] = useState({
    companyName: "",
    logoUrl: "",
    brandColor: "#3b82f6", // Default blue color
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
    setEmails(emails.filter((email) => email !== emailToRemove))
  }

  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddEmail()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (emails.length === 0) {
      setError("Please add at least one email address")
      return
    }

    setIsLoading(true)

    try {
      const result = await createBroker({
        companyName: formData.companyName,
        brandColor: formData.brandColor,
        emails: emails.join(","),
        logoFile: logoFile || undefined,
      })

      if (result.success) {
        router.push("/admin")
      } else {
        setError(result.error || "Failed to create broker")
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

      <div className="space-y-2">
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          value={formData.companyName}
          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
          required
          disabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="logo">Company Logo (Optional)</Label>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Input
              id="logo"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              disabled={isLoading}
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

<div className="space-y-2">
  <Label htmlFor="brandColor">Brand Color</Label>

  <div className="grid grid-cols-4 gap-3">
    <Input
      id="brandColor"
      type="color"
      value={formData.brandColor}
      onChange={(e) => setFormData({ ...formData, brandColor: e.target.value })}
      disabled={isLoading}
      className="cursor-pointer p-1 border-2 rounded-md"
    />

    <Input
      type="text"
      value={formData.brandColor}
      onChange={(e) => {
        const value = e.target.value
        if (value === "" || /^#[0-9A-Fa-f]{0,6}$/.test(value)) {
          setFormData({ ...formData, brandColor: value })
        }
      }}
      disabled={isLoading}
      placeholder="#3b82f6"
      pattern="^#[0-9A-Fa-f]{6}$"
      maxLength={7}
      className="font-mono text-sm col-span-3"
    />
  </div>

  <p className="text-xs text-muted-foreground">
    Choose a brand color for white-label customization
  </p>
</div>

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
            disabled={isLoading}
          />
          <Button type="button" onClick={handleAddEmail} disabled={isLoading} variant="secondary">
            Add
          </Button>
        </div>
        {emailError && <p className="text-xs text-red-600 dark:text-red-400">{emailError}</p>}
        <p className="text-xs text-muted-foreground">
          Add multiple email addresses. All team members can log in with their email.
        </p>

        {emails.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 p-3 border rounded-md bg-muted/50">
            {emails.map((email) => (
              <Badge key={email} variant="secondary" className="gap-1 pr-1">
                {email}
                <button
                  type="button"
                  onClick={() => handleRemoveEmail(email)}
                  disabled={isLoading}
                  className="ml-1 hover:bg-muted rounded-full p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>

        )}
      </div>


      <div className="flex gap-3">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Creating Broker..." : "Create Broker"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()} disabled={isLoading}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
