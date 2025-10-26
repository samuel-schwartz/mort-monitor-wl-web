"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { changePassword } from "@/app/actions/auth"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Check, X } from "lucide-react"

interface ChangePasswordProps {
  userEmail?: string
}

export function ChangePassword({ userEmail }: ChangePasswordProps) {
  const { toast } = useToast()
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [isPasswordSaving, setIsPasswordSaving] = useState(false)

  // Check if user is using Google Sign-In (for MVP, check if email ends with @gmail.com)
  const isGoogleUser = userEmail?.endsWith("@gmail.com") || false

  const handlePasswordChange = async () => {
    setPasswordError("")

    if (!newPassword) {
      setPasswordError("New password is required")
      return
    }

    const passwordCriteria = {
      minLength: newPassword.length >= 8,
      hasUppercase: /[A-Z]/.test(newPassword),
      hasLowercase: /[a-z]/.test(newPassword),
      hasNumber: /\d/.test(newPassword),
    }

    const isPasswordValid = Object.values(passwordCriteria).every(Boolean)

    if (!isPasswordValid) {
      setPasswordError("Password must meet all criteria")
      return
    }

    setIsPasswordSaving(true)
    try {
      const result = await changePassword("", newPassword)

      if (result.success) {
        toast({
          title: "Password Changed",
          description: "Your password has been updated successfully",
        })
        setNewPassword("")
        setIsChangingPassword(false)
      } else {
        setPasswordError(result.error || "Failed to change password")
      }
    } catch (error) {
      setPasswordError("An unexpected error occurred")
    } finally {
      setIsPasswordSaving(false)
    }
  }

  // Don't show password change for Google users
  if (isGoogleUser) {
    return null
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold">Change Password</h3>
        <p className="text-sm text-muted-foreground">Update your password to keep your account secure</p>
      </div>

      {!isChangingPassword ? (
        <Button variant="outline" onClick={() => setIsChangingPassword(true)}>
          Change Password
        </Button>
      ) : (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                disabled={isPasswordSaving}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="bg-muted/30 rounded-md p-3 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Password must include:</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm">
                {newPassword.length >= 8 ? (
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                )}
                <span className={newPassword.length >= 8 ? "text-foreground" : "text-muted-foreground"}>
                  At least 8 characters
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {/[A-Z]/.test(newPassword) ? (
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                )}
                <span className={/[A-Z]/.test(newPassword) ? "text-foreground" : "text-muted-foreground"}>
                  One uppercase letter
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {/[a-z]/.test(newPassword) ? (
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                )}
                <span className={/[a-z]/.test(newPassword) ? "text-foreground" : "text-muted-foreground"}>
                  One lowercase letter
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {/\d/.test(newPassword) ? (
                  <Check className="h-4 w-4 text-green-600 flex-shrink-0" />
                ) : (
                  <X className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                )}
                <span className={/\d/.test(newPassword) ? "text-foreground" : "text-muted-foreground"}>One number</span>
              </div>
            </div>
          </div>

          {passwordError && <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>}

          <div className="flex gap-2">
            <Button onClick={handlePasswordChange} disabled={!newPassword || isPasswordSaving}>
              {isPasswordSaving ? "Changing..." : "Change Password"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsChangingPassword(false)
                setNewPassword("")
                setPasswordError("")
              }}
              disabled={isPasswordSaving}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
