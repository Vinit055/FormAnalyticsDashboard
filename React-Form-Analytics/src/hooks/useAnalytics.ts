import { useContext } from "react";
import AnalyticsContext from "@/contexts/AnalyticsContext";
import { AnalyticsContextType } from "@/types";

export const useAnalytics = (): AnalyticsContextType => {
  const context = useContext(AnalyticsContext);

  if (context === undefined) {
    throw new Error("useAnalytics must be used within an AnalyticsProvider");
  }

  return context;
};