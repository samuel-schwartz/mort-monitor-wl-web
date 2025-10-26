"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BackButtonProps {
  brandColor?: string
}

export function BackButton({ brandColor }: BackButtonProps) {
  const router = useRouter()

  const buttonStyle = brandColor
    ? {
        backgroundColor: brandColor,
        color: "white",
        borderColor: brandColor,
      }
    : undefined

  return (
    <Button
      variant={brandColor ? "default" : "default"}
      size="sm"
      onClick={() => router.back()}
      style={buttonStyle}
      className="hover:opacity-90"
    >
      <ArrowLeft className="h-4 w-4 mr-2" />
      Go Back
    </Button>
  )
}
