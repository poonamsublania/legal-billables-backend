import axios from "axios";
import ClioTokenModel from "../models/clioToken";

// Remove trailing slashes from base URL
const CLIO_BASE_URL = (process.env.CLIO_BASE_URL || "https://app.clio.com").replace(/\/+$/, "");

/**
 * 🧠 Check if token expired
 */
const isTokenExpired = (expiresAt?: number | Date) => {
  if (!expiresAt) return true;
  const expiry = typeof expiresAt === "number" ? expiresAt * 1000 : new Date(expiresAt).getTime();
  return Date.now() >= expiry;
};

/**
 * 🔄 Refresh Clio access token
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

    const { access_token, refresh_token, expires_in } = response.data;

    tokenDoc.clioAccessToken = access_token;
    tokenDoc.clioRefreshToken = refresh_token;
    tokenDoc.clioTokenExpiry = Math.floor(Date.now() / 1000) + expires_in;
    await tokenDoc.save();

    console.log("[ClioService] ✅ Access token refreshed successfully");
    return access_token;
  } catch (error: any) {
    console.error("[ClioService] 🔴 Failed to refresh token:", error.response?.data || error.message);
    return null;
  }
};

/**
 * 🧾 Get valid Clio token (auto-refresh if expired)
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
 * 🕒 Push time entry to Clio
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
    // Validate required fields
    if (!billableData.matterId || !billableData.description || !billableData.date || !billableData.durationInSeconds) {
      throw new Error("Missing required billableData fields");
    }

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

    const url = `${CLIO_BASE_URL}/api/v4/time_entries.json`;
    console.log("[ClioService] 🌐 POST", url);
    console.log("[ClioService] 📤 Payload:", JSON.stringify(payload, null, 2));

    const headers = {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const response = await axios.post(url, payload, { headers });

    console.log("[ClioService] ✅ Successfully pushed time entry:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("[ClioService] 🔴 Failed to push time entry:", error.response?.status, error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      "Failed to push time entry to Clio"
    );
  }
};

/**
 * 🔐 Safe wrapper: Get token and log time entry in one call
 */
export const logTimeEntrySafe = async (billableData: {
  description: string;
  durationInSeconds: number;
  date: string;
  matterId: string;
}) => {
  const token = await getClioToken();
  if (!token) throw new Error("No valid Clio token available");
  return logTimeEntry(token, billableData);
};
