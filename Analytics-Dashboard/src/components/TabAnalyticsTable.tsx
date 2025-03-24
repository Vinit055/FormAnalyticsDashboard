import { Clock, MousePointerClick, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { FormAnalyticsCollection } from "@/types/types";
import { formatTime, getTabAnalytics } from "@/lib/analytics-utils";

interface TabAnalyticsTableProps {
  data: FormAnalyticsCollection;
}

export function TabAnalyticsTable({ data }: Readonly<TabAnalyticsTableProps>) {
  const tabAnalytics = getTabAnalytics(data);

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tab</TableHead>
            <TableHead>Visits</TableHead>
            <TableHead>Avg. Time Spent</TableHead>
            <TableHead className="text-right">Abandonment Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tabAnalytics.map((tab) => (
            <TableRow key={tab.displayName} className="group hover:bg-muted/50">
              <TableCell className="font-medium">{tab.displayName}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                  {tab.visits}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  {formatTime(tab.averageTimeSpent)}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  {tab.abandonmentRate.toFixed(1)}%
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
