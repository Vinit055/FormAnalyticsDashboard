import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { DataProps } from "@/types/types";
import { getValidationErrorTypes } from "@/lib/analytics-utils";
import { AlertTriangle } from "lucide-react";

export function ValidationErrorsChart({ data }: Readonly<DataProps>) {
  const errorTypes = getValidationErrorTypes(data);

  if (
    data.sessions.length === 0 ||
    data.sessions.every((item) => item.validationErrorCount === 0)
  ) {
    return (
      <div className="h-[240px] w-full flex items-center justify-center text-gray-500 gap-2">
        <AlertTriangle className="h-4 w-4 text-amber-500" />
        No data available
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={errorTypes}
          margin={{ top: 10, right: 10, left: 10, bottom: 24 }}
          barSize={100}
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
          />
          <Tooltip formatter={(value) => [`${value}`, "Errors"]} />
          <Bar
            dataKey="count"
            fill="var(--error-chart-fill)"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
