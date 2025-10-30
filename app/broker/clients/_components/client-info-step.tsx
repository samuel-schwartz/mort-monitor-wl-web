"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ClientInfoStepProps {
  firstName: string
  lastName: string
  email: string
  phone: string
  onFirstNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onNext: () => void
  onCancel: () => void
}

function ClientInfoStep({
  firstName,
  lastName,
  email,
  phone,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPhoneChange,
  onNext,
  onCancel,
}: ClientInfoStepProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isFormValid = firstName.trim() && lastName.trim() && email.trim()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext()
    }
  }

  const handleContinue = (e: React.MouseEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onNext()
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl sm:text-2xl">Add New Client</CardTitle>
        <CardDescription className="text-sm sm:text-base">Enter your client's information</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm sm:text-base">
                First Name
              </Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => {
                  onFirstNameChange(e.target.value)
                  if (errors.firstName) setErrors({ ...errors, firstName: "" })
                }}
                placeholder="Enter first name"
                className="h-10"
                autoComplete="given-name"
                autoFocus
                required
                aria-invalid={!!errors.firstName}
                aria-describedby={errors.firstName ? "firstName-error" : undefined}
              />
              {errors.firstName && (
                <p id="firstName-error" className="text-sm text-destructive" role="alert">
                  {errors.firstName}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm sm:text-base">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => {
                  onLastNameChange(e.target.value)
                  if (errors.lastName) setErrors({ ...errors, lastName: "" })
                }}
                placeholder="Enter last name"
                className="h-10"
                autoComplete="family-name"
                required
                aria-invalid={!!errors.lastName}
                aria-describedby={errors.lastName ? "lastName-error" : undefined}
              />
              {errors.lastName && (
                <p id="lastName-error" className="text-sm text-destructive" role="alert">
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  onEmailChange(e.target.value)
                  if (errors.email) setErrors({ ...errors, email: "" })
                }}
                placeholder="client@example.com"
                className="h-10"
                autoComplete="email"
                required
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-sm text-destructive" role="alert">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm sm:text-base">
                Cell Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => onPhoneChange(e.target.value)}
                placeholder="(555) 123-4567"
                className="h-10"
                autoComplete="tel"
              />
            </div>

          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1 h-11 sm:h-12 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleContinue} className="flex-1 h-11 sm:h-12" disabled={!isFormValid}>
              Continue
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default ClientInfoStep
