import { Request, Response } from "express";
import axios from "axios";
import ClioTokenModel from "../models/clioToken";

/**
 * Save OR Update Token
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
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log("✅ Clio token saved:", saved);
  return saved;
};

/**
 * Refresh Token
 */
export const refreshClioToken = async (): Promise<string> => {
  const tokenDoc = await ClioTokenModel.findById("singleton");
  if (!tokenDoc?.refreshToken) throw new Error("No refresh token stored");

  const form = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: process.env.CLIO_CLIENT_ID!,
    client_secret: process.env.CLIO_CLIENT_SECRET!,
    refresh_token: tokenDoc.refreshToken,
  });

  const response = await axios.post("https://app.clio.com/oauth/token", form, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  await saveOrUpdateClioToken({
    access_token: response.data.access_token,
    refresh_token: response.data.refresh_token,
    expires_in: response.data.expires_in,
  });

  console.log("🔄 Token refreshed successfully");
  return response.data.access_token;
};

/** Debug — see token */
export const getClioToken = async (req: Request, res: Response) => {
  const token = await ClioTokenModel.findById("singleton");
  res.json(token);
};
