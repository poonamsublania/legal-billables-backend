// src/services/clioService.ts
import axios from "axios";
import ClioTokenModel, { IClioToken } from "../models/clioToken";

/**
 * Get Clio access token from DB
 */
export const getClioToken = async (): Promise<string | null> => {
  try {
    const tokenDoc = (await ClioTokenModel.findOne({ _id: "singleton" })) as IClioToken | null;

    if (!tokenDoc) {
      console.error("[ClioService] ❌ No token found in DB (singleton)");
      return null;
    }

    // Use the correct field from your DB
    const accessToken = tokenDoc.clioAccessToken || null;
    if (!accessToken) {
      console.error("[ClioService] ⚠️ clioAccessToken field is missing in DB document");
      return null;
    }

    console.log("[ClioService] ✅ Retrieved access token from DB");
    return accessToken;
  } catch (err: any) {
    console.error("[ClioService] Error fetching Clio token:", err.message || err);
    return null;
  }
};

/**
 * Push time entry to Clio API
 */
export const logTimeEntry = async (
  accessToken: string,
  billableData: {
    description: string;
    durationInSeconds: number;
    date: string;
    matterId: string;
  }
) => {
  try {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    // Correct payload for Clio API
    const payload = {
      data: {
        type: "TimeEntry",
        attributes: {
          description: billableData.description,
          duration: billableData.durationInSeconds,
          date: billableData.date,
          billable: true,
          matter_id: Number(billableData.matterId),
        },
      },
    };

    console.log("[ClioService] 📤 Sending payload to Clio:", JSON.stringify(payload, null, 2));

    // Correct endpoint for time entries
    const response = await axios.post("https://app.clio.com/api/v4/time_entries", payload, { headers });

    console.log("[ClioService] ✅ Successfully pushed time entry:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "[ClioService] 🔴 Failed to push time entry:",
      error.response?.data || error.message || error
    );
    throw new Error(
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to push time entry to Clio"
    );
  }
};
