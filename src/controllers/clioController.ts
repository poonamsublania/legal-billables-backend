// src/controllers/clioController.ts
import { Request, Response } from "express";
import axios from "axios";
import ClioTokenModel from "../models/clioToken";

/**
 * 🔹 Save or update the Clio token in MongoDB
 */
export const saveOrUpdateClioToken = async (data: {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}) => {
  const expiresAt = new Date(Date.now() + data.expires_in * 1000);

  const saved = await ClioTokenModel.findOneAndUpdate(
    { _id: "singleton" },
    {
      clioAccessToken: data.access_token,
      clioRefreshToken: data.refresh_token,
      clioTokenExpiry: Date.now() + data.expires_in * 1000,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("✅ Clio token saved in MongoDB:", saved);
  return saved;
};

/**
 * 🔄 Refresh Clio token if expired
 */
export const refreshClioToken = async (): Promise<string> => {
  const tokenDoc = await ClioTokenModel.findOne({ _id: "singleton" });
  if (!tokenDoc?.refreshToken) throw new Error("No refresh token stored");

  const data = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: process.env.CLIO_CLIENT_ID!,
    client_secret: process.env.CLIO_CLIENT_SECRET!,
    refresh_token: tokenDoc.refreshToken,
  });

  const response = await axios.post("https://app.clio.com/oauth/token", data, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  // Save refreshed token to MongoDB
  await saveOrUpdateClioToken({
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
    expires_in: response.data.expires_in,
  });

  console.log("[ClioController] ✅ Token refreshed successfully");
  return response.data.access_token;
};

/**
 * 🕒 Log a time entry in Clio
 */
export const logTimeEntry = async (req: Request, res: Response) => {
  try {
    let tokenDoc = await ClioTokenModel.findOne({ _id: "singleton" });
    if (!tokenDoc) return res.status(401).json({ error: "Connect Clio first" });

    // Refresh token if missing or expired
    if (!tokenDoc.accessToken || !tokenDoc.expiresAt || Date.now() >= tokenDoc.expiresAt.getTime()) {
      console.log("[ClioController] 🔄 Access token missing or expired. Refreshing...");
      tokenDoc.accessToken = await refreshClioToken();
    }

    const { description, duration, date, matterId } = req.body;
    if (!description || !duration || !date || !matterId)
      return res.status(400).json({ error: "Missing required fields" });

    const payload = {
      data: {
        type: "TimeEntry",
        attributes: { description, duration, date, matter_id: matterId },
      },
    };

    const result = await axios.post("https://app.clio.com/api/v4/time_entries", payload, {
      headers: { Authorization: `Bearer ${tokenDoc.accessToken}`, "Content-Type": "application/json" },
    });

    console.log("[ClioController] ✅ Time entry logged:", result.data);
    res.json({ success: true, result: result.data });
  } catch (err: any) {
    console.error("❌ Failed to log time entry:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to log time entry", details: err.response?.data || err.message });
  }
};

/**
 * 🧾 Optional: Get current Clio token document (for debugging)
 */
export const getClioToken = async (req: Request, res: Response) => {
  try {
    const tokenDoc = await ClioTokenModel.findOne({ _id: "singleton" });
    res.json(tokenDoc || null);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
