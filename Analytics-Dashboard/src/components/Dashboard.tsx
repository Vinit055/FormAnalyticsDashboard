import { useState, useEffect } from "react";
import {
  BarChart,
  Clock,
  FileBarChart,
  Home,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  X,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";
import type { FormAnalyticsCollection } from "@/types/types";
import { fetchAllAnalytics } from "@/data/dataFetching";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewMetrics } from "@/components/OverviewMetrics";
import { FormTimeChart } from "@/components/FormTimeChart";
import { SubmissionRateChart } from "@/components/SubmissionRateChart";
import { ValidationErrorsChart } from "@/components/ValidationErrorsChart";
import { ProblemFieldsTable } from "@/components/ProblemFieldsTable";
import { TabAnalyticsTable } from "@/components/TabAnalyticsTable";
import { SubmissionCompletionChart } from "./SubmissionCompletionChart";
import { ThemeToggle } from "@/theme/ThemeButton";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [analyticsData, setAnalyticsData] = useState<FormAnalyticsCollection>({
    sessions: [],
  });

  useEffect(() => {
    async function loadData() {
      const data = await fetchAllAnalytics();
      console.log("Vinit", data);
      setAnalyticsData(data);
    }
    loadData();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {/* Mobile Nav */}
      <div className="flex h-14 items-center border-b bg-background px-4 lg:h-[60px] lg:px-6">
        <Button
          variant="outline"
          size="icon"
          className="mr-2 lg:hidden"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
        <div className="flex items-center gap-2 font-semibold">
          <FileBarChart className="h-5 w-5" />
          <span>Form Analytics</span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        {isDesktop ? (
          <div className="hidden w-[240px] flex-col border-r bg-background lg:flex">
            <div className="flex h-14 items-center border-b px-6 lg:h-[60px]">
              <div className="flex items-center gap-2 font-semibold">
                <FileBarChart className="h-5 w-5" />
                <span>Form Analytics</span>
              </div>
            </div>
            <nav className="grid gap-1 p-4">
              <Button variant="ghost" className="justify-start gap-2" asChild>
                <div>
                  <Home className="h-4 w-4" />
                  Home
                </div>
              </Button>
              <Button
                variant="secondary"
                className="justify-start gap-2"
                asChild
              >
                <div>
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </div>
              </Button>
              <Button variant="ghost" className="justify-start gap-2" asChild>
                <div>
                  <BarChart className="h-4 w-4" />
                  Reports
                </div>
              </Button>
              <Button variant="ghost" className="justify-start gap-2" asChild>
                <div>
                  <Users className="h-4 w-4" />
                  Users
                </div>
              </Button>
              <Button variant="ghost" className="justify-start gap-2" asChild>
                <div>
                  <Settings className="h-4 w-4" />
                  Settings
                </div>
              </Button>
            </nav>
          </div>
        ) : (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent side="left" className="w-[240px] p-0">
              <div className="flex h-14 items-center border-b px-6">
                <div className="flex items-center gap-2 font-semibold">
                  <FileBarChart className="h-5 w-5" />
                  <span>Form Analytics</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <nav className="grid gap-1 p-4">
                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <div>
                    <Home className="h-4 w-4" />
                    Home
                  </div>
                </Button>
                <Button
                  variant="secondary"
                  className="justify-start gap-2"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <div>
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <div>
                    <BarChart className="h-4 w-4" />
                    Reports
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <div>
                    <Users className="h-4 w-4" />
                    Users
                  </div>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <div>
                    <Settings className="h-4 w-4" />
                    Settings
                  </div>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight">
                Form Analytics Dashboard
              </h1>
              <p className="text-muted-foreground">
                Monitor form performance and user engagement metrics
              </p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 md:w-auto md:grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="submissions">Submissions</TabsTrigger>
                <TabsTrigger value="errors">Errors</TabsTrigger>
                <TabsTrigger value="tabs">Form Tabs</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <OverviewMetrics data={analyticsData} />

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="space-y-1">
                        <CardTitle className="text-base">
                          Average Time Spent
                        </CardTitle>
                        <CardDescription>
                          Time users spend on forms
                        </CardDescription>
                      </div>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <FormTimeChart data={analyticsData} />
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <div className="space-y-1">
                        <CardTitle className="text-base">
                          Submission Rates
                        </CardTitle>
                        <CardDescription>
                          Successful vs abandoned forms
                        </CardDescription>
                      </div>
                      <BarChart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <SubmissionRateChart data={analyticsData} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="submissions" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
                  <Card className="col-span-2">
                    <CardHeader>
                      <CardTitle>Submission Completion Time</CardTitle>
                      <CardDescription>
                        Distribution of time taken to complete submissions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SubmissionCompletionChart data={analyticsData} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="errors" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                  <Card className="lg:col-span-4">
                    <CardHeader>
                      <CardTitle>Validation Error Distribution</CardTitle>
                      <CardDescription>
                        Most common validation errors by type
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ValidationErrorsChart data={analyticsData} />
                    </CardContent>
                  </Card>
                  <Card className="lg:col-span-3">
                    <CardHeader>
                      <CardTitle>Problematic Form Fields</CardTitle>
                      <CardDescription>
                        Fields with the highest error rates
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ProblemFieldsTable data={analyticsData} />
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="tabs" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tab Analytics</CardTitle>
                    <CardDescription>
                      User engagement across form tabs
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TabAnalyticsTable data={analyticsData} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
