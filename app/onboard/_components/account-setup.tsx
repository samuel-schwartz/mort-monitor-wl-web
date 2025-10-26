"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { signupSchema } from "@/lib/validation/schemas"

interface Step1AccountProps {
  firstName: string
  lastName: string
  email: string
  password: string
  onFirstNameChange: (value: string) => void
  onLastNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onNext: () => void
  // Added error and isSubmitting props
  error?: string
  isSubmitting?: boolean
  onGoogleSignIn?: () => void
}

export function AccountSetup({
  firstName,
  lastName,
  email,
  password,
  onFirstNameChange,
  onLastNameChange,
  onEmailChange,
  onPasswordChange,
  onNext,
  // Destructured new props
  error,
  isSubmitting,
  onGoogleSignIn,
}: Step1AccountProps) {
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isPasswordValid = password.length >= 8
  const isFormValid = firstName.trim() && lastName.trim() && email.trim() && password.trim() && isPasswordValid

  const validateForm = () => {
    const result = signupSchema.safeParse({ firstName, lastName, email, password })

    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error.errors.forEach((err) => {
        const field = err.path[0] as string
        newErrors[field] = err.message
      })
      setErrors(newErrors)
      return false
    }

    setErrors({})
    return true
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
        <CardTitle className="text-xl sm:text-2xl">Create your account</CardTitle>
        <CardDescription className="text-sm sm:text-base">Let's get started with your refinance alerts</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <Button
            variant="outline"
            className="w-full h-11 sm:h-12 bg-transparent"
            onClick={(e) => {
              e.preventDefault()
              onGoogleSignIn?.()
            }}
            disabled={isSubmitting}
            aria-label="Sign up with Google"
          >
            <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign up with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

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
                placeholder="Enter your first name"
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
                placeholder="Enter your last name"
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
                placeholder="you@example.com"
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
              <Label htmlFor="password" className="text-sm sm:text-base">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  onPasswordChange(e.target.value)
                  if (errors.password) setErrors({ ...errors, password: "" })
                }}
                placeholder="Create a secure password"
                className="h-10"
                autoComplete="new-password"
                required
                minLength={8}
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
              />
              {errors.password && (
                <p id="password-error" className="text-sm text-destructive" role="alert">
                  {errors.password}
                </p>
              )}
              {!errors.password && password.length === 0 && (
                <p className="text-sm text-muted-foreground">Must be at least 8 characters</p>
              )}
            </div>
          </div>

          {/* Added error message display */}
          {error && (
            <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="pt-2">
            <Button
              onClick={handleContinue}
              className="w-full h-11 sm:h-12"
              disabled={!isFormValid || isSubmitting}
              aria-label="Continue to next step"
            >
              {/* Show loading state */}
              {isSubmitting ? "Creating account..." : "Continue"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
