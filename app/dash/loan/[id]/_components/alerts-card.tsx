"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import Link from "next/link";

export function AlertsCard({ loanId, alertsData }: any) {
  return (
    <Card className="border-l-4 border-l-red-500 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Active Alerts ({alertsData.length})
        </CardTitle>
        <CardDescription>
          Currently monitoring for refinancing opportunities
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="flex-1">
          {alertsData.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No active alerts
            </p>
          ) : (
            <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
              {alertsData.map((alert: any, index: number) => {
                const isSounding = alert.priority === "high";

                return (
                  <div
                    key={index}
                    className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base leading-tight">
                          {alert.type}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {alert.message}
                        </p>
                      </div>
                      {isSounding ? (
                        <Badge variant="destructive" className="flex-shrink-0">
                          Sounding
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="flex-shrink-0">
                          Monitoring
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Button variant="outline" className="w-full mt-4 bg-transparent">
          <Link
            href={`/dash/loan/${loanId}/alerts`}
            className="flex items-center w-full justify-center"
          >
            Manage All Alerts
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
