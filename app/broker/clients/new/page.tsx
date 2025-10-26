import type { Metadata } from "next"
import BrokerClientOnboardingPage from "./client-page"

export const metadata: Metadata = {
  title: "Add New Client | MortMonitor",
  description: "Add a new client to your portfolio",
}

export default function NewClientPage() {
  return <BrokerClientOnboardingPage />
}
