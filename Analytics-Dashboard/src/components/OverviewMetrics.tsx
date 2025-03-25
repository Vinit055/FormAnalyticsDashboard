import { Clock, FileCheck, FileX, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FormAnalyticsCollection } from "@/types/types";
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
  // Define current and previous month timeframes
  const now = new Date();
  const currentMonthStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  ).getTime();
  const previousMonthStart = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  ).getTime();
  const previousMonthEnd = currentMonthStart - 1;

  // Filter sessions by month
  const currentMonthSessions = data.sessions.filter(
    (session) => session.formStartTime >= currentMonthStart
  );
  const previousMonthSessions = data.sessions.filter(
    (session) =>
      session.formStartTime >= previousMonthStart &&
      session.formStartTime <= previousMonthEnd
  );

  // Create current and previous month data collections
  const currentMonthData: FormAnalyticsCollection = {
    sessions: currentMonthSessions,
  };
  const previousMonthData: FormAnalyticsCollection = {
    sessions: previousMonthSessions,
  };

  // Calculate current month metrics
  const totalUsers = currentMonthData.sessions.length;
  const avgTimeSpent = calculateAverageCompletionTime(currentMonthData);
  const submissionRate = calculateSubmissionRate(currentMonthData);
  const abandonmentRate = calculateAbandonmentRate(currentMonthData);

  // Calculate previous month metrics
  const prevTotalUsers = previousMonthData.sessions.length;
  const prevAvgTimeSpent = calculateAverageCompletionTime(previousMonthData);
  const prevSubmissionRate = calculateSubmissionRate(previousMonthData);
  const prevAbandonmentRate = calculateAbandonmentRate(previousMonthData);

  // Calculate differences
  const usersDiff =
    prevTotalUsers > 0
      ? ((totalUsers - prevTotalUsers) / prevTotalUsers) * 100
      : 0;
  const timeDiff = prevAvgTimeSpent > 0 ? avgTimeSpent - prevAvgTimeSpent : 0;
  const submissionDiff =
    prevSubmissionRate > 0 ? submissionRate - prevSubmissionRate : 0;
  const abandonmentDiff =
    prevAbandonmentRate > 0 ? abandonmentRate - prevAbandonmentRate : 0;

  // Format time difference
  const formattedTimeDiff = formatTimeDifference(timeDiff);

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
            <span
              className={usersDiff >= 0 ? "text-emerald-500" : "text-rose-500"}
            >
              {usersDiff >= 0 ? "+" : ""}
              {usersDiff.toFixed(1)}%
            </span>{" "}
            from last month
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
            <span
              className={timeDiff <= 0 ? "text-emerald-500" : "text-rose-500"}
            >
              {timeDiff <= 0 ? "-" : "+"}
              {formattedTimeDiff}
            </span>{" "}
            from last month
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
            <span
              className={
                submissionDiff >= 0 ? "text-emerald-500" : "text-rose-500"
              }
            >
              {submissionDiff >= 0 ? "+" : ""}
              {submissionDiff.toFixed(1)}%
            </span>{" "}
            from last month
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
            <span
              className={
                abandonmentDiff <= 0 ? "text-emerald-500" : "text-rose-500"
              }
            >
              {abandonmentDiff <= 0 ? "-" : "+"}
              {Math.abs(abandonmentDiff).toFixed(1)}%
            </span>{" "}
            from last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to format time difference in a human-readable format
function formatTimeDifference(diffMs: number): string {
  const absDiff = Math.abs(diffMs);

  if (absDiff < 1000) return `${absDiff}ms`;

  const seconds = Math.floor(absDiff / 1000);
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (remainingSeconds === 0) return `${minutes}m`;
  return `${minutes}m ${remainingSeconds}s`;
}
