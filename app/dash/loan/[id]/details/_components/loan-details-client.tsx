"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { Pencil, X, Save } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

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

type Loan = {
  id: string;
  propertyAddress: string;
  propertyPrice: number;
  loanAmount: number;
  currentRate: number;
  termYears: number;
  startDate?: string;
  remainingBalance: number;
  taxesMonthly?: number;
  insuranceMonthly?: number;
  creditScore?: string;
};

interface LoanDetailsClientProps {
  initialLoan: Loan;
}

export function LoanDetailsClient({ initialLoan }: LoanDetailsClientProps) {
  const [loan, setLoan] = useState<Loan>(initialLoan);
  const [saving, setSaving] = useState(false);

  const [editMode, setEditMode] = useState<boolean>(false);
  useEffect(() => {
    const update = () =>
      setEditMode(window.location.hash.toLowerCase() === "#edit");
    update();
    window.addEventListener("hashchange", update);
    return () => window.removeEventListener("hashchange", update);
  }, []);

  const [address, setAddress] = useState(loan.propertyAddress);
  const [propertyPrice, setPropertyPrice] = useState<number>(
    loan.propertyPrice,
  );
  const [loanAmount, setLoanAmount] = useState<number>(loan.loanAmount);
  const [rate, setRate] = useState<number>(loan.currentRate);
  const [termYears, setTermYears] = useState<number>(loan.termYears);
  const [startDate, setStartDate] = useState<string>(
    loan.startDate || toISODateLocal(new Date()),
  );
  const [balance, setBalance] = useState<number>(loan.remainingBalance);
  const [creditScore, setCreditScore] = useState<string>(
    loan.creditScore || "700-749",
  );

  const minMonthlyPaymentPI = useMemo(
    () => monthlyPaymentPAndI(loanAmount, rate, termYears),
    [loanAmount, rate, termYears],
  );
  const monthsRemaining = useMemo(() => {
    const n = remainingMonths(balance, rate, minMonthlyPaymentPI);
    return Number.isFinite(n) ? n : 0;
  }, [balance, rate, minMonthlyPaymentPI]);
  const forecastPayoffDate = useMemo(
    () => addMonths(new Date(), monthsRemaining),
    [monthsRemaining],
  );
  const futureInterestToPay = useMemo(() => {
    if (monthsRemaining <= 0 || minMonthlyPaymentPI === 0) return 0;
    return Math.max(0, minMonthlyPaymentPI * monthsRemaining - balance);
  }, [minMonthlyPaymentPI, monthsRemaining, balance]);
  const totalMonthlyPITI = useMemo(
    () =>
      minMonthlyPaymentPI +
      toNumber(loan?.taxesMonthly ?? 0) +
      toNumber(loan?.insuranceMonthly ?? 0),
    [minMonthlyPaymentPI, loan],
  );

  function enterEdit() {
    if (typeof window !== "undefined") window.location.hash = "edit";
  }

  function exitEdit() {
    if (typeof window !== "undefined") window.location.hash = "";
  }

  async function onSave() {
    setSaving(true);
    console.log("[v0] Saving loan:", {
      address,
      propertyPrice,
      loanAmount,
      rate,
      termYears,
      startDate,
      balance,
      creditScore,
    });

    setLoan({
      ...loan,
      propertyAddress: address,
      propertyPrice,
      loanAmount,
      currentRate: rate,
      termYears,
      startDate,
      remainingBalance: balance,
      creditScore,
    });

    setSaving(false);
    exitEdit();
  }

  return (
    <main className="p-4 md:p-6 max-w-6xl mx-auto">
      <header className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Loan details</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <section className="lg:col-span-3 space-y-5">
          <Panel title="Property">
            <div className="grid gap-4">
              <Field
                label="Address"
                edit={editMode}
                valueNode={<span>{address || "—"}</span>}
                inputNode={
                  <input
                    className="rounded-lg border px-3 py-2 w-full"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, City, State ZIP"
                  />
                }
              />
              <Field
                label="Property Price"
                edit={editMode}
                valueNode={<span>{fmtCurrency(propertyPrice)}</span>}
                inputNode={
                  <input
                    className="rounded-lg border px-3 py-2"
                    inputMode="decimal"
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(toNumber(e.target.value))}
                  />
                }
              />
            </div>
          </Panel>

          <Panel title="Credit Information">
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="creditScore">Credit Score Range</Label>
                {editMode ? (
                  <Select value={creditScore} onValueChange={setCreditScore}>
                    <SelectTrigger id="creditScore">
                      <SelectValue placeholder="Select credit score range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="750+">750+ (Excellent)</SelectItem>
                      <SelectItem value="700-749">700-749 (Good)</SelectItem>
                      <SelectItem value="650-699">650-699 (Fair)</SelectItem>
                      <SelectItem value="600-649">600-649 (Poor)</SelectItem>
                      <SelectItem value="below-600">
                        Below 600 (Very Poor)
                      </SelectItem>
                      <SelectItem value="Unsure">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <span className="py-2 block">{creditScore || "—"}</span>
                )}
              </div>
            </div>
          </Panel>

          <Panel title="Loan (inputs)">
            <div className="grid md:grid-cols-2 gap-4">
              <Field
                label="Original Loan Amount"
                edit={editMode}
                valueNode={<span>{fmtCurrency(loanAmount)}</span>}
                inputNode={
                  <input
                    className="rounded-lg border px-3 py-2 w-full"
                    inputMode="decimal"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(toNumber(e.target.value))}
                  />
                }
              />
              <Field
                label="Current Balance"
                edit={editMode}
                valueNode={<span>{fmtCurrency(balance)}</span>}
                inputNode={
                  <input
                    className="rounded-lg border px-3 py-2 w-full"
                    inputMode="decimal"
                    value={balance}
                    onChange={(e) => setBalance(toNumber(e.target.value))}
                  />
                }
              />
              <Field
                label="Interest Rate (APR)"
                edit={editMode}
                valueNode={<span>{fmtPercent(rate)}</span>}
                inputNode={
                  <div className="flex items-center gap-2">
                    <input
                      className="rounded-lg border px-3 py-2 w-full"
                      inputMode="decimal"
                      value={rate}
                      onChange={(e) => setRate(toNumber(e.target.value))}
                    />
                    <span className="text-gray-500">%</span>
                  </div>
                }
              />
              <Field
                label="Term Length"
                edit={editMode}
                valueNode={<span>{termYears} years</span>}
                inputNode={
                  <div className="flex items-center gap-2">
                    <input
                      className="rounded-lg border px-3 py-2 w-full"
                      inputMode="decimal"
                      value={termYears}
                      onChange={(e) => setTermYears(toNumber(e.target.value))}
                    />
                    <span className="text-gray-500">years</span>
                  </div>
                }
              />
              <Field
                label="Start / First Payment Date"
                edit={editMode}
                full
                valueNode={
                  <span>{new Date(startDate).toLocaleDateString()}</span>
                }
                inputNode={
                  <input
                    type="date"
                    className="rounded-lg border px-3 py-2"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                }
              />
            </div>
          </Panel>
        </section>

        <aside className="lg:col-span-2 space-y-5">
          <Panel title="Calculated">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Stat
                label="Min. Monthly Payment (P&I)"
                value={fmtCurrency(minMonthlyPaymentPI)}
              />
              <Stat
                label="Total Monthly (PITI est.)"
                value={fmtCurrency(totalMonthlyPITI)}
                hint="Taxes/ins=0 here"
              />
              <Stat
                label="Months Remaining"
                value={
                  monthsRemaining === Number.POSITIVE_INFINITY
                    ? "∞"
                    : `${monthsRemaining}`
                }
              />
              <Stat
                label="Future Interest To Pay"
                value={fmtCurrency(futureInterestToPay)}
              />
              <Stat label="Current APR" value={fmtPercent(rate)} />
              <Stat
                label="Forecasted Payoff"
                value={forecastPayoffDate.toLocaleDateString()}
              />
            </div>
            {monthsRemaining === Number.POSITIVE_INFINITY && (
              <p className="mt-2 text-xs text-red-600">
                Payment too low to amortize at this rate; increase payment or
                reduce balance.
              </p>
            )}
          </Panel>

          <div className="grid justify-items-center rounded-2xl border p-4 md:p-5 shadow-sm">
            {!editMode ? (
              <button
                onClick={enterEdit}
                className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium hover:bg-gray-50"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={onSave}
                  disabled={saving}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 text-white px-3 py-2 text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={exitEdit}
                  className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                >
                  <X className="h-4 w-4" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </aside>
      </div>
    </main>
  );
}

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
