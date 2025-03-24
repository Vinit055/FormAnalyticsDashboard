import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import type { FormAnalyticsCollection } from "@/types/types";

interface SubmissionCompletionChartProps {
  data: FormAnalyticsCollection;
}

export function SubmissionCompletionChart({
  data,
}: Readonly<SubmissionCompletionChartProps>) {
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
