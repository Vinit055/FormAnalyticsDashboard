import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { FormAnalyticsCollection } from "@/types/types";
import { formatTime } from "@/lib/analytics-utils";
import { useMemo } from "react";

interface FormTimeChartProps {
  readonly data: FormAnalyticsCollection;
}

export function FormTimeChart({ data }: FormTimeChartProps) {
  const chartData = useMemo(() => {
    if (!data.sessions || data.sessions.length === 0) {
      return [];
    }

    // Initialize days of the week with zero counts and total times
    const dayAggregates: Record<string, { total: number; count: number }> = {
      Sun: { total: 0, count: 0 },
      Mon: { total: 0, count: 0 },
      Tue: { total: 0, count: 0 },
      Wed: { total: 0, count: 0 },
      Thu: { total: 0, count: 0 },
      Fri: { total: 0, count: 0 },
      Sat: { total: 0, count: 0 },
    };

    // Aggregate completion times by day of week
    data.sessions.forEach((session) => {
      // Skip sessions without completion time or not submitted
      if (!session.formCompletionTime || !session.formSubmitted) {
        return;
      }

      // Get day of week from form start time
      const date = new Date(session.formStartTime);
      const dayOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
        date.getDay()
      ];

      // Add to the aggregate
      dayAggregates[dayOfWeek].total += session.formCompletionTime;
      dayAggregates[dayOfWeek].count += 1;
    });

    // Calculate averages and format for chart
    const orderedDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    return orderedDays.map((day) => ({
      name: day,
      time:
        dayAggregates[day].count > 0
          ? dayAggregates[day].total / dayAggregates[day].count
          : 0,
    }));
  }, [data.sessions]);

  // If no data, display a message
  if (chartData.length === 0 || chartData.every((item) => item.time === 0)) {
    return (
      <div className="h-[240px] w-full flex items-center justify-center text-gray-500">
        No completion time data available
      </div>
    );
  }

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 15, right: 5, left: 5, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            stroke="#888888"
            fontSize={12}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            stroke="#888888"
            fontSize={12}
            tickFormatter={(value) => formatTime(value)}
          />
          <Tooltip
            formatter={(value) => [
              formatTime(Number(value)),
              "Avg. Time Spent",
            ]}
          />
          <Line
            type="monotone"
            dataKey="time"
            stroke="var(--line-chart-stroke)"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            animationDuration={500}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
