import { AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DataProps } from "@/types/types";
import { getTopProblemFields } from "@/lib/analytics-utils";

export function ProblemFieldsTable({ data }: Readonly<DataProps>) {
  const problemFields = getTopProblemFields(data);

  // Format field names for display (convert camelCase to Title Case)
  const formatFieldName = (fieldId: string): string => {
    return fieldId
      .replace(/([A-Z])/g, " $1") // Insert a space before all capital letters
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };

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
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Field</TableHead>
            <TableHead className="text-right">Error Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problemFields.map((item) => (
            <TableRow
              key={item.fieldId}
              className="group cursor-pointer hover:bg-muted/50"
            >
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  {formatFieldName(item.fieldId)}
                </div>
                {item.mostCommonError && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Most common: {item.mostCommonError}
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="text-sm font-medium">
                  {item.errorRate.toFixed(1)}%
                </div>
                <Progress
                  value={item.errorRate}
                  max={30}
                  className="mt-2 h-2 w-24 ml-auto transition-all group-hover:w-28"
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
