import { useEffect, useState } from "react";
import {
  BarChart,
  Clock,
  FileBarChart,
  LayoutDashboard,
  Menu,
  RefreshCw,
} from "lucide-react";
import { useMediaQuery } from "@/hooks/use-mobile";
import { Link } from "react-router-dom";
import "ldrs/hourglass";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewMetrics } from "@/components/overview/OverviewMetrics";
import { FormTimeChart } from "@/components/overview/FormTimeChart";
import { SubmissionRateChart } from "@/components/overview/SubmissionRateChart";
import { ValidationErrorsChart } from "@/components/errors/ValidationErrorsChart";
import { ProblemFieldsTable } from "@/components/errors/ProblemFieldsTable";
import { TabAnalyticsTable } from "@/components/form-tabs/TabAnalyticsTable";
import { SubmissionCompletionChart } from "./submissions/SubmissionCompletionChart";
import { ThemeToggle } from "@/theme/ThemeButton";
import { useAnalyticsPolling } from "@/data/useAnalyticsPolling";
import "../styles/loader.css";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const { data, loading, refetch } = useAnalyticsPolling({
    pollingInterval: 60000, // Poll every minute
  });

  // Add a 3-second initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Use empty data object if still loading
  const analyticsData = data || { sessions: [] };

  // Show loader if in initial loading state or actual data loading
  const isLoading = initialLoading || loading;

  // If loading, show loader
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center">
        <div className="container-loader">
          <div className="half"></div>
          <div className="half"></div>
        </div>

        <span className="mt-5 text-lg">
          Hold on while we get your dashboard ready!
        </span>
      </div>
    );
  }

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
          <Button
            variant="ghost"
            size="icon"
            onClick={refetch}
            disabled={loading}
            title="Refresh data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            <span className="sr-only">Refresh</span>
          </Button>
          <ThemeToggle />
        </div>
      </div>

      <div className="flex flex-1">
        {/* Sidebar for desktop */}
        {isDesktop ? (
          <div className="hidden w-[240px] flex-col border-r bg-background lg:flex">
            <nav className="grid gap-1 p-4">
              <Button
                variant="secondary"
                className="justify-start gap-2"
                asChild
              >
                <Link to="/">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
              </Button>
              <Button variant="ghost" className="justify-start gap-2" asChild>
                <Link to="/reports">
                  <BarChart className="h-4 w-4" />
                  Reports
                </Link>
              </Button>
            </nav>
          </div>
        ) : (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetContent
              side="left"
              className="w-[240px] p-0"
              aria-labelledby="sheet-title"
            >
              <div className="flex h-14 items-center border-b px-6">
                <div className="flex items-center gap-2 font-semibold">
                  <FileBarChart className="h-5 w-5" />
                  <span>Form Analytics</span>
                </div>
              </div>
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="grid gap-1 p-4">
                <Button
                  variant="secondary"
                  className="justify-start gap-2"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link to="/">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  asChild
                  onClick={() => setOpen(false)}
                >
                  <Link to="/reports">
                    <BarChart className="h-4 w-4" />
                    Reports
                  </Link>
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

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
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
