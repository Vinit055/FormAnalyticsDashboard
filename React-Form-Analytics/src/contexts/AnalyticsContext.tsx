import React, {
  createContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { AnalyticsContextType } from "@/types";
import {
  analyticsReducer,
  createInitialAnalyticsState,
  analyticsFormFields,
} from "@/utils/analyticsUtils";

// Constants
const IDLE_TIMEOUT = 10 * 60 * 1000; // 5 minutes in milliseconds

// Create context
const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

// Provider component
export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [analytics, dispatch] = useReducer(
    analyticsReducer,
    createInitialAnalyticsState([...analyticsFormFields])
  );

  const idleTimerRef = useRef<number | null>(null);

  // Clear and reset idle timer
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      window.clearTimeout(idleTimerRef.current);
    }

    idleTimerRef.current = window.setTimeout(() => {
      // User is idle, export analytics
      exportAnalytics("idle");
    }, IDLE_TIMEOUT);
  }, []);

  // Setup idle timer on mount
  useEffect(() => {
    // Start the timer
    resetIdleTimer();

    // Reset timer on user activity
    const handleActivity = () => {
      resetIdleTimer();
    };

    // Add event listeners for user activity
    window.addEventListener("mousemove", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("scroll", handleActivity);
    window.addEventListener("click", handleActivity);

    return () => {
      // Clean up
      if (idleTimerRef.current) {
        window.clearTimeout(idleTimerRef.current);
      }
      window.removeEventListener("mousemove", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("scroll", handleActivity);
      window.removeEventListener("click", handleActivity);
    };
  }, [resetIdleTimer]);

  // Analytics action functions
  const trackValidationError = (field: string, error: string) => {
    dispatch({ type: "VALIDATION_ERROR", field, error });
  };

  const trackTabChange = (tab: string) => {
    dispatch({ type: "TAB_CHANGE", tab });
  };

  const trackFormSubmit = () => {
    dispatch({ type: "FORM_SUBMIT" });
    // Export the analytics after the state is updated
    setTimeout(() => exportAnalytics("submit"), 0);
  };

  const trackFormAbandon = () => {
    dispatch({ type: "FORM_ABANDON" });
  };

  const resetAnalytics = () => {
    dispatch({ type: "RESET_ANALYTICS" });
  };

  // Export analytics data
  const exportAnalytics = useCallback(
    (reason: "submit" | "tabClose" | "idle" = "submit") => {
      // Create a copy of analytics that we'll update
      let analyticsData = { ...analytics };

      // Set the export reason
      analyticsData.exportReason = reason;

      // Update form state based on reason
      if (reason === "submit") {
        analyticsData.formSubmitted = true;
        analyticsData.formAbandoned = false;
        // Set end time for form completion
        analyticsData.formEndTime = new Date().getTime();
        // Calculate completion time
        const startTime = new Date(analyticsData.formStartTime).getTime();
        const endTime = new Date().getTime();
        analyticsData.formCompletionTime = endTime - startTime;
      } else if (reason === "tabClose" || reason === "idle") {
        analyticsData.formAbandoned = true;
      }

      // Create file for download
      const dataStr = JSON.stringify(analyticsData, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
        dataStr
      )}`;

      const exportFileDefaultName = `form_analytics_${new Date().toISOString()}.json`;

      const linkElement = document.createElement("a");
      linkElement.setAttribute("href", dataUri);
      linkElement.setAttribute("download", exportFileDefaultName);
      linkElement.click();
    },
    [analytics]
  );

  // Track when user leaves/closes the page
  useEffect(() => {
    const handlePageHide = (event: PageTransitionEvent) => {
      if (!analytics.formSubmitted) {
        dispatch({ type: "FORM_ABANDON" });

        // Only export analytics for tab close (not for refresh)
        // event.persisted is true when page might be restored from bfcache (refresh)
        if (!event.persisted) {
          exportAnalytics("tabClose");
        }
      }
    };

    window.addEventListener("pagehide", handlePageHide);

    return () => {
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, [analytics.formSubmitted, exportAnalytics]);

  const contextValue = useMemo(
    () => ({
      analytics,
      trackValidationError,
      trackTabChange,
      trackFormSubmit,
      trackFormAbandon,
      resetAnalytics,
      exportAnalytics,
    }),
    [analytics, exportAnalytics]
  );

  return (
    <AnalyticsContext.Provider value={contextValue}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsContext;
