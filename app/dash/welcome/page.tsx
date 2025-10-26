"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function WelcomePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showConfetti, setShowConfetti] = useState(true)
  const firstName = searchParams.get("firstName") || ""

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000)
    return () => clearTimeout(timer)
  }, [])

  const handleContinue = () => {
    router.push("/dash/")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10px",
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div
                className="w-2 h-2 sm:w-3 sm:h-3"
                style={{
                  backgroundColor: ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"][
                    Math.floor(Math.random() * 6)
                  ],
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Welcome Card */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl p-8 sm:p-12 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
            <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-500" />
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold mb-4">Congratulations{firstName ? `, ${firstName}` : ""}!</h1>

        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Your alerts are now set and actively monitoring for refinance opportunities. We'll notify you as soon as we
          find potential savings!
        </p>

        <Button onClick={handleContinue} size="lg" className="w-full">
          Go to Dashboard
        </Button>
      </div>

      {/* Confetti Animation Styles */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotateZ(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotateZ(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti linear forwards;
        }
      `}</style>
    </div>
  )
}
