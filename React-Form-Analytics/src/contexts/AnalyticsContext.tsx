import React, {
  createContext,
  useReducer,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { AnalyticsContextType } from "@/types";
import axios from "axios";
import {
  analyticsReducer,
  createInitialAnalyticsState,
  getAnalyticsFormFields,
} from "@/utils/analyticsUtils";

// Constants
const IDLE_TIMEOUT = 10 * 60 * 1000;
const API_URL = "http://127.0.0.1:8000";
// Create context
const AnalyticsContext = createContext<AnalyticsContextType | undefined>(
  undefined
);

// Provider component
export const AnalyticsProvider: React.FC<{
  children: React.ReactNode;
  tabs?: string[];
  formSchema: Record<string, any>;
}> = ({ children, tabs, formSchema }) => {
  // Use the form schema to get field names
  const formFields = useMemo(
    () => getAnalyticsFormFields(formSchema),
    [formSchema]
  );

  // Create a default tab if none are provided
  const normalizedTabs = useMemo(() => {
    if (!tabs || tabs.length === 0) {
      return ["default"];
    }
    return tabs;
  }, [tabs]);

  const [analytics, dispatch] = useReducer(
    analyticsReducer,
    createInitialAnalyticsState(formFields, normalizedTabs)
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

    // If using default tab, immediately track a visit to it
    if (!tabs || tabs.length === 0) {
      trackTabChange("default");
    }

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
  }, [resetIdleTimer, tabs]);

  // Analytics action functions
  const trackValidationError = (field: string, error: string) => {
    dispatch({ type: "VALIDATION_ERROR", field, error });
  };

  const trackTabChange = (tab: string) => {
    dispatch({ type: "TAB_CHANGE", tab });
  };

  const trackFormAbandon = () => {
    dispatch({ type: "FORM_ABANDON" });
  };

  const resetAnalytics = () => {
    dispatch({ type: "RESET_ANALYTICS" });
  };

  // Export analytics data
  const exportAnalytics = useCallback(
    async (reason: "submit" | "tabClose" | "idle" = "submit") => {
      // First, create clean tab objects without lastVisitTime
      const cleanTabs: Record<
        string,
        { visits: number; totalTimeSpent: number }
      > = {};
      const now = Date.now();

      // Calculate final tab times and create clean tab objects
      Object.keys(analytics.tabs).forEach((tab) => {
        const currentTab = analytics.tabs[tab];
        let totalTime = currentTab.totalTimeSpent;

        if (currentTab.lastVisitTime !== null) {
          totalTime += now - currentTab.lastVisitTime;
        }

        cleanTabs[tab] = {
          visits: currentTab.visits,
          totalTimeSpent: totalTime,
        };
      });

      const completeAnalytics = {
        ...analytics,
        tabs: cleanTabs,
        formEndTime: now,
        formCompletionTime: now - analytics.formStartTime,
        formSubmitted: reason === "submit" ? true : analytics.formSubmitted,
        formAbandoned:
          reason === "tabClose" || reason === "idle"
            ? true
            : analytics.formAbandoned,
        exportReason: reason,
      };

      try {
        // Send analytics data to API server
        await axios.post(`${API_URL}/formAnalytics`, completeAnalytics);

        // After sending to server, update the state to match what we exported
        if (reason === "submit") {
          dispatch({ type: "FORM_SUBMIT" });
        } else if (reason === "tabClose" || reason === "idle") {
          dispatch({ type: "FORM_ABANDON" });
        }
        dispatch({ type: "SET_EXPORT_REASON", reason });

        // Additionally dispatch a tab finalization action
        dispatch({ type: "FINALIZE_TAB_TIMES" });
      } catch (error) {
        console.error("Failed to send analytics data to server:", error);

        // Fallback to client-side download if API fails
        const dataStr = JSON.stringify(completeAnalytics, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
          dataStr
        )}`;

        const exportFileDefaultName = `form_analytics_${new Date().toISOString()}.json`;

        const linkElement = document.createElement("a");
        linkElement.setAttribute("href", dataUri);
        linkElement.setAttribute("download", exportFileDefaultName);
        linkElement.click();
      }
    },
    [analytics, dispatch]
  );

  const trackFormSubmit = useCallback(async () => {
    try {
      await exportAnalytics("submit");
      // After successful submission, redirect to a success page
      window.location.href = "/form-success";
    } catch (error) {
      console.error("Error during form submission:", error);
      return { success: false, error };
    }
  }, [exportAnalytics]);

  // Track when user leaves/closes the page
  useEffect(() => {
    // Define event handlers
    const handleUnload = () => {
      // Use navigator.sendBeacon for reliable data sending during page unload
      const blob = new Blob(
        [
          JSON.stringify({
            ...analytics,
            formAbandoned: true,
            exportReason: "tabClose",
          }),
        ],
        { type: "application/json" }
      );
      navigator.sendBeacon(`${API_URL}/formAnalytics`, blob);
    };

    // Add event listeners
    window.addEventListener("unload", handleUnload);
    window.addEventListener("beforeunload", handleUnload);

    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener("unload", handleUnload);
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [analytics]);

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
