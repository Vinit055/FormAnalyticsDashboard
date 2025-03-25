import { useState, useEffect } from "react";
import { fetchAllAnalytics } from "@/data/dataFetching";
import type { FormAnalyticsCollection } from "@/types/types";

interface UseAnalyticsPollingOptions {
  /**
   * Polling interval in milliseconds
   * @default 30000 (30 seconds)
   */
  pollingInterval?: number;

  /**
   * Whether polling is enabled
   * @default true
   */
  enabled?: boolean;
}

/**
 * Hook for periodically fetching analytics data to keep dashboard up to date
 */
export function useAnalyticsPolling({
  pollingInterval = 30000,
  enabled = true,
}: UseAnalyticsPollingOptions = {}) {
  const [data, setData] = useState<FormAnalyticsCollection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        setLoading(true);
        const analyticsData = await fetchAllAnalytics();
        setData(analyticsData);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch analytics data")
        );
        console.error("Error fetching analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling interval
    let intervalId: NodeJS.Timeout | null = null;

    if (enabled) {
      intervalId = setInterval(fetchData, pollingInterval);
    }

    // Cleanup on unmount
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [pollingInterval, enabled]);

  // Function to manually refresh data
  const refetch = () => {
    setLoading(true);
    fetchAllAnalytics()
      .then((data) => {
        setData(data);
        setError(null);
      })
      .catch((err) => {
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to fetch analytics data")
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return { data, loading, error, refetch };
}
