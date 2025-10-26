"use client";

import * as React from "react";
import useSWR from "swr";
import { addDays, format, startOfDay } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/* =============================================================================
   MOCK API TOGGLE
   ============================================================================= */

// Helper for yyyy-MM-dd
const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

function mockHistory(days: number, base = 6.75, amp = 0.08) {
  const today = startOfDay(new Date());
  return Array.from({ length: days }).map((_, i) => {
    const d = addDays(today, -(days - 1 - i));
    const jitter =
      Math.cos(Math.random()) * amp +
      Math.sin(i / 5) * amp +
      (Math.random() - 0.5) * 0.05;
    return { date: ymd(d), rate: +(base + jitter).toFixed(3) };
  });
}

function mockConformingLimit(countyFips?: string) {
  return { countyFips: countyFips ?? "00000", singleUnitLimitUsd: 766_550 };
}

function mockRatesResponse(product: string, days: number) {
  const m = product.match(/(\d+)y$/);
  const term = m ? Number.parseInt(m[1], 10) : 30;
  const baseByTerm: Record<number, number> = {
    30: 6.85,
    25: 6.8,
    20: 6.7,
    15: 6.3,
    10: 6.1,
    5: 5.9,
  };
  const base = baseByTerm[term] ?? 6.75;
  return {
    product,
    history: mockHistory(days, base),
    today: {
      todayAvgRatePct: +(base + (Math.random() - 0.5) * 0.05).toFixed(3),
      avgClosingCostsUsd: 4200 + Math.floor(Math.random() * 600), // 4200–4800
    },
  };
}

function mockFetch(url: string) {
  const u = new URL(url, "http://local.test");
  if (u.pathname.endsWith("/api/conforming-limit")) {
    const countyFips = u.searchParams.get("countyFips") ?? undefined;
    return Promise.resolve(mockConformingLimit(countyFips));
  }
  if (u.pathname.endsWith("/api/rates")) {
    const product = u.searchParams.get("product") ?? "conforming_fixed_30y";
    const days = Number(u.searchParams.get("days") ?? 90);
    return Promise.resolve(mockRatesResponse(product, days));
  }
  return Promise.resolve({});
}

const fetcher = (url: string) => mockFetch(url);

/* =============================================================================
   TYPES
   ============================================================================= */
type TermYears = 30 | 25 | 20 | 15 | 10 | 5;

type RatePoint = { date: string; rate: number | null };
type RateHistory = RatePoint[];

type TodayAggregate = {
  todayAvgRatePct: number;
  avgClosingCostsUsd: number;
};

type RatesApiResponse = {
  product: string;
  history: RateHistory;
  today: TodayAggregate;
};

type ConformingLimit = {
  countyFips: string;
  singleUnitLimitUsd: number;
};

type CurrentLoan = {
  outstandingPrincipalUsd: number;
  currentRatePct: number;
  remainingTermMonths: number;
  propertyValueUsd: number;
  assumedClosingCostsUsd?: number;
};

type MortgageSmallMultipleProps = {
  currentLoan: CurrentLoan;
  countyFips?: string;
};

/* =============================================================================
   CONFIG
   ============================================================================= */
const TERMS: TermYears[] = [30, 15];

const PRODUCT_KEY_BY_TERM = (isJumbo: boolean, term: TermYears) =>
  `${isJumbo ? "jumbo" : "conforming"}_fixed_${term}y`;

const COLORS = [
  "#0ea5e9",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
];

// 180-day window centered on today: -90…+90
const WINDOW_DAYS_PAST = 90;
const WINDOW_DAYS_FUTURE = 30;

/* =============================================================================
   FINANCE HELPERS
   ============================================================================= */
function pmt(principal: number, annualPctRate: number, months: number): number {
  const r = annualPctRate / 100 / 12;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

function totalInterestOverMonths(
  principal: number,
  annualPctRate: number,
  totalTermMonths: number,
  horizonMonths: number,
): number {
  const months = Math.min(horizonMonths, totalTermMonths);
  const r = annualPctRate / 100 / 12;
  let balance = principal;
  const payment = pmt(principal, annualPctRate, totalTermMonths);
  let interestPaid = 0;
  for (let i = 0; i < months; i++) {
    const interest = balance * r;
    const principalPaid = payment - interest;
    balance = Math.max(0, balance - principalPaid);
    interestPaid += interest;
    if (balance <= 0) break;
  }
  return interestPaid;
}

function monthsFromToday(months: number): Date {
  const d = startOfDay(new Date());
  d.setMonth(d.getMonth() + months);
  return d;
}

function breakEvenMonths(
  closingCosts: number,
  currentPayment: number,
  newPayment: number,
): number | null {
  const savings = currentPayment - newPayment;
  if (savings <= 0) return null;
  return Math.ceil(closingCosts / savings);
}

function isJumbo(outstanding: number, limitUsd: number): boolean {
  return outstanding > limitUsd;
}

function ltvPct(outstanding: number, propertyValue: number): number {
  if (!propertyValue || propertyValue <= 0) return Number.NaN;
  return (outstanding / propertyValue) * 100;
}

/* =============================================================================
   DATA SHAPING FOR CHARTS
   ============================================================================= */
function buildWindowedSeries(last90DaysHistory: RateHistory): RateHistory {
  const today = startOfDay(new Date());
  const map = new Map<string, number | null>();
  last90DaysHistory.forEach((p) =>
    map.set(format(new Date(p.date), "yyyy-MM-dd"), p.rate),
  );

  const series: RateHistory = [];
  for (let offset = -WINDOW_DAYS_PAST; offset <= WINDOW_DAYS_FUTURE; offset++) {
    const d = format(addDays(today, offset), "yyyy-MM-dd");
    const isFuture = offset > 0;
    const rate = isFuture ? null : (map.get(d) ?? null);
    series.push({ date: d, rate });
  }
  return series;
}

/* =============================================================================
   HOOK: load one term
   ============================================================================= */
function useMortgageTermData(term: TermYears, jumbo: boolean) {
  const product = PRODUCT_KEY_BY_TERM(jumbo, term);
  const { data, isLoading, error } = useSWR<RatesApiResponse>(
    `/api/rates?product=${product}&days=${WINDOW_DAYS_PAST}`,
    fetcher,
  );
  const series = React.useMemo(
    () => (data ? buildWindowedSeries(data.history) : undefined),
    [data],
  );
  return { data, isLoading, error, series };
}

/* =============================================================================
   PRESENTATIONAL BITS
   ============================================================================= */
function SectionSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader>
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-56 mt-2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-40 w-full mb-4" />
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function RateTooltip({ active, label, payload }: any) {
  if (!active || !payload || !payload.length) return null;
  const v = payload[0].value;
  return (
    <div className="rounded-md border bg-background p-2 text-sm shadow">
      <div className="font-medium">{format(new Date(label), "PP")}</div>
      <div>{v == null ? "—" : `${v.toFixed(3)}%`}</div>
    </div>
  );
}

/* =============================================================================
   TERM CARD
   ============================================================================= */
type TermCardProps = {
  term: TermYears;
  color: string;
  jumbo: boolean;
  currentLoan: CurrentLoan;
  todayAgg: TodayAggregate;
  series: RateHistory;
};

function TermCard({
  term,
  color,
  jumbo,
  currentLoan,
  todayAgg,
  series,
}: TermCardProps) {
  const title = `${term}-Year ${jumbo ? "Jumbo" : "Fixed"} Rate Trend`;
  const descr = "Past 90 days";

  const newPayment = pmt(
    currentLoan.outstandingPrincipalUsd,
    todayAgg.todayAvgRatePct,
    term * 12,
  );
  const currentPayment = pmt(
    currentLoan.outstandingPrincipalUsd,
    currentLoan.currentRatePct,
    currentLoan.remainingTermMonths,
  );

  const horizons = [term * 12];
  const horizonLabels = ["life of loan"];

  const interestTotals = horizons.map((m) =>
    totalInterestOverMonths(
      currentLoan.outstandingPrincipalUsd,
      todayAgg.todayAvgRatePct,
      term * 12,
      m,
    ),
  );
  const currentInterestTotals = horizons.map((m) =>
    totalInterestOverMonths(
      currentLoan.outstandingPrincipalUsd,
      currentLoan.currentRatePct,
      currentLoan.remainingTermMonths,
      m,
    ),
  );

  const closingCosts =
    todayAgg.avgClosingCostsUsd ?? currentLoan.assumedClosingCostsUsd ?? 0;

  const beMonths = breakEvenMonths(closingCosts, currentPayment, newPayment);
  const beText =
    beMonths == null
      ? "No break-even (no savings)"
      : `${beMonths} mo (${format(monthsFromToday(beMonths), "PP")})`;

  const finalNewDate = monthsFromToday(term * 12);
  const finalCurDate = monthsFromToday(currentLoan.remainingTermMonths);
  const finalDateDiffDays = Math.round(
    (startOfDay(finalNewDate).getTime() - startOfDay(finalCurDate).getTime()) /
      (1000 * 60 * 60 * 24),
  );

  const todayRateDelta = todayAgg.todayAvgRatePct - currentLoan.currentRatePct;
  const monthlyDelta = newPayment - currentPayment;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription>{descr}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => format(new Date(value), "MMM d")}
                minTickGap={24}
              />
              <YAxis
                domain={["auto", "auto"]}
                tickFormatter={(v: number) =>
                  v == null ? "" : `${v.toFixed(1)}%`
                }
              />
              <Tooltip content={<RateTooltip />} />
              <Area
                type="monotone"
                dataKey="rate"
                stroke={color}
                fill={color}
                fillOpacity={0.1}
                strokeWidth={2}
                connectNulls={false}
                // To make the BLANK area on the LEFT instead, change buildWindowedSeries() to pad the first 90 days.
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Summary */}
        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          <div className="font-medium">Today's average interest rate</div>
          <div>{todayAgg.todayAvgRatePct.toFixed(3)}% </div>

          <div className="font-medium">Monthly payment</div>
          <div>
            ${newPayment.toFixed(2)}{" "}
            <span
              className={monthlyDelta >= 0 ? "text-red-600" : "text-green-600"}
            >
              ({monthlyDelta >= 0 ? "+" : ""}
              {monthlyDelta.toFixed(2)})
            </span>
          </div>

          {horizonLabels.map((label, i) => {
            const delta = interestTotals[i] - currentInterestTotals[i];
            return (
              <React.Fragment key={label}>
                <div className="font-medium">Total interest in {label}</div>
                <div>
                  ${interestTotals[i].toFixed(2)}{" "}
                  <span
                    className={delta >= 0 ? "text-red-600" : "text-green-600"}
                  >
                    ({delta >= 0 ? "+" : ""}
                    {delta.toFixed(2)})
                  </span>
                </div>
              </React.Fragment>
            );
          })}

          <div className="font-medium">Current average closing costs</div>
          <div>${closingCosts.toFixed(2)}</div>

          <div className="font-medium">Final payment date</div>
          <div>
            {format(finalNewDate, "PP")}{" "}
            <span
              className={
                finalDateDiffDays >= 0 ? "text-red-600" : "text-green-600"
              }
            >
              ({finalDateDiffDays >= 0 ? "+" : ""}
              {Math.round(finalDateDiffDays / 30.4375)} months,{" "}
              {(finalDateDiffDays / 365.25).toFixed(1)} years)
            </span>
          </div>
          <div className="font-medium">Break even date</div>
          <div>{beText}</div>
        </div>
      </CardContent>
    </Card>
  );
}

/* =============================================================================
   MAIN SMALL MULTIPLES
   ============================================================================= */
function SmallMultiplesRates({
  currentLoan,
  countyFips,
}: MortgageSmallMultipleProps) {
  const { data: limitData, isLoading: limitLoading } = useSWR<ConformingLimit>(
    countyFips
      ? `/api/conforming-limit?countyFips=${countyFips}`
      : "/api/conforming-limit",
    fetcher,
  );

  const limitUsd = limitData?.singleUnitLimitUsd ?? 0;
  const jumbo = isJumbo(currentLoan.outstandingPrincipalUsd, limitUsd);

  const term30Data = useMortgageTermData(30, jumbo);
  const term15Data = useMortgageTermData(15, jumbo);

  const termData = [
    { term: 30 as TermYears, color: COLORS[0], ...term30Data },
    { term: 15 as TermYears, color: COLORS[1], ...term15Data },
  ];

  const loadingAny = limitLoading || termData.some((t) => t.isLoading);
  const errorAny = termData.find((t) => t.error);

  if (loadingAny) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: TERMS.length }).map((_, i) => (
          <SectionSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (errorAny) {
    return (
      <div className="text-sm text-red-600">
        Error loading rates data. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        {termData.map(({ term, color, data, series }) => {
          if (!data || !series) return <SectionSkeleton key={term} />;
          return (
            <TermCard
              key={term}
              term={term}
              color={color}
              jumbo={jumbo}
              currentLoan={currentLoan}
              todayAgg={data.today}
              series={series}
            />
          );
        })}
      </div>
      <div className="text-sm text-muted-foreground">
        All figures are estimates and should not be taken as gospel truth. To
        discover quotes specific to your situation, contact a lender or broker
        in the yellow pages.
      </div>
    </div>
  );
}

export default SmallMultiplesRates;
export { SmallMultiplesRates };
