import { FormAnalytics } from "@/types";

const ANALYTICS_STORAGE_KEY = "form_analytics";

export const saveAnalyticsToStorage = (analytics: FormAnalytics): void => {
  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
  } catch (error) {
    console.error("Failed to save analytics to localStorage:", error);
  }
};

export const loadAnalyticsFromStorage = (): FormAnalytics | null => {
  try {
    const storedData = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData) as FormAnalytics;
    }
  } catch (error) {
    console.error("Failed to load analytics from localStorage:", error);
  }
  return null;
};

export const clearAnalyticsFromStorage = (): void => {
  try {
    localStorage.removeItem(ANALYTICS_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear analytics from localStorage:", error);
  }
};