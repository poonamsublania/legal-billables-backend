// src/services/clioService.ts
import axios from "axios";
import ClioTokenModel from "../models/clioToken";

const CLIO_BASE_URL = (process.env.CLIO_BASE_URL || "https://app.clio.com").replace(/\/+$/, "");

/** 🧠 Check if the token is expired */
const isTokenExpired = (expiresAt?: number | Date | null): boolean => {
  if (!expiresAt) return true;
  const expiry = typeof expiresAt === "number" ? expiresAt * 1000 : new Date(expiresAt).getTime();
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

    // Update DB safely
    tokenDoc.clioAccessToken = access_token ?? null;
    tokenDoc.clioRefreshToken = refresh_token ?? null;
    tokenDoc.clioTokenExpiry = Math.floor(Date.now() / 1000) + expires_in;
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
    const tokenDoc = await ClioTokenModel.findOne();
    if (!tokenDoc) {
      console.error("[ClioService] ❌ No Clio token found in DB");
      return null;
    }

    const accessToken: string | null = tokenDoc.clioAccessToken ?? null;
    if (!accessToken) {
      console.error("[ClioService] ⚠️ Missing Clio access token in DB");
      return null;
    }

    if (isTokenExpired(tokenDoc.clioTokenExpiry ?? null)) {
      console.warn("[ClioService] ⚠️ Token expired, refreshing...");
      return await refreshClioToken();
    }

    console.log("[ClioService] ✅ Using existing valid Clio token");
    return accessToken;
  } catch (err: any) {
    console.error("[ClioService] Error fetching token:", err.message);
    return null;
  }
};
