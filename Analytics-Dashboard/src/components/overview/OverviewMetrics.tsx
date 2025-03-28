import { Clock, FileCheck, FileX, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { FormAnalyticsCollection, DataProps } from "@/types/types";
import {
  calculateAbandonmentRate,
  calculateAverageCompletionTime,
  calculateSubmissionRate,
  formatTime,
} from "@/lib/analytics-utils";

export function OverviewMetrics({ data }: Readonly<DataProps>) {
  // Define current and previous week timeframes
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
  const daysFromStartOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Adjust to make Monday the start of the week

  // Current week (starting Monday)
  const currentWeekStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - daysFromStartOfWeek,
    0,
    0,
    0,
    0
  ).getTime();

  // Previous week
  const previousWeekStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() - daysFromStartOfWeek - 7,
    0,
    0,
    0,
    0
  ).getTime();

  const previousWeekEnd = currentWeekStart - 1;

  // Filter sessions by week
  const currentWeekSessions = data.sessions.filter(
    (session) => session.formStartTime >= currentWeekStart
  );
  const previousWeekSessions = data.sessions.filter(
    (session) =>
      session.formStartTime >= previousWeekStart &&
      session.formStartTime <= previousWeekEnd
  );

  // Create current and previous week data collections
  const currentWeekData: FormAnalyticsCollection = {
    sessions: currentWeekSessions,
  };
  const previousWeekData: FormAnalyticsCollection = {
    sessions: previousWeekSessions,
  };

  // Calculate current week metrics
  const totalUsers = currentWeekData.sessions.length;
  const avgTimeSpent = calculateAverageCompletionTime(currentWeekData);
  const submissionRate = calculateSubmissionRate(currentWeekData);
  const abandonmentRate = calculateAbandonmentRate(currentWeekData);

  // Calculate previous week metrics
  const prevTotalUsers = previousWeekData.sessions.length;
  const prevAvgTimeSpent = calculateAverageCompletionTime(previousWeekData);
  const prevSubmissionRate = calculateSubmissionRate(previousWeekData);
  const prevAbandonmentRate = calculateAbandonmentRate(previousWeekData);

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
            from last week
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
            from last week
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
            from last week
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
            from last week
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
