import { Control } from "react-hook-form";
import { FormValues } from "./schemas/FormSchema";
import { ReactElement } from "react";

export interface InfoProps {
  control: Control<FormValues>;
}

export interface AnalyticsContextType {
  analytics: FormAnalytics;
  trackValidationError: (field: string, error: string) => void;
  trackTabChange: (tab: string) => void;
  trackFormSubmit: () => void;
  trackFormAbandon: () => void;
  resetAnalytics: () => void;
  exportAnalytics: (reason?: "submit" | "tabClose" | "idle") => void;
}

export interface InputElementProps {
  onFocus?: (e: React.FocusEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
}

export interface TrackedFormFieldProps {
  name: keyof FormValues;
  label: string;
  description?: string;
  children: ReactElement<InputElementProps>;
}

// Analytics data structure
export interface FieldAnalytics {
  id: string; // Field identifier
  validationErrors: string[]; // Track only validation errors
}

export interface TabAnalytics {
  visits: number;
  totalTimeSpent: number; // in milliseconds
  lastVisitTime: number | null;
}

export interface FormAnalytics {
  sessionId: string; // Unique ID for this form session
  formStartTime: number;
  formEndTime: number | null;
  formCompletionTime: number | null;
  fields: Record<string, FieldAnalytics>;
  tabs: Record<string, TabAnalytics>;
  formSubmitted: boolean;
  formAbandoned: boolean;
  validationErrorCount: number;
  exportReason: "submit" | "tabClose" | "idle" | null;
}
