"use client"
import React, { useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

/**
 * EstimatedClosingCostsInline
 * - Summary row shows "Estimated Closing Costs: $X" and a toggle switch.
 * - When toggled on, the full fee editor expands inline.
 * - Ranges scale with `loanAmount` (e.g., origination %).
 * - Includes Reset/Save controls; emits final values via onSave.
 */

type Fees = {
  // 1) Loan & Lender Fees
  applicationProcessing: number;
  underwriting: number;
  origination: number; // dollar value (defaults to % of loanAmount)
  rateLock: number;
  discountPoints: number;

  // 2) Third-Party Fees
  appraisal: number;
  creditReport: number;
  floodCert: number;
  taxService: number;
  verification: number;

  // 3) Title & Closing Fees
  titleSearch: number;
  titleInsurance: number;
  settlementClosing: number;
  notaryRecordingService: number;

  // 4) Government Fees
  recording: number;
  transferTax: number;

  // 5) Prepaids & Escrows
  prepaidInterest: number;
  escrowPropertyTaxes: number;
  escrowHomeownersIns: number;
};

type Props = {
  loanAmount: number;
  initialValues?: Partial<Fees>;
  defaultExpanded?: boolean;
  onSave?: (fees: Fees, total: number) => void;
};

const currency = (n: number) =>
  (Number(n) || 0).toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

const clampNonNeg = (v: number) => (isFinite(v) && v >= 0 ? v : 0);

function defaultsForLoan(loanAmount: number): Fees {
  return {
    // Loan & Lender
    applicationProcessing: 300,
    underwriting: 600,
    origination: Math.round(loanAmount * 0.01), // 1%
    rateLock: 0,
    discountPoints: 0,

    // Third-Party
    appraisal: 500,
    creditReport: 35,
    floodCert: 20,
    taxService: 80,
    verification: 40,

    // Title & Closing
    titleSearch: 200,
    titleInsurance: 800,
    settlementClosing: 500,
    notaryRecordingService: 150,

    // Government
    recording: 100,
    transferTax: 0,

    // Prepaids & Escrows
    prepaidInterest: 500,
    escrowPropertyTaxes: 600,
    escrowHomeownersIns: 200,
  };
}

function rangesForLoan(loanAmount: number) {
  const origMin = Math.round(loanAmount * 0.005); // 0.5%
  const origMax = Math.round(loanAmount * 0.015); // 1.5%
  return {
    applicationProcessing: "$200 – $500",
    underwriting: "$400 – $700",
    origination: `${currency(origMin)} – ${currency(origMax)} (0.5%–1.5%)`,
    rateLock: "$0 – $500",
    discountPoints: "Optional (0–2+ points)",

    appraisal: "$300 – $700",
    creditReport: "$25 – $50",
    floodCert: "$15 – $25",
    taxService: "$50 – $100",
    verification: "$20 – $75",

    titleSearch: "$100 – $400",
    titleInsurance: "$500 – $1,200",
    settlementClosing: "$400 – $700",
    notaryRecordingService: "$100 – $250",

    recording: "$50 – $150",
    transferTax: "Varies by state/county",

    prepaidInterest: "Varies (depends on close date & rate)",
    escrowPropertyTaxes: "Varies (often ~1–3 months)",
    escrowHomeownersIns: "Varies (often ~1–3 months)",
  } as const;
}

const fields: Array<{ key: keyof Fees; label: string; group: string }> = [
  // 1) Loan & Lender
  { key: "applicationProcessing", label: "Application / Processing Fee", group: "Loan & Lender Fees" },
  { key: "underwriting", label: "Underwriting Fee", group: "Loan & Lender Fees" },
  { key: "origination", label: "Origination Fee", group: "Loan & Lender Fees" },
  { key: "rateLock", label: "Rate Lock Fee (if any)", group: "Loan & Lender Fees" },
  { key: "discountPoints", label: "Discount Points (optional)", group: "Loan & Lender Fees" },

  // 2) Third-Party
  { key: "appraisal", label: "Appraisal Fee", group: "Third-Party Fees" },
  { key: "creditReport", label: "Credit Report Fee", group: "Third-Party Fees" },
  { key: "floodCert", label: "Flood Certification", group: "Third-Party Fees" },
  { key: "taxService", label: "Tax Service Fee", group: "Third-Party Fees" },
  { key: "verification", label: "Verification Fee(s)", group: "Third-Party Fees" },

  // 3) Title & Closing
  { key: "titleSearch", label: "Title Search", group: "Title & Closing Fees" },
  { key: "titleInsurance", label: "Title Insurance (Lender’s Policy)", group: "Title & Closing Fees" },
  { key: "settlementClosing", label: "Settlement / Escrow / Closing Fee", group: "Title & Closing Fees" },
  { key: "notaryRecordingService", label: "Notary / Recording Service Fee", group: "Title & Closing Fees" },

  // 4) Government
  { key: "recording", label: "Recording Fee", group: "Government Fees" },
  { key: "transferTax", label: "Transfer Taxes (if applicable)", group: "Government Fees" },

  // 5) Prepaids & Escrows
  { key: "prepaidInterest", label: "Prepaid Interest", group: "Prepaid Items & Escrows" },
  { key: "escrowPropertyTaxes", label: "Property Taxes (escrow start)", group: "Prepaid Items & Escrows" },
  { key: "escrowHomeownersIns", label: "Homeowners Insurance (escrow start)", group: "Prepaid Items & Escrows" },
];

export default function EstimatedClosingCostsInline({
  loanAmount,
  initialValues,
  defaultExpanded = false,
  onSave,
}: Props) {
  const baseDefaults = useMemo(() => defaultsForLoan(loanAmount), [loanAmount]);
  const [fees, setFees] = useState<Fees>({ ...baseDefaults, ...initialValues });
  const [expanded, setExpanded] = useState<boolean>(defaultExpanded);

  const total = useMemo(
    () => Object.values(fees).reduce((sum, v) => sum + clampNonNeg(Number(v)), 0),
    [fees]
  );

  return (
    <div className="w-full max-w-4xl space-y-4">
      {/* Summary / Toggle Row */}
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5" />
          <div>
            <Label className="text-base font-medium">Current Estimated Closing Costs</Label>

            { expanded ? (<>
            <p className="text-sm text-gray-500">From your inputs, updated when you make changes</p>
            <div className="text-lg font-semibold">{currency(total)}</div>
            </>) :
            (
            
            <>
            <p className="text-sm text-gray-500">Based on typical ranges, updated continiously</p>
            <div className="text-lg font-semibold">{currency(total)}</div>
            </>)

            }
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="">
            {expanded ? (<p>Turn off to use our regularly updated defaults</p>)
            :(<><p>Manual override with your own numbers</p>
            <p className="text-sm text-gray-500">Will not be updated with inflation.</p>
            </>
            )}
            
            
            </div>
          <Switch checked={expanded} onCheckedChange={setExpanded} aria-label="Toggle edit closing costs" />
        </div>
      </div>

      {/* Expanded Editor */}
      {expanded ? (
        <Expansion loanAmount={loanAmount} initialValues={initialValues} editable={expanded} onSave={onSave} />     
    
      ) : (
        <Expansion loanAmount={loanAmount} initialValues={initialValues} editable={expanded} onSave={onSave} />     )
      }
    </div>
  );
}

type ExpProps = {
  loanAmount: number;
  initialValues?: Partial<Fees>;
  editable?: boolean;
  onSave?: (fees: Fees, total: number) => void;
};

function Expansion({loanAmount,
  initialValues,
  editable,
  onSave,
}: ExpProps){

    const baseDefaults = useMemo(() => defaultsForLoan(loanAmount), [loanAmount]);
  const [fees, setFees] = useState<Fees>({ ...baseDefaults, ...initialValues });

  const total = useMemo(
    () => Object.values(fees).reduce((sum, v) => sum + clampNonNeg(Number(v)), 0),
    [fees]
  );

    const setField = (key: keyof Fees, raw: string) => {
    const num = Number(String(raw).replace(/[^\d.]/g, ""));
    setFees((prev) => ({ ...prev, [key]: isFinite(num) ? Math.round(Math.max(0, num)) : 0 }));
  };

  const resetToDefaults = () => setFees(defaultsForLoan(loanAmount));
  const handleSave = () => onSave?.(fees, total);

    const ranges = useMemo(() => rangesForLoan(loanAmount), [loanAmount]);

  

  // Build groups for display
  const grouped = useMemo(() => {
    const g: Record<string, Array<{ key: keyof Fees; label: string }>> = {};
    for (const f of fields) {
      g[f.group] ||= [];
      g[f.group].push({ key: f.key, label: f.label });
    }
    return g;
  }, []);



  return (
    <>
    <div className="p-4 border rounded-lg space-y-6">
          <div className="text-sm text-gray-700">
            Loan Amount: <strong>{currency(loanAmount)}</strong>
          </div>

                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-base font-semibold">Total Closing Costs: {currency(total)}</div>
            {editable && (
            <div className="flex gap-2">
              <button
                onClick={resetToDefaults}
                className="rounded-xl border px-4 py-2 text-sm bg-white hover:bg-gray-50"
              >
                Reset to Defaults
              </button>
              <button
                onClick={handleSave}
                className="rounded-xl bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
            )
          }
          </div>

          {Object.entries(grouped).map(([group, items]) => (
            <div key={group} className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-600">{group}</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {items.map(({ key, label }) => (
                  <div key={String(key)} className="rounded-lg border bg-white p-3">
                    <Label htmlFor={`fee-${String(key)}`} className="text-sm font-medium">
                      {label}
                    </Label>
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-gray-500">$</span>
                      <Input
                        id={`fee-${String(key)}`}
                        inputMode="decimal"
                        readOnly={!editable}
                        disabled={!editable}
                        type="text"
                        value={fees[key]}
                        onChange={(e) => setField(key, e.target.value)}
                        onBlur={(e) => setField(key, e.target.value)}
                        placeholder="0"
                        className="mt-0"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Range: {(ranges as Record<string, string>)[key as unknown as string]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}



        </div>
    </>
  )
}
