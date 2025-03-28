import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { DataProps } from "@/types/types";
import {
  calculateAbandonmentRate,
  calculateSubmissionRate,
} from "@/lib/analytics-utils";
import { AlertTriangle } from "lucide-react";

export function SubmissionRateChart({ data }: Readonly<DataProps>) {
  const submissionRate = calculateSubmissionRate(data);
  const abandonmentRate = calculateAbandonmentRate(data);

  const chartData = [
    {
      name: "Completed",
      value: submissionRate,
      color: "var(--submission-success)",
    },
    {
      name: "Abandoned",
      value: abandonmentRate,
      color: "var(--submission-failure)",
    },
  ];

  if (data.sessions.length === 0) {
    return (
      <div className="h-[240px] w-full flex items-center justify-center text-gray-500 gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        No data available
      </div>
    );
  }

  return (
    <div className="h-[240px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            animationDuration={800}
            animationBegin={200}
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`${Number(value).toFixed(1)}%`, "Rate"]}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6">
        {chartData.map((entry) => (
          <div key={`legend-${entry.name}`} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
