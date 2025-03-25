import type { FormAnalyticsCollection } from "@/types/types";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000";

/**
 * Fetches all form analytics data from the API
 */
export async function fetchAllAnalytics(): Promise<FormAnalyticsCollection> {
  try {
    const response = await axios.get(`${API_BASE_URL}/getFormAnalytics`);
    return response.data as FormAnalyticsCollection;
  } catch (error) {
    console.error("Failed to fetch analytics data:", error);
    throw error;
  }
}

/**
 * Fetches analytics data for a specific session
 */
// export async function fetchSessionAnalytics(
//   sessionId: string
// ): Promise<FormAnalytics> {
//   try {
//     const response = await axios.get(
//       `${API_BASE_URL}/formAnalytics/${sessionId}`
//     );
//     return response.data as FormAnalytics;
//   } catch (error) {
//     console.error(`Failed to fetch session data for ${sessionId}:`, error);
//     throw error;
//   }
// }
