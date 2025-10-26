import type React from "react"
import type { Metadata, Viewport } from "next"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import "@/lib/env"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "MortMonitor - Smart Mortgage Refinancing Alerts",
    template: "%s | MortMonitor",
  },
  description:
    "Never miss the perfect time to refinance. Intelligent platform that monitors market rates and alerts you when refinancing could save you money.",
  keywords: ["mortgage refinancing", "refinance calculator", "mortgage rates", "home loan refinancing", "rate alerts"],
  authors: [{ name: "MortMonitor" }],
  creator: "MortMonitor",
  publisher: "MortMonitor",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' fontSize='90'>📊</text></svg>",
        type: "image/svg+xml",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://refinancealert.com",
    title: "MortMonitor - Smart Mortgage Refinancing Alerts",
    description:
      "Never miss the perfect time to refinance. Get intelligent alerts when market rates could save you money.",
    siteName: "MortMonitor",
  },
  twitter: {
    card: "summary_large_image",
    title: "MortMonitor - Smart Mortgage Refinancing Alerts",
    description:
      "Never miss the perfect time to refinance. Get intelligent alerts when market rates could save you money.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="font-sans antialiased">
        <Suspense fallback={null}>{children}</Suspense>
        <Toaster />
      </body>
    </html>
  )
}
