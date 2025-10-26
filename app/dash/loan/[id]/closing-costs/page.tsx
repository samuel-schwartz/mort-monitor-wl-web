"use client";
import EstimatedClosingCostsInline from "./_components/estimated-closing-costs-inline";

export default function Page() {
  return (
    <div className="flex flex-col gap-3 m-25 mt-5">
      <EstimatedClosingCostsInline
        loanAmount={300000}
        defaultExpanded={false}
        onSave={(fees, total) => {
          // persist to API or state
        }}
      />
    </div>
  );
}
