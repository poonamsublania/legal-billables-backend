// src/services/clioService.ts
import axios from "axios";
import ClioTokenModel, { IClioToken } from "../models/ClioToken";
import { Document } from "mongoose";

const CLIO_BASE_URL = (process.env.CLIO_BASE_URL || "https://api.clio.com").replace(/\/+$/, "");

// Type for Mongoose document with IClioToken
type ClioTokenDoc = Document & IClioToken;

// ------------------------
// 🔍 Check token expiry
// ------------------------
const isTokenExpired = (expiresAt?: Date | null): boolean => {
  if (!expiresAt) return true;
  return Date.now() >= expiresAt.getTime();
};

// ------------------------
// 🔄 Refresh Clio access token
// ------------------------
export const refreshClioToken = async (): Promise<string | null> => {
  try {
    const tokenDoc = await ClioTokenModel.findById<ClioTokenDoc>("singleton");
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

    // Save updates
    tokenDoc.accessToken = access_token ?? "";
    tokenDoc.refreshToken = refresh_token ?? tokenDoc.refreshToken;
    tokenDoc.expiresAt = new Date(Date.now() + expires_in * 1000);

    await tokenDoc.save(); // ✅ TS knows .save() exists

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

// ------------------------
// 🔐 Get valid Clio token (auto-refresh)
// ------------------------
export const getClioAccessToken = async (): Promise<string | null> => {
  try {
    const tokenDoc = await ClioTokenModel.findById<ClioTokenDoc>("singleton");

    if (!tokenDoc?.accessToken) {
      console.warn("[ClioService] ⚠️ No Clio access token — refreshing…");
      return await refreshClioToken();
    }

    if (isTokenExpired(tokenDoc.expiresAt)) {
      console.warn("[ClioService] ⚠️ Clio token expired — refreshing…");
      return await refreshClioToken();
    }

    console.log("[ClioService] ✅ Using existing valid Clio token");
    return tokenDoc.accessToken;
  } catch (error: any) {
    console.error("[ClioService] Error reading token:", error.message);
    return null;
  }
};

// ------------------------
// 🕒 Create time entry
// ------------------------
export const createClioTimeEntry = async ({
  contactId,
  matterId,
  description,
  minutes,
}: {
  contactId: string;
  matterId: string;
  description: string;
  minutes: number;
}) => {
  try {
    const token = await getClioAccessToken();
    if (!token) throw new Error("❌ No valid Clio token available");

    const payload = {
      data: {
        type: "time-entries",
        attributes: {
          description,
          duration: minutes,
          "activity-date": new Date().toISOString().split("T")[0],
        },
        relationships: {
          contact: { data: { type: "contacts", id: contactId } },
          matter: { data: { type: "matters", id: matterId } },
        },
      },
    };

    const response = await axios.post(`${CLIO_BASE_URL}/api/v4/time_entries`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("[ClioService] ✅ Time entry created:", response.data);
    return response.data;
  } catch (err: any) {
    console.error("❌ Failed to create time entry:", err.response?.data || err.message);
    throw err;
  }
};
