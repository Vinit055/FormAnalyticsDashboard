import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { DataProps } from "@/types/types";
import { AlertTriangle } from "lucide-react";

export function SubmissionCompletionChart({ data }: Readonly<DataProps>) {
  // Analyze the sessions to group by completion time ranges
  const completedSessions = data.sessions.filter(
    (session) => session.formSubmitted
  );

  // Calculate completion time in minutes and group into ranges
  const timeRanges = [
    { name: "< 2 min", count: 0 },
    { name: "2-5 min", count: 0 },
    { name: "5-10 min", count: 0 },
    { name: "10-15 min", count: 0 },
    { name: "15+ min", count: 0 },
  ];

  completedSessions.forEach((session) => {
    const timeSpentMinutes = session.formCompletionTime / 60000;

    if (timeSpentMinutes < 2) {
      timeRanges[0].count++;
    } else if (timeSpentMinutes < 5) {
      timeRanges[1].count++;
    } else if (timeSpentMinutes < 10) {
      timeRanges[2].count++;
    } else if (timeSpentMinutes < 15) {
      timeRanges[3].count++;
    } else {
      timeRanges[4].count++;
    }
  });

  if (
    data.sessions.length === 0 ||
    data.sessions.every((item) => item.formSubmitted === false)
  ) {
    return (
      <div className="h-[240px] w-full flex items-center justify-center text-gray-500 gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        No data available
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={timeRanges}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value) => [`${value} submissions`, "Count"]}
            labelFormatter={(label) => `Time range: ${label}`}
          />
          <Bar
            dataKey="count"
            fill="#8884d8"
            radius={[4, 4, 0, 0]}
            name="Submissions"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
