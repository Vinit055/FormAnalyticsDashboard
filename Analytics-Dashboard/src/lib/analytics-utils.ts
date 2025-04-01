import type {
  FieldErrorSummary,
  FormAnalyticsCollection,
  TabSummary,
} from "@/types/types";

export function formatTime(milliseconds: number): string {
  if (milliseconds < 1000) return `${milliseconds}ms`;

  const seconds = Math.floor(milliseconds / 1000);
  if (seconds < 60) return `${seconds}s`;

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes < 60) {
    return `${minutes}m ${remainingSeconds}s`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${hours}h ${remainingMinutes}m ${remainingSeconds}s`;
}

export function calculateAverageCompletionTime(
  data: FormAnalyticsCollection
): number {
  const completedSessions = data.sessions.filter(
    (session) => session.formSubmitted
  );
  if (completedSessions.length === 0) return 0;

  const totalTime = completedSessions.reduce(
    (sum, session) => sum + session.formCompletionTime,
    0
  );
  return totalTime / completedSessions.length;
}

export function calculateSubmissionRate(data: FormAnalyticsCollection): number {
  if (data.sessions.length === 0) return 0;

  const submittedCount = data.sessions.filter(
    (session) => session.formSubmitted
  ).length;
  return (submittedCount / data.sessions.length) * 100;
}

export function calculateAbandonmentRate(
  data: FormAnalyticsCollection
): number {
  if (data.sessions.length === 0) return 0;

  const abandonedCount = data.sessions.filter(
    (session) => session.formAbandoned
  ).length;
  return (abandonedCount / data.sessions.length) * 100;
}

export function getTopProblemFields(
  data: FormAnalyticsCollection,
  limit = 3
): FieldErrorSummary[] {
  // Create a map to count errors by field
  const fieldErrorCounts: Record<
    string,
    { count: number; errors: Record<string, number> }
  > = {};

  // Count all sessions for calculating error rates
  const totalSessions = data.sessions.length;

  // Process each session
  data.sessions.forEach((session) => {
    Object.entries(session.fields).forEach(([fieldId, field]) => {
      if (field.validationErrors.length > 0) {
        if (!fieldErrorCounts[fieldId]) {
          fieldErrorCounts[fieldId] = { count: 0, errors: {} };
        }

        fieldErrorCounts[fieldId].count += field.validationErrors.length;

        // Count specific error messages
        field.validationErrors.forEach((error) => {
          if (!fieldErrorCounts[fieldId].errors[error]) {
            fieldErrorCounts[fieldId].errors[error] = 0;
          }
          fieldErrorCounts[fieldId].errors[error]++;
        });
      }
    });
  });

  // Convert to array and sort by error count
  const fieldSummaries: FieldErrorSummary[] = Object.entries(
    fieldErrorCounts
  ).map(([fieldId, data]) => {
    // Find most common error
    let mostCommonError: string | undefined;
    let maxCount = 0;

    Object.entries(data.errors).forEach(([error, count]) => {
      if (count > maxCount) {
        maxCount = count;
        mostCommonError = error;
      }
    });

    return {
      fieldId,
      errorCount: data.count,
      errorRate: (data.count / totalSessions) * 100,
      mostCommonError,
    };
  });

  // Sort by error count (descending) and take top N
  return fieldSummaries
    .sort((a, b) => b.errorCount - a.errorCount)
    .slice(0, limit);
}

export function getTabAnalytics(data: FormAnalyticsCollection): TabSummary[] {
  if (data.sessions.length === 0) return [];

  const tabMap: Record<
    string,
    {
      visits: number;
      timeSpent: number;
      abandonments: number;
    }
  > = {};

  // Process each session
  data.sessions.forEach((session) => {
    // Find the last tab visited in this session based on lastVisitedAt timestamp
    let lastVisitedTabId: string | null = null;
    let lastVisitTime = 0;

    // First pass: initialize tab data and find the last visited tab
    Object.entries(session.tabs).forEach(([tabId, tabData]) => {
      // Initialize tab data if not exists
      if (!tabMap[tabId]) {
        tabMap[tabId] = { visits: 0, timeSpent: 0, abandonments: 0 };
      }

      // Track basic metrics
      tabMap[tabId].visits += tabData.visits;
      tabMap[tabId].timeSpent += tabData.totalTimeSpent;

      // Determine if this tab was the last visited based on lastVisitedAt
      const visitedAt = tabData.lastVisitedAt || 0;
      if (visitedAt > lastVisitTime) {
        lastVisitTime = visitedAt;
        lastVisitedTabId = tabId;
      }
    });

    // Only increment abandonment for the last tab if the form was abandoned
    if (session.formAbandoned && lastVisitedTabId) {
      tabMap[lastVisitedTabId].abandonments++;
    }
  });

  // Format display names (capitalize first letter)
  const formatTabName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  // Convert to array and calculate averages
  return Object.entries(tabMap).map(([tabId, data]) => ({
    tabId,
    displayName: formatTabName(tabId),
    visits: data.visits,
    averageTimeSpent: data.timeSpent / data.visits,
    abandonmentRate: (data.abandonments / data.visits) * 100,
  }));
}

export function getValidationErrorTypes(
  data: FormAnalyticsCollection
): { name: string; count: number }[] {
  const errorTypeCounts: Record<string, number> = {};

  // Process each session
  data.sessions.forEach((session) => {
    Object.values(session.fields).forEach((field) => {
      field.validationErrors.forEach((error) => {
        // Extract error type (simplified approach)
        const errorType = extractErrorType(error);

        if (!errorTypeCounts[errorType]) {
          errorTypeCounts[errorType] = 0;
        }

        errorTypeCounts[errorType]++;
      });
    });
  });

  // Convert to array and sort by count
  return Object.entries(errorTypeCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

// Helper function to extract error type from error message
function extractErrorType(errorMessage: string): string {
  if (errorMessage.includes("required")) return "Required";
  if (errorMessage.includes("min") || errorMessage.includes("max"))
    return "Length";
  if (errorMessage.includes("format")) return "Format";
  if (errorMessage.includes("pattern")) return "Pattern";
  if (errorMessage.includes("match")) return "Pattern";
  if (errorMessage.includes("valid")) return "Validation";
  return "Other";
}
