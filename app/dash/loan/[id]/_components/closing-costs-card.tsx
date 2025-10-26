import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ReceiptText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function ClostingCostsCard({ loanId }: any) {
  return (
    <Card className="border-l-4 border-l-violet-700 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ReceiptText className="h-5 w-5 text-violet-700" />
          Estimated Closing Costs
        </CardTitle>
        <CardDescription>Based on current refinancing cost estimates</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="flex-1">
          <div className="space-y-4">
            <div className="text-center border rounded-lg p-4 bg-muted/30">
              <p className="text-sm text-muted-foreground mb-1">Total Estimated Costs</p>
              <p className="text-3xl font-bold">$8,500</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">Origination Fees</p>
                <p className="text-xl font-semibold">$3,850</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">Appraisal & Fees</p>
                <p className="text-xl font-semibold">$2,100</p>
              </div>
              <div className="text-center space-y-1">
                <p className="text-sm text-muted-foreground">Title & Escrow</p>
                <p className="text-xl font-semibold">$2,550</p>
              </div>
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full mt-6 bg-transparent">
          <Link href={`/dash/loan/${loanId}/closing-costs`} className="flex items-center w-full justify-center">
            View Full Breakdown
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
