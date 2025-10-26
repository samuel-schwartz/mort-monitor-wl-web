"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ClientPropertyReview } from "./client-property-review";
import { AlertSelection } from "@/app/onboard/_components/alert-selection";
import { useToast } from "@/hooks/use-toast";
import { createAlert } from "@/app/_actions/alerts";
import { updateProperty } from "@/app/_actions/properties";
import { updateClient } from "@/app/_actions/clients";
import { Spinner } from "@/components/ui/spinner";
import type { AlertConfig } from "@/types/alerts";

interface PrefilledData {
  token: string;
  clientId: string;
  clientFirstName: string;
  clientLastName: string;
  clientEmail: string;
  clientPhone: string;
  brokerName: string;
  brokerCompany: string;
  propertyId: string;
  propertyAddress: string;
  propertyCity: string;
  propertyState: string;
  propertyZip: string;
  propertyPrice: string;
  originalLoanAmount: string;
  currentBalance: string;
  interestRate: string;
  termLength: string;
  startMonth: string;
  startYear: string;
  monthlyPayment: string;
  creditScore: string;
  preSelectedAlerts?: AlertConfig[];
}

export function PrefilledOnboarding({ data }: { data: PrefilledData }) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<"review" | "alerts">("review");
  const [isEditing, setIsEditing] = useState(false);
  const [selectedAlerts, setSelectedAlerts] = useState<AlertConfig[]>(
    data.preSelectedAlerts || [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [firstName, setFirstName] = useState(data.clientFirstName);
  const [lastName, setLastName] = useState(data.clientLastName);
  const [phone, setPhone] = useState(data.clientPhone);
  const [propertyAddress, setPropertyAddress] = useState(data.propertyAddress);
  const [propertyCity, setPropertyCity] = useState(data.propertyCity);
  const [propertyState, setPropertyState] = useState(data.propertyState);
  const [propertyZip, setPropertyZip] = useState(data.propertyZip);
  const [propertyPrice, setPropertyPrice] = useState(data.propertyPrice);
  const [originalLoanAmount, setOriginalLoanAmount] = useState(
    data.originalLoanAmount,
  );
  const [currentBalance, setCurrentBalance] = useState(data.currentBalance);
  const [interestRate, setInterestRate] = useState(data.interestRate);
  const [termLength, setTermLength] = useState(data.termLength);
  const [startMonth, setStartMonth] = useState(data.startMonth);
  const [startYear, setStartYear] = useState(data.startYear);
  const [monthlyPayment, setMonthlyPayment] = useState(data.monthlyPayment);
  const [creditScore, setCreditScore] = useState(data.creditScore);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);

    try {
      await updateClient(data.clientId, {
        firstName,
        lastName,
        phone,
        creditScore: creditScore as any,
      });

      // Update property information
      await updateProperty(data.propertyId, {
        address: propertyAddress,
        city: propertyCity,
        state: propertyState,
        zip: propertyZip,
        propertyPrice: Number.parseInt(propertyPrice),
        originalLoanAmount: Number.parseInt(originalLoanAmount),
        currentBalance: Number.parseInt(currentBalance),
        interestRate: Number.parseFloat(interestRate),
        termLength: Number.parseInt(termLength),
        startMonth: Number.parseInt(startMonth),
        startYear: Number.parseInt(startYear),
        monthlyPayment: Number.parseInt(monthlyPayment),
        creditScore: creditScore as any,
      });

      toast({
        title: "Changes Saved",
        description: "Your information has been updated successfully",
      });

      setIsEditing(false);
    } catch (error) {
      console.error("[v0] Error updating information:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save changes. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContinue = () => {
    setCurrentStep("alerts");
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      for (const alertConfig of selectedAlerts) {
        await createAlert({
          userId: data.clientId,
          propertyId: data.propertyId,
          ...alertConfig,
        });
      }

      router.push(
        `/dash/welcome?firstName=${encodeURIComponent(firstName)}&propertyId=${data.propertyId}`,
      );
    } catch (error) {
      console.error("[v0] Error setting up alerts:", error);
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Failed to set up alerts. Please try again.",
      });
      setIsSubmitting(false);
    }
  };

  if (currentStep === "review") {
    return (
      <>
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
              <Spinner className="h-12 w-12" />
              <p className="text-lg font-semibold">Saving your changes...</p>
            </div>
          </div>
        )}

        <ClientPropertyReview
          firstName={firstName}
          lastName={lastName}
          phone={phone}
          propertyAddress={propertyAddress}
          propertyCity={propertyCity}
          propertyState={propertyState}
          propertyZip={propertyZip}
          propertyPrice={propertyPrice}
          originalLoanAmount={originalLoanAmount}
          currentBalance={currentBalance}
          interestRate={interestRate}
          termLength={termLength}
          startMonth={startMonth}
          startYear={startYear}
          monthlyPayment={monthlyPayment}
          creditScore={creditScore}
          brokerName={data.brokerName}
          brokerCompany={data.brokerCompany}
          isEditing={isEditing}
          onFirstNameChange={setFirstName}
          onLastNameChange={setLastName}
          onPhoneChange={setPhone}
          onPropertyAddressChange={setPropertyAddress}
          onPropertyCityChange={setPropertyCity}
          onPropertyStateChange={setPropertyState}
          onPropertyZipChange={setPropertyZip}
          onPropertyPriceChange={setPropertyPrice}
          onOriginalLoanAmountChange={setOriginalLoanAmount}
          onCurrentBalanceChange={setCurrentBalance}
          onInterestRateChange={setInterestRate}
          onTermLengthChange={setTermLength}
          onStartMonthChange={setStartMonth}
          onStartYearChange={setStartYear}
          onMonthlyPaymentChange={setMonthlyPayment}
          onCreditScoreChange={setCreditScore}
          onEdit={handleEdit}
          onSave={handleSave}
          onContinue={handleContinue}
        />
      </>
    );
  }

  return (
    <>
      {isSubmitting && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-8 flex flex-col items-center gap-4 shadow-xl">
            <Spinner className="h-12 w-12" />
            <p className="text-lg font-semibold">Setting up your alerts...</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold mb-2">Review Your Alerts</h1>
            <p className="text-muted-foreground">
              Your broker has recommended these alerts. You can modify them or
              keep the recommendations.
            </p>
          </div>

          <AlertSelection
            firstName={firstName}
            selectedAlerts={selectedAlerts}
            propertyPrice={propertyPrice}
            currentBalance={currentBalance}
            startMonth={startMonth}
            startYear={startYear}
            termLength={termLength}
            onAlertsChange={setSelectedAlerts}
            onNext={handleFinalSubmit}
            onBack={() => setCurrentStep("review")}
          />
        </div>
      </div>
    </>
  );
}
