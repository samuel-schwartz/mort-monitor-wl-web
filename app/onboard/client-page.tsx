"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingDown } from "lucide-react";
import { AccountSetup } from "./_components/account-setup";
import { createUser } from "@/app/_actions/users";
import { Spinner } from "@/components/ui/spinner";

export default function OnboardingClientPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleAccountCreated = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      const result = await createUser({
        firstName,
        lastName,
        email,
        password,
      });

      if (!result.success) {
        setError(result.error || "Failed to create account");
        setIsSubmitting(false);
        return;
      }

      // Pass user data to next step via URL params
      const params = new URLSearchParams({
        userId: result.userId || "",
        firstName,
        lastName,
        email,
      });
      router.push(`/onboard/setup?${params.toString()}`);
    } catch (err) {
      console.error("[v0] Account creation failed:", err);
      setError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      // Create mock user with Google credentials for testing
      const result = await createUser({
        firstName: "Google",
        lastName: "User",
        email: "google@example.com",
        password: "mock-google-password",
      });

      if (!result.success) {
        setError(result.error || "Failed to create account");
        setIsSubmitting(false);
        return;
      }

      // Pass user data to next step via URL params
      const params = new URLSearchParams({
        userId: result.userId || "",
        firstName: "Google",
        lastName: "User",
        email: "google@example.com",
      });
      router.push(`/onboard/setup?${params.toString()}`);
    } catch (err) {
      console.error("[v0] Google sign-in failed:", err);
      setError("An unexpected error occurred");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
            <Spinner className="h-12 w-12" />
            <p className="text-lg font-semibold">Creating your account...</p>
          </div>
        </div>
      )}

      <header className="border-b bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
            <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
              RefinanceAlert
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <AccountSetup
          firstName={firstName}
          lastName={lastName}
          email={email}
          password={password}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onNext={handleAccountCreated}
          onGoogleSignIn={handleGoogleSignIn}
          error={error}
          isSubmitting={isSubmitting}
        />
      </main>
    </div>
  );
}
