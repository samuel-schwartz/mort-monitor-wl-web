import type { Metadata } from "next";
import OnboardingClientPage from "./client-page";

export const metadata: Metadata = {
  title: "Create Account | MortMonitor",
  description:
    "Create your MortMonitor account to start monitoring mortgage refinance opportunities and save money on your home loan.",
  openGraph: {
    title: "Create Account | MortMonitor",
    description:
      "Create your MortMonitor account to start monitoring mortgage refinance opportunities.",
    type: "website",
  },
};

export default function OnboardingPage() {
  return <OnboardingClientPage />;
}
