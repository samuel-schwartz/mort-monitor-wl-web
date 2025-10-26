"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Mail, User, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { acceptInvitation } from "@/app/actions/tokens"
import { getDaysUntilExpiration } from "@/lib/utils/tokens"
import { inviteAcceptanceSchema } from "@/lib/validation/schemas"

interface Invitation {
  token: string
  brokerName: string
  brokerCompany: string
  clientEmail: string
  expiresAt: string
}

export function InviteAcceptance({ invitation }: { invitation: Invitation }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleAccept = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})

    const validation = inviteAcceptanceSchema.safeParse({
      token: invitation.token,
      firstName,
      lastName,
      password,
    })

    if (!validation.success) {
      const fieldErrors: Record<string, string> = {}
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as string
        fieldErrors[field] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    if (password !== confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" })
      return
    }

    setIsLoading(true)

    try {
      const result = await acceptInvitation(invitation.token, firstName, lastName, password)

      if (!result.success) {
        setErrors({ form: result.error })
        setIsLoading(false)
        return
      }

      toast({
        title: "Welcome to MortMonitor!",
        description: "Your account has been created successfully.",
      })

      // Redirect to login page
      router.push("/login")
    } catch (err) {
      setErrors({ form: "Failed to accept invitation. Please try again." })
      setIsLoading(false)
    }
  }

  const daysUntilExpiry = getDaysUntilExpiration(invitation.expiresAt)

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <Mail className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl">You've Been Invited!</CardTitle>
          <CardDescription className="text-base">
            {invitation.brokerName} from {invitation.brokerCompany} has invited you to join MortMonitor
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Your Broker</p>
                <p className="font-semibold">
                  {invitation.brokerName} - {invitation.brokerCompany}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Your Email</p>
                <p className="font-semibold">{invitation.clientEmail}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Monitor Your Refinancing Opportunities</p>
                <p className="text-sm text-muted-foreground">
                  Get alerts when rates drop and you can save money on your mortgage
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Expert Guidance</p>
                <p className="text-sm text-muted-foreground">
                  Your broker will help you navigate refinancing decisions
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">No Cost to You</p>
                <p className="text-sm text-muted-foreground">Your broker covers all monitoring fees</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleAccept} className="space-y-4 pt-4 border-t">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  required
                  disabled={isLoading}
                />
                {errors.firstName && <p className="text-xs text-red-600">{errors.firstName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  required
                  disabled={isLoading}
                />
                {errors.lastName && <p className="text-xs text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Create Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter a secure password"
                required
                disabled={isLoading}
              />
              {errors.password && <p className="text-xs text-red-600">{errors.password}</p>}
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters with uppercase, lowercase, and number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                required
                disabled={isLoading}
              />
              {errors.confirmPassword && <p className="text-xs text-red-600">{errors.confirmPassword}</p>}
            </div>

            {errors.form && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-md text-sm">
                {errors.form}
              </div>
            )}

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Accept Invitation & Create Account"}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              This invitation expires in {daysUntilExpiry} day{daysUntilExpiry !== 1 ? "s" : ""}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
