// src/services/clioService.ts
import axios from "axios";
import ClioTokenModel from "../models/clioToken";

const CLIO_BASE_URL = (process.env.CLIO_BASE_URL || "https://app.clio.com").replace(/\/+$/, "");

/** 🧠 Check if the token is expired */
const isTokenExpired = (expiresAt?: number | Date | null): boolean => {
  if (!expiresAt) return true;
  const expiry =
    typeof expiresAt === "number" ? expiresAt * 1000 : new Date(expiresAt).getTime();
  return Date.now() >= expiry;
};

/** 🔄 Refresh Clio access token */
export const refreshClioToken = async (): Promise<string | null> => {
  try {
    const tokenDoc = await ClioTokenModel.findOne();
    if (!tokenDoc?.clioRefreshToken) {
      console.error("[ClioService] ❌ No refresh token found in DB");
      return null;
    }

    console.log("[ClioService] 🔄 Refreshing Clio access token...");

    const response = await axios.post(
      `${CLIO_BASE_URL}/oauth/token`,
      {
        grant_type: "refresh_token",
        client_id: process.env.CLIO_CLIENT_ID,
        client_secret: process.env.CLIO_CLIENT_SECRET,
        refresh_token: tokenDoc.clioRefreshToken,
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    // ✅ Safe type assignments (no TS errors)
    tokenDoc.clioAccessToken = access_token ?? "";
    tokenDoc.clioRefreshToken = refresh_token ?? "";
    tokenDoc.clioTokenExpiry = Math.floor(Date.now() / 1000) + (expires_in || 3600);
    await tokenDoc.save();

    console.log("[ClioService] ✅ Token refreshed successfully");
    return access_token ?? null;
  } catch (error: any) {
    console.error(
      "[ClioService] 🔴 Token refresh failed:",
      error.response?.data || error.message
    );
    return null;
  }
};

/** 🧾 Get valid Clio token (auto-refresh if expired) */
export const getClioToken = async (): Promise<string | null> => {
  try {
    const tokenDoc = await ClioTokenModel.findOne();
    if (!tokenDoc) {
      console.error("[ClioService] ❌ No Clio token found in DB");
      return null;
    }

    let accessToken: string = tokenDoc.clioAccessToken || "";
    if (!accessToken || isTokenExpired(tokenDoc.clioTokenExpiry ?? null)) {
      console.warn("[ClioService] ⚠️ Token expired or missing, refreshing...");
      const refreshed = await refreshClioToken();
      if (!refreshed) {
        throw new Error("Failed to refresh Clio token");
      }
      accessToken = refreshed;
    }

    console.log("[ClioService] ✅ Using valid Clio token");
    return accessToken;
  } catch (err: any) {
    console.error("[ClioService] Error fetching token:", err.message);
    return null;
  }
};

/** 🧪 MOCK MODE (Free Trial): Skip real Clio API */
const MOCK_MODE = true;

/** 🚀 Push a time entry to Clio (or mock if free trial) */
export async function logTimeEntry({
  description,
  duration,
  date,
}: {
  description: string;
  duration: number;
  date: string;
}) {
  if (MOCK_MODE) {
    console.log("🧪 Simulated Clio push (free trial):", {
      description,
      duration,
      date,
    });
    return { message: "Simulated Clio push successful (free trial)" };
  }

  try {
    const accessToken = await getClioToken();
    if (!accessToken) throw new Error("Missing Clio access token");

    const response = await axios.post(
      `${CLIO_BASE_URL}/api/v4/time_entries.json`,
      {
        time_entry: {
          description,
          duration,
          date,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Successfully pushed entry to Clio:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("❌ Failed to push entry to Clio:", error.response?.data || error.message);
    throw error;
  }
}
