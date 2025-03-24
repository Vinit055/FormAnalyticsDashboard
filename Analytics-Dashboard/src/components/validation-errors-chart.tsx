import {
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { FormAnalyticsCollection } from "@/types/form-analytics";
import { getValidationErrorTypes } from "@/lib/analytics-utils";

interface ValidationErrorsChartProps {
  readonly data: FormAnalyticsCollection;
}

export function ValidationErrorsChart({
  data,
}: Readonly<ValidationErrorsChartProps>) {
  const errorTypes = getValidationErrorTypes(data);

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={errorTypes}
          margin={{ top: 10, right: 10, left: 10, bottom: 24 }}
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
            fill="hsl(var(--primary))"
            radius={[4, 4, 0, 0]}
            animationDuration={800}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
