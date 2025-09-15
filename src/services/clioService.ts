import axios from "axios";

const CLIO_BASE_URL = "https://app.clio.com/api/v4"; // Clio API base

export const logTimeEntry = async (accessToken: string, timeEntryData: {
  matter_id: string;
  user_id: string;
  duration: number; // in seconds
  description: string;
  date: string; // ISO date, e.g., "2025-09-15"
}) => {
  try {
    const response = await axios.post(
      `${CLIO_BASE_URL}/activities`,
      {
        activity: {
          matter_id: timeEntryData.matter_id,
          user_id: timeEntryData.user_id,
          duration: timeEntryData.duration,
          description: timeEntryData.description,
          occurred_at: timeEntryData.date
        }
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Clio time entry error:", error.response?.data || error.message);
    throw error;
  }
};
