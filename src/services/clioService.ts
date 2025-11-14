// src/services/clioService.ts

import axios from "axios";
import ClioTokenModel from "../models/clioToken";

const CLIO_BASE_URL = "https://app.clio.com";

/** Token expiry check */
const isExpired = (expiresAt: number | null) => {
  if (!expiresAt) return true;
  return Date.now() >= expiresAt;
};

/** 🔄 Refresh token */
export const refreshClioToken = async () => {
  const tokenDoc = await ClioTokenModel.findOne({ _id: "singleton" });
  if (!tokenDoc?.refreshToken) return null;

  try {
    const res = await axios.post(
      `${CLIO_BASE_URL}/oauth/token`,
      new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.CLIO_CLIENT_ID!,
        client_secret: process.env.CLIO_CLIENT_SECRET!,
        refresh_token: tokenDoc.refreshToken!,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    tokenDoc.accessToken = res.data.access_token;
    tokenDoc.refreshToken = res.data.refresh_token;
    tokenDoc.expiresAt = Date.now() + res.data.expires_in * 1000;
    await tokenDoc.save();

    console.log("🔁 Token refreshed");
    return tokenDoc.accessToken;
  } catch (e: any) {
    console.error("❌ Refresh failed:", e.response?.data || e.message);
    return null;
  }
};

/** Get valid token (auto-refresh) */
export const getValidClioToken = async () => {
  const tokenDoc = await ClioTokenModel.findOne({ _id: "singleton" });
  if (!tokenDoc?.accessToken) return null;

  if (isExpired(tokenDoc.expiresAt)) {
    console.log("⚠️ Token expired → refreshing");
    return await refreshClioToken();
  }

  return tokenDoc.accessToken;
};
