// src/services/clioService.ts
import axios from "axios";
import ClioTokenModel, { IClioToken } from "../models/clioToken";

/**
 * Get Clio access token from DB
 * Handles "singleton" string _id safely
 */
// src/services/clioService.ts (replace getClioToken)
export const getClioToken = async (): Promise<string | null> => {
  try {
    // fetch raw doc
    const tokenDoc: any = await ClioTokenModel.findOne({ _id: "singleton" });

    if (!tokenDoc) {
      console.error("[ClioService] ❌ No token found in DB (singleton)");
      return null;
    }

    // print full doc for debugging
    console.log("[ClioService] Token document:", JSON.stringify(tokenDoc.toObject ? tokenDoc.toObject() : tokenDoc, null, 2));

    // accept multiple possible field names used across your history
    const accessToken =
      tokenDoc.accessToken ||
      tokenDoc.clioAccessToken ||
      tokenDoc.clio_access_token ||
      tokenDoc.clioAccess_Token;

    const refreshToken =
      tokenDoc.refreshToken ||
      tokenDoc.clioRefreshToken ||
      tokenDoc.clio_refresh_token;

    const expiryRaw =
      tokenDoc.expiresAt ||
      tokenDoc.clioTokenExpiry ||
      tokenDoc.clio_token_expiry ||
      tokenDoc.expires_at;

    const expiresAt = expiryRaw
      ? typeof expiryRaw === "number"
        ? new Date(expiryRaw)
        : new Date(expiryRaw)
      : null;

    if (!accessToken) {
      console.error("[ClioService] ⚠️ No access token found in tokenDoc fields");
      return null;
    }

    // OPTIONAL: normalize and persist the canonical fields so future reads are consistent
    // (only run this if you want one-time automatic migration)
    try {
      let changed = false;
      if (!tokenDoc.accessToken && accessToken) { tokenDoc.accessToken = accessToken; changed = true; }
      if (!tokenDoc.refreshToken && refreshToken) { tokenDoc.refreshToken = refreshToken; changed = true; }
      if (!tokenDoc.expiresAt && expiresAt) { tokenDoc.expiresAt = expiresAt; changed = true; }
      if (changed) {
        await tokenDoc.save();
        console.log("[ClioService] ✅ Normalized tokenDoc to canonical field names");
      }
    } catch (saveErr) {
      console.warn("[ClioService] ⚠️ Failed to normalize tokenDoc (non-fatal):", saveErr);
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

  const data = {
    data: {
      type: "TimeEntry",
      attributes: {
        description,
        duration,
        date,
        matter_id: matterId,
        ...(userId ? { user_id: userId } : {}),
        billable: true, // always mark as billable
      },
    },
  };

  console.log("[ClioService] 📤 Sending payload to Clio:", JSON.stringify(data, null, 2));

  try {
    const response = await axios.post("https://app.clio.com/api/v4/time_entries", data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      timeout: 10000, // 10s timeout to avoid hanging
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
