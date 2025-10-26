"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { TrendingDown, Mail, Eye, EyeOff, Check, X } from "lucide-react"
import { acceptInvitation } from "@/app/actions/tokens"
import { authenticateWithGoogle } from "@/app/actions/users"
import { Spinner } from "@/components/ui/spinner"
import { useToast } from "@/hooks/use-toast"

interface InvitePasswordSetupProps {
  token: string
  email: string
}

export function InvitePasswordSetup({ token, email }: InvitePasswordSetupProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const isGmailEmail = email.toLowerCase().endsWith("@gmail.com")
  const hasMinLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase && hasNumber
  const isFormValid = password.trim() && isPasswordValid

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!password.trim()) newErrors.password = "Password is required"
    else if (!isPasswordValid) newErrors.password = "Password must meet all requirements"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return false
    }

    setErrors({})
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const result = await acceptInvitation(token, password)

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to accept invitation",
        })
        setIsSubmitting(false)
        return
      }

      // Redirect to prefilled onboarding to review alerts
      router.push(`/onboard/prefilled/${token}`)
    } catch (error) {
      console.error("[v0] Error accepting invitation:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      })
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true)

    try {
      // In production, this would use actual Google OAuth
      const result = await authenticateWithGoogle("mock-google-token")

      if (!result.success) {
        toast({
          variant: "destructive",
          title: "Error",
          description: result.error || "Failed to sign in with Google",
        })
        setIsSubmitting(false)
        return
      }

      // Redirect to prefilled onboarding
      router.push(`/onboard/prefilled/${token}`)
    } catch (error) {
      console.error("[v0] Error with Google sign-in:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      })
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
            <Spinner className="h-12 w-12" />
            <p className="text-lg font-semibold">Setting up your account...</p>
          </div>
        </div>
      )}

      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-center">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">RefinanceAlert</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <Card className="w-full max-w-lg mx-auto">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <Mail className="h-8 w-8 text-blue-600 dark:text-blue-500" />
            </div>
            <CardTitle className="text-xl sm:text-2xl">Welcome to RefinanceAlert!</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Your broker has invited you to monitor refinance opportunities. Set up your account to get started.
            </CardDescription>
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                Account email: <span className="font-semibold text-foreground">{email}</span>
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {isGmailEmail && (
                <>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 sm:h-12 bg-transparent"
                    onClick={handleGoogleSignIn}
                    disabled={isSubmitting}
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
                    Sign in with Google
                  </Button>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">Or set a password</span>
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Create Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      if (errors.password) setErrors({ ...errors, password: "" })
                    }}
                    placeholder="Create a secure password"
                    autoComplete="new-password"
                    required
                    minLength={8}
                    aria-invalid={!!errors.password}
                    autoFocus
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-destructive" role="alert">
                    {errors.password}
                  </p>
                )}
                <div className="space-y-2 pt-2">
                  <p className="text-sm font-medium text-muted-foreground">Password must contain:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      {hasMinLength ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={hasMinLength ? "text-green-600" : "text-muted-foreground"}>
                        At least 8 characters
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {hasUppercase ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={hasUppercase ? "text-green-600" : "text-muted-foreground"}>
                        One uppercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {hasLowercase ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={hasLowercase ? "text-green-600" : "text-muted-foreground"}>
                        One lowercase letter
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {hasNumber ? (
                        <Check className="h-4 w-4 text-green-600" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className={hasNumber ? "text-green-600" : "text-muted-foreground"}>One number</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-11 sm:h-12" disabled={!isFormValid || isSubmitting}>
                {isSubmitting ? "Creating Account..." : "Create Account & Continue"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
