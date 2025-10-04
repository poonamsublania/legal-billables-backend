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

    console.log("[ClioService] ✅ Retrieved access token from DB");
    console.log("[ClioService] Token document:", tokenDoc);

    // ✅ fix: use correct field name
    const accessToken =
      tokenDoc.accessToken ||
      tokenDoc.clioAccessToken ||
      (tokenDoc as any).token ||
      null;

    if (!accessToken) {
      console.error("[ClioService] ⚠️ accessToken field missing in tokenDoc!");
    }

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
  payload: {
    description: string;
    duration: number;
    date: string;
    matterId: string;
    userId?: string;
  }
) => {
  const { description, duration, date, matterId, userId } = payload;

  // ✅ Correct payload format for Clio API
  const data = {
    data: {
      type: "time_entry", // ✅ lowercase
      attributes: {
        description,
        duration,
        date,
        matter_id: Number(matterId), // ✅ make sure it's number
        billable: true,
        ...(userId ? { user_id: userId } : {}),
      },
    },
  };

  console.log("[ClioService] 📤 Sending payload to Clio:", JSON.stringify(data, null, 2));

  try {
    // ✅ Correct endpoint (.json required)
    const response = await axios.post("https://app.clio.com/api/v4/time_entries.json", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    console.log("[ClioService] ✅ Clio response:", response.data);
    return response.data;
  } catch (err: any) {
    console.error(
      "[ClioService] 🔴 Failed to push time entry:",
      err.response?.data || err.message || err
    );

    throw new Error(
      err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to push time entry to Clio"
    );
  }
};
