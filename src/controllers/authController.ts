import { Request, Response } from "express";
import axios from "axios";
import ClioTokenModel from "../models/clioToken";

// Redirect to Clio login
export const redirectToClioLogin = (req: Request, res: Response) => {
  const authURL = `https://app.clio.com/oauth/authorize?response_type=code&client_id=${process.env.CLIO_CLIENT_ID}&redirect_uri=${process.env.CLIO_REDIRECT_URI}&scope=read write openid profile email`;
  console.log("🌍 Redirecting to Clio:", authURL);
  res.redirect(authURL);
};

// Handle Clio OAuth callback
export const handleClioCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;
  if (!code) return res.status(400).send("❌ Missing Clio OAuth code");

  try {
    const params = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: process.env.CLIO_CLIENT_ID!,
      client_secret: process.env.CLIO_CLIENT_SECRET!,
      redirect_uri: process.env.CLIO_REDIRECT_URI!,
      code: code,
    });

    const response = await axios.post(
      "https://app.clio.com/oauth/token",
      params,
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token, expires_in } = response.data;
    const expiresAt = new Date(Date.now() + expires_in * 1000);

    // ⚡ Always update singleton in MongoDB
    const savedToken = await ClioTokenModel.findOneAndUpdate(
      { _id: "singleton" },
      {
        clioAccessToken: access_token,
        clioRefreshToken: refresh_token,
        clioTokenExpiry: Date.now() + expires_in * 1000,
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("✅ Clio token saved in MongoDB:", savedToken);
    res.send("✅ Clio authentication successful! Tokens stored in DB.");
  } catch (err: any) {
    console.error("❌ Clio token exchange failed:", err?.response?.data || err.message);
    res.status(500).send("❌ Clio OAuth failed.");
  }
};
