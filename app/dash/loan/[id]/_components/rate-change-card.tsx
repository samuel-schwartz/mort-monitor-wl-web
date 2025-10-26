import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingDown, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function RateChangeCard({ loanId }: any) {
  return (
    <Card className="border-l-4 border-l-blue-500 h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-blue-600" />
          Rate Trends
        </CardTitle>
        <CardDescription>
          30-year fixed rate movement, rolling average
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1 text-center">
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-3xl font-bold">5.85%</p>
              <div className="flex items-center gap-1.5 text-green-600 justify-center">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-medium">-0.15%</span>
                <span className="text-sm text-muted-foreground">
                  from yesterday
                </span>
              </div>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-3xl font-bold">5.92%</p>
              <div className="flex items-center gap-1.5 text-green-600 justify-center">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-medium">-0.35%</span>
                <span className="text-sm text-muted-foreground">
                  from last week
                </span>
              </div>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="text-3xl font-bold">6.15%</p>
              <div className="flex items-center gap-1.5 text-green-600 justify-center">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-medium">-0.58%</span>
                <span className="text-sm text-muted-foreground">
                  from last month
                </span>
              </div>
            </div>
            <div className="space-y-1 text-center">
              <p className="text-sm text-muted-foreground">This Quarter</p>
              <p className="text-3xl font-bold">6.15%</p>
              <div className="flex items-center gap-1.5 text-green-600 justify-center">
                <TrendingDown className="h-4 w-4" />
                <span className="text-sm font-medium">-0.58%</span>
                <span className="text-sm text-muted-foreground">
                  from last quarter
                </span>
              </div>
            </div>
          </div>
        </div>
        <Button variant="outline" className="w-full mt-6 bg-transparent">
          <Link
            href={`/dash/loan/${loanId}/rates`}
            className="flex items-center w-full justify-center"
          >
            View Detailed Rate Trends
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
