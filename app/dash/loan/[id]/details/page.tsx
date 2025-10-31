"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pencil, X, Save, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import PropertyForm from "@/components/onboard/property-form";
import { getUserFromContext } from "@/app/_providers/user-provider";

/** ---------- Helpers ---------- */
function toNumber(v: any): number {
  const n =
    typeof v === "number"
      ? v
      : Number.parseFloat(String(v).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}
function clamp(n: number, low: number, high: number) {
  return Math.min(Math.max(n, low), high);
}
function monthlyPaymentPAndI(
  principal: number,
  annualRatePct: number,
  termYears: number,
): number {
  const P = toNumber(principal);
  const y = clamp(toNumber(termYears), 0.0001, 1000);
  const r = toNumber(annualRatePct) / 100 / 12;
  const n = Math.round(y * 12);
  if (P <= 0 || n <= 0) return 0;
  if (r === 0) return P / n;
  const f = Math.pow(1 + r, n);
  return (P * r * f) / (f - 1);
}
function remainingMonths(
  balance: number,
  annualRatePct: number,
  payment: number,
): number {
  const B = toNumber(balance);
  const r = toNumber(annualRatePct) / 100 / 12;
  const Pmt = toNumber(payment);
  if (B <= 0 || Pmt <= 0) return 0;
  if (r === 0) return Math.ceil(B / Pmt);
  const inside = 1 - (r * B) / Pmt;
  if (inside <= 0) return Number.POSITIVE_INFINITY;
  return Math.ceil(-Math.log(inside) / Math.log(1 + r));
}
function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}
function fmtCurrency(n: number) {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}
function fmtPercent(n: number) {
  return `${n.toFixed(3).replace(/\.?0+$/, "")}%`;
}
function toISODateLocal(d: Date) {
  const pad = (x: number) => String(x).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** ---------- Types & mock data (swap with real API) ---------- */
type Loan = {
  id: string;
  propertyAddress: string;
  propertyPrice: number;
  loanAmount: number;
  currentRate: number; // APR %
  termYears: number;
  startDate: string; // yyyy-mm-dd
  remainingBalance: number;
  taxesMonthly?: number;
  insuranceMonthly?: number;
  creditScore?: string;
};

async function fetchLoan(loanId: string): Promise<Loan> {
  return {
    id: loanId,
    propertyAddress: "123 Maple St, Eau Claire, WI 54701",
    propertyPrice: 350_000,
    loanAmount: 300_000,
    currentRate: 6.25,
    termYears: 30,
    startDate: "2022-09-01",
    remainingBalance: 285_500,
    taxesMonthly: 0,
    insuranceMonthly: 0,
    creditScore: "700-749",
  };
}

async function updateLoan(
  loanId: string,
  updated: Partial<Loan>,
): Promise<{ ok: true }> {
  console.info("PUT /api/loans/" + loanId, updated);
  return { ok: true };
}

/** ---------- Page ---------- */
export default function LoanDetailsPage() {

    const router = useRouter()

  const params = useParams<{ id: string }>();
  const loanId = decodeURIComponent(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loan, setLoan] = useState<Loan | null>(null);

  // edit mode via URL hash === '#edit'
  const [editMode, setEditMode] = useState<boolean>(false);
  useEffect(() => {
    const update = () =>
      setEditMode(window.location.hash.toLowerCase() === "#edit");
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  // Editable state
  const [address, setAddress] = useState("");
  const [propertyPrice, setPropertyPrice] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [termYears, setTermYears] = useState<number>(30);
  const [startDate, setStartDate] = useState<string>(
    toISODateLocal(new Date()),
  );
  const [balance, setBalance] = useState<number>(0);
  const [creditScore, setCreditScore] = useState<string>("");

  const clientData = {}
    const [formData, setFormData] = useState({
    propertyAddress: clientData.property?.address?.split(",")[0] || "1348 Armstrong Pl",
    propertyCity: clientData.property?.city || "Eau Claire",
    propertyState: clientData.property?.state || "WI",
    propertyZip: clientData.property?.zipCode || "54701",
    propertyPrice: clientData.property?.purchasePrice?.toString() || "750000",
    originalLoanAmount: clientData.property?.originalLoanAmount?.toString() || "600000",
    currentBalance: clientData.property?.currentBalance?.toString() || "550000",
    interestRate: clientData.property?.interestRate?.toString() || "6.5",
    termLength: clientData.property?.termLength?.toString() || "30",
    startMonth: clientData.property?.loanStartMonth?.toString() || "1",
    startYear: clientData.property?.loanStartYear?.toString() || "2020",
    monthlyPayment: clientData.property?.monthlyPayment?.toString() || "3795",
    creditScore: clientData.creditScore || "700-749",
  })
  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await fetchLoan(loanId);
      setLoan(data);

      setAddress(data.propertyAddress);
      setPropertyPrice(data.propertyPrice);
      setLoanAmount(data.loanAmount);
      setRate(data.currentRate);
      setTermYears(data.termYears);
      setStartDate(data.startDate);
      setBalance(data.remainingBalance);
      setCreditScore(data.creditScore || "700-749");

      setLoading(false);
    })();
  }, [loanId]);

  

  function enterEdit() {
    if (typeof window !== "undefined") window.location.hash = "edit";
  }
  function exitEdit() {
    if (typeof window !== "undefined") window.location.hash = "";
  }

  async function onSave() {
    if (!loan) return;
    setSaving(true);
    const payload: Partial<Loan> = {
      propertyAddress: address,
      propertyPrice,
      loanAmount,
      currentRate: rate,
      termYears,
      startDate,
      remainingBalance: balance,
      creditScore,
    };
    await updateLoan(loan.id, payload);
    setLoan({ ...loan, ...payload });
    setSaving(false);
    // Exit edit mode after successful save
    exitEdit();
  }

  if (loading || !loan) {
    return (
      <div className="p-6">
        <div className="animate-pulse h-8 w-40 rounded bg-gray-200 mb-6" />
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-64 rounded bg-gray-100" />
          <div className="h-64 rounded bg-gray-100" />
        </div>
      </div>
    );
  }



  return (
    <main className="p-4 md:p-6 max-w-6xl mx-auto">
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loan details</h1>
        </div>
      </header>



      <PropertyForm
              mode="review"
              firstName={getUserFromContext()?.firstName || ""}
              propertyAddress={formData.propertyAddress}
              propertyCity={formData.propertyCity}
              propertyState={formData.propertyState}
              propertyZip={formData.propertyZip}
              propertyPrice={formData.propertyPrice}
              originalLoanAmount={formData.originalLoanAmount}
              currentBalance={formData.currentBalance}
              interestRate={formData.interestRate}
              termLength={formData.termLength}
              startMonth={formData.startMonth}
              startYear={formData.startYear}
              monthlyPayment={formData.monthlyPayment}
              creditScore={formData.creditScore}
              onPropertyAddressChange={(value) => setFormData((prev) => ({ ...prev, propertyAddress: value }))}
              onPropertyCityChange={(value) => setFormData((prev) => ({ ...prev, propertyCity: value }))}
              onPropertyStateChange={(value) => setFormData((prev) => ({ ...prev, propertyState: value }))}
              onPropertyZipChange={(value) => setFormData((prev) => ({ ...prev, propertyZip: value }))}
              onPropertyPriceChange={(value) => setFormData((prev) => ({ ...prev, propertyPrice: value }))}
              onOriginalLoanAmountChange={(value) => setFormData((prev) => ({ ...prev, originalLoanAmount: value }))}
              onCurrentBalanceChange={(value) => setFormData((prev) => ({ ...prev, currentBalance: value }))}
              onInterestRateChange={(value) => setFormData((prev) => ({ ...prev, interestRate: value }))}
              onTermLengthChange={(value) => setFormData((prev) => ({ ...prev, termLength: value }))}
              onStartMonthChange={(value) => setFormData((prev) => ({ ...prev, startMonth: value }))}
              onStartYearChange={(value) => setFormData((prev) => ({ ...prev, startYear: value }))}
              onMonthlyPaymentChange={(value) => setFormData((prev) => ({ ...prev, monthlyPayment: value }))}
              onCreditScoreChange={(value) => setFormData((prev) => ({ ...prev, creditScore: value }))}
              onNext={onSave}
            />

          <div className="max-w-4xl mx-auto mt-5 grid justify-items-center rounded-2xl border p-4 md:p-5 shadow-sm">
                          
                <button className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium border-red-800 bg-red-600 text-white hover:bg-red-700">
                  <Trash2 className="h-4 w-4" /> 
                  Delete Property
                </button>
                </div>
    </main>
  );
}

/** ---------- Small UI primitives ---------- */
function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border p-4 md:p-5 shadow-sm">
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      {children}
    </div>
  );
}

function Field({
  label,
  valueNode,
  inputNode,
  edit,
  full,
}: {
  label: string;
  valueNode: React.ReactNode;
  inputNode: React.ReactNode;
  edit: boolean;
  full?: boolean;
}) {
  return (
    <label className={`grid gap-1 ${full ? "md:col-span-2" : ""}`}>
      <span className="text-sm text-gray-600">{label}</span>
      {edit ? inputNode : <span className="py-2">{valueNode}</span>}
    </label>
  );
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border p-3">
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
      {hint ? <p className="text-[11px] text-gray-500 mt-1">{hint}</p> : null}
    </div>
  );
}
