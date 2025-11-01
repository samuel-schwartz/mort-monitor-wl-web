import { creditScoreBand } from "./creditScore"

export type RateType = {
    id: number,
    title: string,
    termLength:number,
    creditScoreBand: creditScoreBand
}

export type RateValue = {
    id: number,
    rateType: RateType,
    date: Date,
    value: number
}