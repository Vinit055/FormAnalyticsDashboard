import { v4 as uuidv4 } from "uuid";
import { FieldAnalytics, FormAnalytics, TabAnalytics } from "@/types";

// Action types
export type AnalyticsAction =
  | { type: "VALIDATION_ERROR"; field: string; error: string }
  | { type: "TAB_CHANGE"; tab: string }
  | { type: "FORM_SUBMIT" }
  | { type: "FORM_ABANDON" }
  | { type: "RESET_ANALYTICS" }
  | { type: "FINALIZE_TAB_TIMES" }
  | {
      type: "SET_EXPORT_REASON";
      reason: "submit" | "tabClose" | "idle" | null;
    };

// Initial state creation functions
export const createInitialFieldAnalytics = (
  fieldId: string
): FieldAnalytics => ({
  id: fieldId,
  validationErrors: [],
});

export const createInitialTabAnalytics = (): TabAnalytics => ({
  visits: 0,
  totalTimeSpent: 0,
  lastVisitTime: null,
});

export const createInitialAnalyticsState = (
  formFields: Array<string>
): FormAnalytics => {
  const fieldsAnalytics: Record<string, FieldAnalytics> = {};

  formFields.forEach((field) => {
    fieldsAnalytics[field] = createInitialFieldAnalytics(field);
  });

  return {
    sessionId: uuidv4(), // Generate unique session ID
    formStartTime: Date.now(),
    formEndTime: null,
    formCompletionTime: null,
    fields: fieldsAnalytics,
    tabs: {
      personal: createInitialTabAnalytics(),
      professional: createInitialTabAnalytics(),
      payment: createInitialTabAnalytics(),
      experience: createInitialTabAnalytics(),
    },
    formSubmitted: false,
    formAbandoned: false,
    validationErrorCount: 0,
    exportReason: null,
  };
};

// The form fields array for analytics tracking
export const analyticsFormFields = [
  "firstName",
  "lastName",
  "email",
  "dateOfBirth",
  "gender",
  "phone",
  "address",
  "city",
  "country",
  "zipCode",
  "occupation",
  "companyName",
  "yearsOfExperience",
  "skills",
  "educationLevel",
  "cardNumber",
  "cardName",
  "expiryDate",
  "cvv",
  "lifeGoals",
  "problemSolvingApproach",
  "ethicalDilemma",
  "satisfactionLevel",
  "receiveUpdates",
] as const;

// Analytics reducer
export const analyticsReducer = (
  state: FormAnalytics,
  action: AnalyticsAction
): FormAnalytics => {
  const now = Date.now();

  switch (action.type) {
    case "VALIDATION_ERROR": {
      // Check if this exact error is already tracked to avoid duplicates
      const isExistingError = state.fields[
        action.field
      ].validationErrors.includes(action.error);

      // Only increment the error count if this is a new error
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: {
            ...state.fields[action.field],
            validationErrors: isExistingError
              ? state.fields[action.field].validationErrors
              : [...state.fields[action.field].validationErrors, action.error],
          },
        },
        validationErrorCount: isExistingError
          ? state.validationErrorCount
          : state.validationErrorCount + 1,
      };
    }

    case "TAB_CHANGE": {
      const updatedTabs = { ...state.tabs };

      // Update time spent on previous tab
      Object.keys(updatedTabs).forEach((tab) => {
        if (tab !== action.tab && updatedTabs[tab].lastVisitTime !== null) {
          const tabTimeSpent = now - updatedTabs[tab].lastVisitTime;
          updatedTabs[tab] = {
            ...updatedTabs[tab],
            totalTimeSpent: updatedTabs[tab].totalTimeSpent + tabTimeSpent,
            lastVisitTime: null,
          };
        }
      });

      // Update current tab
      updatedTabs[action.tab] = {
        ...updatedTabs[action.tab],
        visits: updatedTabs[action.tab].visits + 1,
        lastVisitTime: now,
      };

      return {
        ...state,
        tabs: updatedTabs,
      };
    }

    case "FINALIZE_TAB_TIMES": {
      const updatedTabs = { ...state.tabs };

      // Update time spent on all tabs with active lastVisitTime
      Object.keys(updatedTabs).forEach((tab) => {
        if (updatedTabs[tab].lastVisitTime !== null) {
          const tabTimeSpent = now - updatedTabs[tab].lastVisitTime;
          updatedTabs[tab] = {
            ...updatedTabs[tab],
            totalTimeSpent: updatedTabs[tab].totalTimeSpent + tabTimeSpent,
            lastVisitTime: null,
          };
        }
      });

      return {
        ...state,
        tabs: updatedTabs,
      };
    }

    case "FORM_SUBMIT": {
      // Calculate the total error count before exporting
      const totalErrorCount = Object.values(state.fields).reduce(
        (count, field) => count + field.validationErrors.length,
        0
      );

      // Also finalize tab times when submitting form
      const updatedTabs = { ...state.tabs };
      Object.keys(updatedTabs).forEach((tab) => {
        if (updatedTabs[tab].lastVisitTime !== null) {
          const tabTimeSpent = now - updatedTabs[tab].lastVisitTime;
          updatedTabs[tab] = {
            ...updatedTabs[tab],
            totalTimeSpent: updatedTabs[tab].totalTimeSpent + tabTimeSpent,
            lastVisitTime: null,
          };
        }
      });

      return {
        ...state,
        validationErrorCount: totalErrorCount,
        formEndTime: now,
        formCompletionTime: now - state.formStartTime,
        formSubmitted: true,
        formAbandoned: false,
        exportReason: "submit",
        tabs: updatedTabs,
      };
    }

    case "FORM_ABANDON": {
      // Also finalize tab times when abandoning form
      const updatedTabs = { ...state.tabs };
      Object.keys(updatedTabs).forEach((tab) => {
        if (updatedTabs[tab].lastVisitTime !== null) {
          const tabTimeSpent = now - updatedTabs[tab].lastVisitTime;
          updatedTabs[tab] = {
            ...updatedTabs[tab],
            totalTimeSpent: updatedTabs[tab].totalTimeSpent + tabTimeSpent,
            lastVisitTime: null,
          };
        }
      });

      return {
        ...state,
        formEndTime: now,
        formAbandoned: true,
        tabs: updatedTabs,
      };
    }

    case "SET_EXPORT_REASON":
      return {
        ...state,
        exportReason: action.reason,
      };

    case "RESET_ANALYTICS":
      return createInitialAnalyticsState(Object.keys(state.fields));

    default:
      return state;
  }
};
