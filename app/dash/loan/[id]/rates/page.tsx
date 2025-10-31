"use client";
import { SmallMultiplesRates } from "./_components/small-multiples-rates";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, RefreshCw, DollarSign, Home } from "lucide-react";
import { useState } from "react";
import { CurrentLoan } from "@/app/dash/loan/[id]/rates/_components/current-loan";
import { LoanInfoCardShort } from "@/app/dash/loan/[id]/rates/_components/loan-info-card-short";
import { useParams } from "next/navigation";

export default function RatesPage() {
  const [lastUpdate, setLastUpdate] = useState("2025-01-21 10:30 AM");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentMarketRate = 5.85;
  const currentLoanRate = 6.625;
  const potentialSavings = 213;
  const breakEvenMonths = 18;

  const loanData = {
    borrowerName: "Alex Rivera",
    currentRate: 6.625,
    loanAmount: 385000,
    monthlyPayment: 2847,
    remainingBalance: 378500,
    propertyAddress: "123 Main St, Eau Claire, WI 54701",
  };


    const params = useParams<{ id: string }>();

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Rate Monitoring
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Track current market rates and monitor refinancing opportunities
        </p>
      </div>

      <LoanInfoCardShort loanId={params.id} loanData={loanData} />

      <SmallMultiplesRates
        countyFips="05535" // Eau Claire County, WI (example)
        currentLoan={{
          outstandingPrincipalUsd: 318_500,
          currentRatePct: 7.125,
          remainingTermMonths: 296, // ~24y8m left
          propertyValueUsd: 420_000,
          // optional: if backend doesn't return closing costs:
          assumedClosingCostsUsd: 4200,
        }}
      />
    </div>
  );
}
