export interface ValidationError {
  message: string;
}

export interface FormField {
  id: string;
  validationErrors: string[];
}

export interface TabAnalytics {
  visits: number;
  totalTimeSpent: number;
}

export interface FormAnalytics {
  sessionId: string;
  formStartTime: number;
  formEndTime: number;
  formCompletionTime: number;
  fields: Record<string, FormField>;
  tabs: Record<string, TabAnalytics>;
  formSubmitted: boolean;
  formAbandoned: boolean;
  validationErrorCount: number;
  exportReason: string;
}

export interface FormAnalyticsCollection {
  sessions: FormAnalytics[];
}

export interface FieldErrorSummary {
  fieldId: string;
  errorCount: number;
  errorRate: number;
  mostCommonError?: string;
}

export interface TabSummary {
  tabId: string;
  displayName: string;
  visits: number;
  averageTimeSpent: number;
  abandonmentRate: number;
}

export type Theme = "light" | "dark" | "system";

export interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}
