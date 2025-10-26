import type { Metadata } from "next"
import OnboardingSetupClientPage from "./client-page"

export const metadata: Metadata = {
  title: "Setup Your Property | RefinanceAlert",
  description: "Add your property details and configure refinance alerts to start saving on your mortgage.",
  openGraph: {
    title: "Setup Your Property | RefinanceAlert",
    description: "Add your property details and configure refinance alerts.",
    type: "website",
  },
}

export default function OnboardingSetupPage() {
  return <OnboardingSetupClientPage />
}
