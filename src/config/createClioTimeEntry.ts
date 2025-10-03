import axios from "axios";

const API_BASE_URL = "https://app.clio.com/api/v4";

export async function createClioTimeEntry(
  accessToken: string,
  data: {
    description: string;
    duration: number;
    matter_id: string;
    date?: string;
  }
) {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/time_entries`,
      {
        description: data.description,
        duration: data.duration,
        matter_id: data.matter_id,
        billable: true,
        ...(data.date && { date: data.date }),
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("[createClioTimeEntry] Success:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("🔴 Failed to create Clio time entry:", error.response?.data || error.message);
    throw error;
  }
}
