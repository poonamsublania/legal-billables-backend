// src/controllers/clioAuthController.ts
import { Request, Response } from "express";
import axios from "axios";
import ClioTokenModel from "../models/clioToken";

// ✅ Redirect user to Clio login
export const redirectToClioLogin = (req: Request, res: Response) => {
  const authURL = `https://app.clio.com/oauth/authorize?response_type=code&client_id=${process.env.CLIO_CLIENT_ID}&redirect_uri=${process.env.CLIO_REDIRECT_URI}&scope=read write openid profile email`;
  console.log("🌍 Redirecting to Clio:", authURL);
  res.redirect(authURL);
};

// ✅ Handle Clio OAuth callback
export const handleClioCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).send("❌ Missing Clio OAuth code");

  try {
    // Exchange code for tokens
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", process.env.CLIO_CLIENT_ID!);
    params.append("client_secret", process.env.CLIO_CLIENT_SECRET!);
    params.append("redirect_uri", process.env.CLIO_REDIRECT_URI!);
    params.append("code", code);

    const response = await axios.post("https://app.clio.com/oauth/token", params, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    const { access_token, refresh_token, expires_in } = response.data;

    // Calculate expiry timestamp
    const expiresAt = Date.now() + expires_in * 1000;

    // ⚡ Save token in MongoDB using singleton pattern
    const savedToken = await ClioTokenModel.findOneAndUpdate(
      { _id: "singleton" }, // Always use single document
      {
        clioAccessToken: access_token,
        clioRefreshToken: refresh_token,
        clioTokenExpiry: expiresAt,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("✅ Clio token saved:", savedToken);
    res.send("✅ Clio authentication successful! You can now log time entries.");
  } catch (err: any) {
    console.error("❌ Clio token exchange failed:", err?.response?.data || err.message);
    res.status(500).send("❌ Clio OAuth failed.");
  }
};
