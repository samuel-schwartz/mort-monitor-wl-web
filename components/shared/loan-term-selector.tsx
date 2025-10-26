"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { LOAN_TERMS } from "@/types/alerts"

interface LoanTermSelectorProps {
  selectedTerms: number[]
  onTermsChange: (terms: number[]) => void
  showPricing?: boolean
}

export function LoanTermSelector({ selectedTerms, onTermsChange, showPricing = true }: LoanTermSelectorProps) {
  const toggleTerm = (term: number, checked: boolean) => {
    if (checked) {
      onTermsChange([...selectedTerms, term])
    } else {
      onTermsChange(selectedTerms.filter((t) => t !== term))
    }
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm">New refinanced loan terms</Label>
      <div className="grid grid-cols-2 gap-3">
        {LOAN_TERMS.map((term) => (
          <label
            key={term}
            className="flex items-center gap-2 rounded border p-3 sm:p-2 cursor-pointer select-none min-h-[48px] sm:min-h-0"
          >
            <Checkbox
              checked={selectedTerms.includes(term)}
              onCheckedChange={(checked) => toggleTerm(term, Boolean(checked))}
            />
            <span className="text-sm">{term}-year fixed</span>
          </label>
        ))}
      </div>
    </div>
  )
}
