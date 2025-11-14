// src/services/clioService.ts
import axios from "axios";
import ClioTokenModel  from "../models/clioToken";

const CLIO_BASE_URL = (process.env.CLIO_BASE_URL || "https://app.clio.com").replace(/\/+$/, "");

/** 🧠 Check if the token is expired */
const isTokenExpired = (expiresAt?: Date | null): boolean => {
  if (!expiresAt) return true;
  return Date.now() >= expiresAt.getTime();
};

/** 🔄 Refresh Clio access token */
export const refreshClioToken = async (): Promise<string | null> => {
  try {
    const tokenDoc = await ClioTokenModel.findOne({ _id: "singleton" });
    if (!tokenDoc?.refreshToken) {
      console.error("[ClioService] ❌ No refresh token found in DB");
      return null;
    }

    console.log("[ClioService] 🔄 Refreshing Clio access token...");

    const response = await axios.post(
      `${CLIO_BASE_URL}/oauth/token`,
      new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.CLIO_CLIENT_ID!,
        client_secret: process.env.CLIO_CLIENT_SECRET!,
        refresh_token: tokenDoc.refreshToken!,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    // Save token updates
    tokenDoc.accessToken = access_token ?? null;
    tokenDoc.refreshToken = refresh_token ?? tokenDoc.refreshToken;
    tokenDoc.expiresAt = new Date(Date.now() + expires_in * 1000); // store as Date
    await tokenDoc.save();

    console.log("[ClioService] ✅ Token refreshed successfully");
    return access_token ?? null;
  } catch (error: any) {
    console.error("[ClioService] 🔴 Token refresh failed:", error.response?.data || error.message);
    return null;
  }
};

/** 🧾 Get valid Clio token (auto-refresh if expired) */
export const getClioToken = async (): Promise<string | null> => {
  try {
    const tokenDoc = await ClioTokenModel.findOne({ _id: "singleton" });
    if (!tokenDoc) {
      console.error("[ClioService] ❌ No Clio token found in DB");
      return null;
    }

    if (!tokenDoc.accessToken || isTokenExpired(tokenDoc.expiresAt)) {
      console.warn("[ClioService] ⚠️ Token missing or expired, refreshing...");
      return await refreshClioToken();
    }

    console.log("[ClioService] ✅ Using existing valid Clio token");
    return tokenDoc.accessToken;
  } catch (err: any) {
    console.error("[ClioService] Error fetching token:", err.message);
    return null;
  }
};

/** 🕒 Log time entry to Clio */
export const logTimeEntry = async (entry: {
  description: string;
  duration: number; // in minutes
  date: string; // ISO string
  matterId: string;
}) => {
  try {
    const token = await getClioToken();
    if (!token) throw new Error("No valid Clio token available");

    const payload = {
      data: {
        type: "TimeEntry",
        attributes: {
          description: entry.description,
          duration: entry.duration,
          date: entry.date,
          matter_id: entry.matterId,
        },
      },
    };

    const response = await axios.post(`${CLIO_BASE_URL}/api/v4/time_entries`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("[ClioService] ✅ Time entry logged:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("❌ Failed to log time entry:", err.response?.data || err.message);
    throw err;
  }
};
