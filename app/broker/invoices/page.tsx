import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download } from "lucide-react"
import { getBrokerInvoices } from "@/app/actions/invoices"
import { Button } from "@/components/ui/button"

export default async function BrokerInvoicesPage() {
  const result = await getBrokerInvoices()
  const invoices = result.success ? result.data : []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Invoices</h1>
        <p className="text-muted-foreground">View and download your billing invoices</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Billing History
          </CardTitle>
          <CardDescription>Download PDF invoices for your records</CardDescription>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No invoices available</p>
            </div>
          ) : (
            <div className="space-y-2">
              {invoices.map((invoice: any) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <FileText className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{invoice.invoiceNumber}</p>
                      {invoice.description && <p className="text-sm text-muted-foreground">{invoice.description}</p>}
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(invoice.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a href={invoice.pdfUrl} download={invoice.filename}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </a>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
