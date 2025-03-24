import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { FormAnalyticsCollection } from "@/types/form-analytics";
import { formatTime } from "@/lib/analytics-utils";

interface FormTimeChartProps {
  readonly data: FormAnalyticsCollection;
}

export function FormTimeChart(_props: FormTimeChartProps) {
  // For demo purposes, we'll create a weekly chart with average completion times
  // In a real app, this would be based on actual timestamps from the data
  const chartData = [
    { name: "Mon", time: 145000 },
    { name: "Tue", time: 139000 },
    { name: "Wed", time: 162000 },
    { name: "Thu", time: 170000 },
    { name: "Fri", time: 152000 },
    { name: "Sat", time: 132000 },
    { name: "Sun", time: 122000 },
  ];

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
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
            formatter={(value) => [formatTime(Number(value)), "Time Spent"]}
          />
          <Line
            type="monotone"
            dataKey="time"
            stroke="hsl(0 0% 9%)"
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
