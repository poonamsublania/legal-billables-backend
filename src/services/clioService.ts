// src/services/clioService.ts
import axios from "axios";

const CLIO_API_URL = "https://app.clio.com/api/v4/time_entries"; // Clio v4 endpoint

export const createClioTimeEntry = async (
  accessToken: string,
  description: string,
  durationInSeconds: number,
  matterId: string
): Promise<any> => {
  try {
    const response = await axios.post(
      CLIO_API_URL,
      {
        time_entry: {
          description,
          duration: durationInSeconds,
          matter_id: matterId,
          billed: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Clio entry created:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Failed to create Clio entry:", error.response?.data || error.message);
    throw new Error("Clio time entry failed");
  }
};
