import { Clock, FileCheck, FileX, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FormAnalyticsCollection } from "@/types/form-analytics";
import {
  calculateAbandonmentRate,
  calculateAverageCompletionTime,
  calculateSubmissionRate,
  formatTime,
} from "@/lib/analytics-utils";

interface OverviewMetricsProps {
  data: FormAnalyticsCollection;
}

export function OverviewMetrics({ data }: Readonly<OverviewMetricsProps>) {
  const totalUsers = data.sessions.length;
  const avgTimeSpent = calculateAverageCompletionTime(data);
  const submissionRate = calculateSubmissionRate(data);
  const abandonmentRate = calculateAbandonmentRate(data);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <CardDescription>Active form users</CardDescription>
          </div>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {totalUsers.toLocaleString()}
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500">+12.5%</span> from last month
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">
              Avg. Time Spent
            </CardTitle>
            <CardDescription>Per form completion</CardDescription>
          </div>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatTime(avgTimeSpent)}</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500">-18s</span> from last month
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">
              Submission Rate
            </CardTitle>
            <CardDescription>Successfully completed</CardDescription>
          </div>
          <FileCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{submissionRate.toFixed(1)}%</div>
          <p className="text-xs text-muted-foreground">
            <span className="text-emerald-500">+4.3%</span> from last month
          </p>
        </CardContent>
      </Card>

      <Card className="transition-all hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="space-y-1">
            <CardTitle className="text-sm font-medium">
              Abandonment Rate
            </CardTitle>
            <CardDescription>Forms left incomplete</CardDescription>
          </div>
          <FileX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {abandonmentRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            <span className="text-rose-500">-4.3%</span> from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
