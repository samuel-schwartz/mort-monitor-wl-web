"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bell, BellOff, Home } from "lucide-react"
import type { Client } from "@/types/models"
import type { Property } from "@/app/actions/properties"
import type { Alert } from "@/app/actions/alerts"

interface ClientAlertsViewProps {
  client: Client
  propertiesWithAlerts: Array<{
    property: Property
    alerts: Alert[]
  }>
}

export function ClientAlertsView({ client, propertiesWithAlerts }: ClientAlertsViewProps) {
  const totalAlerts = propertiesWithAlerts.reduce((sum, item) => sum + item.alerts.length, 0)
  const activeAlerts = propertiesWithAlerts.reduce((sum, item) => sum + item.alerts.filter((a) => !a.snoozed).length, 0)
  const snoozedAlerts = totalAlerts - activeAlerts

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalAlerts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{activeAlerts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Snoozed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{snoozedAlerts}</div>
          </CardContent>
        </Card>
      </div>

      {propertiesWithAlerts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Home className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No properties found for this client</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {propertiesWithAlerts.map(({ property, alerts }) => (
            <Card key={property.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="h-5 w-5" />
                  {property.address}
                </CardTitle>
                <CardDescription>
                  {alerts.length} alert{alerts.length !== 1 ? "s" : ""} configured
                </CardDescription>
              </CardHeader>
              <CardContent>
                {alerts.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No alerts for this property</p>
                ) : (
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          {alert.snoozed ? (
                            <BellOff className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <Bell className="h-5 w-5 text-primary" />
                          )}
                          <div>
                            <p className="font-medium">{alert.templateId}</p>
                            {alert.loanTerms && alert.loanTerms.length > 0 && (
                              <p className="text-sm text-muted-foreground">Terms: {alert.loanTerms.join(", ")} years</p>
                            )}
                          </div>
                        </div>
                        <Badge variant={alert.snoozed ? "outline" : "default"}>
                          {alert.snoozed ? "Snoozed" : "Active"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
