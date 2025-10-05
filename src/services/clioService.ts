import axios from "axios";
import ClioTokenModel from "../models/clioToken";

const CLIO_BASE_URL = process.env.CLIO_BASE_URL || "https://app.clio.com";

/**
 * 🧠 Utility: Check if token expired
 */
const isTokenExpired = (expiresAt?: number | Date) => {
  if (!expiresAt) return true;
  const expiry =
    typeof expiresAt === "number" ? expiresAt * 1000 : new Date(expiresAt).getTime();
  return Date.now() >= expiry;
};

/**
 * 🔄 Refresh Clio Access Token using stored Refresh Token
 */
export const refreshClioToken = async (): Promise<string | null> => {
  try {
    const tokenDoc = await ClioTokenModel.findOne();
    if (!tokenDoc?.clioRefreshToken) {
      console.error("[ClioService] ❌ No refresh token found in DB");
      return null;
    }

    console.log("[ClioService] 🔄 Refreshing Clio access token...");

    const response = await axios.post(`${CLIO_BASE_URL}/oauth/token`, {
      grant_type: "refresh_token",
      client_id: process.env.CLIO_CLIENT_ID,
      client_secret: process.env.CLIO_CLIENT_SECRET,
      refresh_token: tokenDoc.clioRefreshToken,
    });

    const newAccess = response.data.access_token;
    const newRefresh = response.data.refresh_token;
    const expiresIn = response.data.expires_in;

    tokenDoc.clioAccessToken = newAccess;
    tokenDoc.clioRefreshToken = newRefresh;
    tokenDoc.clioTokenExpiry = Math.floor(Date.now() / 1000) + expiresIn;
    await tokenDoc.save();

    console.log("[ClioService] ✅ Access token refreshed successfully");
    return newAccess;
  } catch (error: any) {
    console.error(
      "[ClioService] 🔴 Failed to refresh token:",
      error.response?.data || error.message
    );
    return null;
  }
};

/**
 * 🧾 Get valid Clio access token (auto-refresh if needed)
 */
export const getClioToken = async (): Promise<string | null> => {
  try {
    const tokenDoc = await ClioTokenModel.findOne();
    if (!tokenDoc) {
      console.error("[ClioService] ❌ No Clio token document found in DB");
      return null;
    }

    const accessToken = tokenDoc.clioAccessToken || tokenDoc.accessToken || null;
    if (!accessToken) {
      console.error("[ClioService] ⚠️ Missing Clio access token in DB");
      return null;
    }

    if (isTokenExpired(tokenDoc.clioTokenExpiry || tokenDoc.expiresAt)) {
      console.warn("[ClioService] ⚠️ Token expired, refreshing...");
      return await refreshClioToken();
    }

    console.log("[ClioService] ✅ Retrieved valid Clio access token");
    return accessToken;
  } catch (err: any) {
    console.error("[ClioService] Error fetching Clio token:", err.message);
    return null;
  }
};

/**
 * 🕒 Push time entry to Clio API
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

    const url = `${CLIO_BASE_URL}/api/v4/time_entries`;
    console.log("[ClioService] 🌐 POST", url);
    console.log("[ClioService] 📤 Payload:", JSON.stringify(payload, null, 2));

    const response = await axios.post(url, payload, { headers });

    console.log("[ClioService] ✅ Successfully pushed time entry:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "[ClioService] 🔴 Failed to push time entry:",
      error.response?.status,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Failed to push time entry to Clio"
    );
  }
};
