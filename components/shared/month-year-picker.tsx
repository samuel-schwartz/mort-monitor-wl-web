"use client"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MONTHS, generateYearOptions } from "@/lib/utils/date-helpers"

interface MonthYearPickerProps {
  month: number
  year: number
  onMonthChange: (month: number) => void
  onYearChange: (year: number) => void
  label?: string
  startYear?: number
  endYear?: number
  required?: boolean
  disabled?: boolean
}

export function MonthYearPicker({
  month,
  year,
  onMonthChange,
  onYearChange,
  startYear,
  endYear,
  required = false,
  disabled = false,
}: MonthYearPickerProps) {
  const years = generateYearOptions(startYear, endYear)

  return (
    <div className="space-y-2">
      <div className="flex gap-3">
        <div className="flex-1">
          <Select value={String(month)} onValueChange={(v) => onMonthChange(Number.parseInt(v))} disabled={disabled}>
            <SelectTrigger className={`h-11 sm:h-10 w-full ${disabled ? "bg-muted" : ""}`}>
              <SelectValue placeholder="Month" />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((monthName, index) => (
                <SelectItem key={index + 1} value={String(index + 1)}>
                  {monthName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1">
          <Select value={String(year)} onValueChange={(v) => onYearChange(Number.parseInt(v))} disabled={disabled}>
            <SelectTrigger className={`h-11 sm:h-10 w-full ${disabled ? "bg-muted" : ""}`}>
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={String(y)}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}
