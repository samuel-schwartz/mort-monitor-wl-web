"use client";

import type React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Lock } from "lucide-react";
import type { AlertConfig } from "@/types/alerts";
import { calculateTotalAlertCount, PRICING } from "@/lib/config/pricing";

interface Step5PaymentProps {
  firstName: string;
  selectedAlerts: AlertConfig[];
  cardNumber: string;
  cardExpiry: string;
  cardCvc: string;
  cardName: string;
  onCardNumberChange: (value: string) => void;
  onCardExpiryChange: (value: string) => void;
  onCardCvcChange: (value: string) => void;
  onCardNameChange: (value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function PaymentSetup({
  firstName,
  selectedAlerts,
  cardNumber,
  cardExpiry,
  cardCvc,
  cardName,
  onCardNumberChange,
  onCardExpiryChange,
  onCardCvcChange,
  onCardNameChange,
  onSubmit,
  onBack,
  isSubmitting = false,
}: Step5PaymentProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateCardNumber = (value: string): boolean => {
    const cleaned = value.replace(/\s/g, "");
    return cleaned.length === 16 && /^\d+$/.test(cleaned);
  };

  const validateExpiry = (value: string): boolean => {
    const match = value.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    const month = Number.parseInt(match[1]);
    const year = Number.parseInt(match[2]);
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;

    if (month < 1 || month > 12) return false;
    if (year < currentYear || (year === currentYear && month < currentMonth))
      return false;
    return true;
  };

  const validateCvc = (value: string): boolean => {
    return value.length === 3 || value.length === 4;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, string> = {};

    if (!cardNumber) {
      newErrors.cardNumber = "Card number is required";
    } else if (!validateCardNumber(cardNumber)) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }

    if (!cardExpiry) {
      newErrors.cardExpiry = "Expiry date is required";
    } else if (!validateExpiry(cardExpiry)) {
      newErrors.cardExpiry = "Please enter a valid expiry date (MM/YY)";
    }

    if (!cardCvc) {
      newErrors.cardCvc = "CVC is required";
    } else if (!validateCvc(cardCvc)) {
      newErrors.cardCvc = "Please enter a valid 3 or 4-digit CVC";
    }

    if (!cardName.trim()) {
      newErrors.cardName = "Cardholder name is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit();
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.slice(0, 19); // Max 16 digits + 3 spaces
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const totalAlertCount = calculateTotalAlertCount(selectedAlerts);
  const monthlyPrice = totalAlertCount * PRICING.pricePerAlertPerMonth;
  const annualPrice = totalAlertCount * PRICING.pricePerAlertPerYear;

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-xl sm:text-2xl">
          Activate alerts for ${monthlyPrice}/month
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          Enter your payment details to start monitoring, {firstName}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Your Plan</span>
            <Badge variant="secondary">{totalAlertCount} Alerts Active</Badge>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">${monthlyPrice}/month</div>
            <div className="text-sm text-muted-foreground">
              Billed annually at ${annualPrice}/year
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber" className="text-sm sm:text-base">
                Card Number
              </Label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="cardNumber"
                  type="text"
                  value={cardNumber}
                  onChange={(e) => {
                    onCardNumberChange(formatCardNumber(e.target.value));
                    if (errors.cardNumber)
                      setErrors({ ...errors, cardNumber: "" });
                  }}
                  placeholder="1234 5678 9012 3456"
                  className="pl-10 h-11 sm:h-10"
                  inputMode="numeric"
                  autoFocus
                  required
                  disabled={isSubmitting}
                  aria-invalid={!!errors.cardNumber}
                />
              </div>
              {errors.cardNumber && (
                <p className="text-sm text-destructive">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cardExpiry" className="text-sm sm:text-base">
                  Expiry Date
                </Label>
                <Input
                  id="cardExpiry"
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => {
                    onCardExpiryChange(formatExpiry(e.target.value));
                    if (errors.cardExpiry)
                      setErrors({ ...errors, cardExpiry: "" });
                  }}
                  placeholder="MM/YY"
                  className="h-11 sm:h-10"
                  inputMode="numeric"
                  maxLength={5}
                  required
                  disabled={isSubmitting}
                  aria-invalid={!!errors.cardExpiry}
                />
                {errors.cardExpiry && (
                  <p className="text-sm text-destructive">
                    {errors.cardExpiry}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cardCvc" className="text-sm sm:text-base">
                  CVC
                </Label>
                <Input
                  id="cardCvc"
                  type="text"
                  value={cardCvc}
                  onChange={(e) => {
                    onCardCvcChange(
                      e.target.value.replace(/\D/g, "").slice(0, 4),
                    );
                    if (errors.cardCvc) setErrors({ ...errors, cardCvc: "" });
                  }}
                  placeholder="123"
                  className="h-11 sm:h-10"
                  inputMode="numeric"
                  maxLength={4}
                  required
                  disabled={isSubmitting}
                  aria-invalid={!!errors.cardCvc}
                />
                {errors.cardCvc && (
                  <p className="text-sm text-destructive">{errors.cardCvc}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardName" className="text-sm sm:text-base">
                Cardholder Name
              </Label>
              <Input
                id="cardName"
                type="text"
                value={cardName}
                onChange={(e) => {
                  onCardNameChange(e.target.value);
                  if (errors.cardName) setErrors({ ...errors, cardName: "" });
                }}
                placeholder="John Doe"
                className="h-11 sm:h-10"
                autoComplete="cc-name"
                required
                disabled={isSubmitting}
                aria-invalid={!!errors.cardName}
              />
              {errors.cardName && (
                <p className="text-sm text-destructive">{errors.cardName}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lock className="h-4 w-4" />
            <span>Your payment information is secure and encrypted</span>
          </div>
        </form>

        <div className="flex gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="flex-1 h-11 sm:h-12 bg-transparent"
            disabled={isSubmitting}
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 h-11 sm:h-12"
            disabled={
              !cardNumber ||
              !cardExpiry ||
              !cardCvc ||
              !cardName ||
              isSubmitting
            }
          >
            {isSubmitting ? "Processing..." : "Activate Alerts"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
