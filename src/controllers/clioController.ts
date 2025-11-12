// src/controllers/clioController.ts
import { Request, Response } from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const CLIO_BASE_URL = "https://app.clio.com";
const CLIENT_ID = process.env.CLIO_CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIO_CLIENT_SECRET!;
const REDIRECT_URI = process.env.CLIO_REDIRECT_URI!;

// ⚠️ Temporary in-memory token storage (resets on restart)
let accessToken: string | null = null;

// ---------------------------
// ✅ Step 1: Clio OAuth Login
// ---------------------------
export const clioAuth = (req: Request, res: Response) => {
  const authUrl = `${CLIO_BASE_URL}/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(authUrl);
};

// ---------------------------
// ✅ Step 2: Clio OAuth Callback
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

    accessToken = tokenRes.data.access_token;
    console.log("✅ Clio access token received:", !!accessToken);

    res.send("✅ Clio authorization successful! You can now push data.");
  } catch (err: any) {
    console.error("❌ Error fetching Clio token:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get Clio token" });
  }
};

// ---------------------------
// ✅ Step 3: Push time entry to Clio
// ---------------------------
export const pushToClio = async (req: Request, res: Response) => {
  if (!accessToken)
    return res
      .status(401)
      .json({ error: "Not authorized with Clio. Please log in first." });

  const { description, duration, date } = req.body;

  if (!description || !duration || !date) {
    return res.status(400).json({ error: "Missing fields in request body" });
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
// ✅ Step 5: Get token status
// ---------------------------
export const getClioToken = async (req: Request, res: Response) => {
  res.json({
    success: true,
    accessToken: accessToken ? "Token available" : "No token yet",
  });
};

// ---------------------------
// ✅ Step 6: Debug route (check token)
// ---------------------------
export const debugToken = (req: Request, res: Response) => {
  if (!accessToken) {
    return res.status(404).json({
      success: false,
      message: "No access token found. Please log in to Clio first.",
    });
  }

  res.json({
    success: true,
    message: "Access token available",
    tokenPreview: accessToken.substring(0, 10) + "...",
  });
};
