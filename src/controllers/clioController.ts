import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";
import { saveTokens, getStoredTokens } from "../utils/tokenStore"; // ✅ Added DB helpers

dotenv.config();

const CLIO_BASE_URL = "https://app.clio.com";
const CLIENT_ID = process.env.CLIO_CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIO_CLIENT_SECRET!;
const REDIRECT_URI = process.env.CLIO_REDIRECT_URI!; // ✅ ensure you have this in .env

// ---------------------------
// ✅ Step 1: Clio OAuth Login
// ---------------------------
export const clioAuth = (req: Request, res: Response) => {
  const authUrl = `${CLIO_BASE_URL}/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(authUrl);
};

// ---------------------------
// ✅ Step 2: Clio OAuth Callback — Save tokens to MongoDB
// ---------------------------
export const clioCallback = async (req: Request, res: Response) => {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {
    const tokenRes = await axios.post(`${CLIO_BASE_URL}/oauth/token`, {
      grant_type: "authorization_code",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      code,
    });

    const { access_token, refresh_token, expires_in } = tokenRes.data;

    // ✅ Save tokens to MongoDB
    await saveTokens({
      clioAccessToken: access_token,
      clioRefreshToken: refresh_token,
      clioTokenExpiry: Date.now() + expires_in * 1000,
    });

    console.log("✅ Clio token saved to MongoDB successfully");

    res.send("✅ Clio authentication successful! Tokens saved to MongoDB.");
  } catch (err: any) {
    console.error("❌ Error fetching Clio token:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get Clio token" });
  }
};

// ---------------------------
// ✅ Step 3: Push time entry to Clio using stored token
// ---------------------------
export const pushToClio = async (req: Request, res: Response) => {
  const { description, duration, date } = req.body;

  if (!description || !duration || !date) {
    return res.status(400).json({ error: "Missing fields in request body" });
  }

  // ✅ Get token from MongoDB
  const tokens = await getStoredTokens();
  const accessToken = tokens?.clioAccessToken;

  if (!accessToken) {
    return res
      .status(401)
      .json({ error: "No Clio access token found. Please authenticate first." });
  }

  try {
    const entry = {
      activity: {
        description,
        duration,
        date,
      },
    };

    const response = await axios.post(
      `${CLIO_BASE_URL}/api/v4/activities.json`,
      entry,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    res.json({
      success: true,
      message: "✅ Time entry pushed to Clio successfully",
      data: response.data,
    });
  } catch (error: any) {
    console.error("❌ Failed to push to Clio:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      res.status(401).json({ error: "Access token expired. Please log in again." });
    } else {
      res.status(500).json({ error: "Failed to push to Clio" });
    }
  }
};

// ---------------------------
// ✅ Step 4: Mock local log (for testing without Clio)
// ---------------------------
export const logTimeEntry = async (req: Request, res: Response) => {
  const { description, duration, date } = req.body;

  if (!description || !duration || !date) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  res.json({
    success: true,
    message: "🕒 Time entry logged successfully (mock local entry)",
    data: { description, duration, date },
  });
};

// ---------------------------
// ✅ Step 5: Get token status from MongoDB
// ---------------------------
export const getClioToken = async (req: Request, res: Response) => {
  const tokens = await getStoredTokens();

  if (!tokens || !tokens.clioAccessToken) {
    return res.status(404).json({ success: false, message: "No token in DB" });
  }

  res.json({
    success: true,
    message: "Token available in MongoDB",
    tokenPreview: tokens.clioAccessToken.substring(0, 10) + "...",
  });
};

// ---------------------------
// ✅ Step 6: Debug route — view token info
// ---------------------------
export const debugToken = async (req: Request, res: Response) => {
  const tokens = await getStoredTokens();

  if (!tokens) {
    return res.status(404).json({ success: false, message: "No tokens found" });
  }

  res.json({
    success: true,
    message: "Tokens retrieved",
    data: {
      accessToken: tokens.clioAccessToken
        ? tokens.clioAccessToken.slice(0, 12) + "... (truncated)"
        : "none",
      refreshToken: tokens.clioRefreshToken ? "exists" : "none",
      expiresAt: tokens.clioTokenExpiry,
    },
  });
};
