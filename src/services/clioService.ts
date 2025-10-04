import axios from "axios";
import ClioTokenModel, { IClioToken } from "../models/clioToken";

/**
 * Get Clio access token from DB
 */
export const getClioToken = async (): Promise<string> => {
  try {
    const tokenDoc = (await ClioTokenModel.findOne({ _id: "singleton" })) as IClioToken | null;
    if (!tokenDoc || !tokenDoc.clioAccessToken) {
      throw new Error("No Clio access token found in DB");
    }
    return tokenDoc.clioAccessToken;
  } catch (err: any) {
    console.error("[ClioService] 🔴 Error fetching Clio token:", err.message || err);
    throw err;
  }
};

/**
 * Ping Clio API to verify token works
 */
export const pingClio = async () => {
  try {
    const accessToken = await getClioToken();
    const headers = { Authorization: `Bearer ${accessToken}` };
    const response = await axios.get("https://app.clio.com/api/v4/users/me", { headers });
    return response.data;
  } catch (err: any) {
    console.error("[ClioService] 🔴 Clio ping failed:", err.response?.data || err.message || err);
    throw err;
  }
};

/**
 * Push a time entry to Clio
 */
export const logTimeEntry = async (billableData: {
  description: string;
  durationInSeconds: number;
  date: string;
  matterId: string;
}) => {
  try {
    const accessToken = await getClioToken();
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

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

    const response = await axios.post("https://app.clio.com/api/v4/time_entries", payload, { headers });
    console.log("[ClioService] ✅ Successfully pushed time entry:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[ClioService] 🔴 Failed to push time entry:", error.response?.data || error.message || error);
    throw new Error(
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to push time entry to Clio"
    );
  }
};
