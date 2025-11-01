import { number } from "zod"
import { creditScoreBand } from "./creditScore"

export type Loan = {
    propertyPrice: number,
    loanAmount: number,
    termLength: number,
    firstPaymentDate: Date,
    minimumMonthlyPayment: number,
    interestRate: number,
    currentBallance: number
}
export type Property = {
    id: number,
    location: {
        address: string,
        city: string,
        state: string,
        zip: string
    },
    creditScoreBand: creditScoreBand,
    loanDetails: Loan
}