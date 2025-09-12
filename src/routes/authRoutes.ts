// src/routes/authRoutes.ts
import { Router } from "express";
import axios from "axios";
import querystring from "querystring";
import { setClioToken } from "../utils/tokenStore";

const router = Router();

/**
 * Step 1: Redirect user to Clio OAuth login
 * URL: /api/auth/clio/login
 */
router.get("/clio/login", (req, res) => {
  const clientId = process.env.CLIO_CLIENT_ID!;
  const redirectUri = process.env.CLIO_REDIRECT_URI!;
  const authUrl = `https://app.clio.com/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid profile email`;

  res.redirect(authUrl);
});

/**
 * Step 2: Handle Clio OAuth callback
 * URL: /api/auth/clio/callback
 */
router.get("/clio/callback", async (req, res) => {
  const code = req.query.code as string;
  if (!code) {
    return res.status(400).json({ error: "Missing code from Clio" });
  }

  try {
    const tokenRes = await axios.post(
      "https://app.clio.com/oauth/token",
      querystring.stringify({
        grant_type: "authorization_code",
        code,
        client_id: process.env.CLIO_CLIENT_ID,
        client_secret: process.env.CLIO_CLIENT_SECRET,
        redirect_uri: process.env.CLIO_REDIRECT_URI,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    const { access_token } = tokenRes.data;

    // Save in memory (you can later persist in DB if multi-user)
    setClioToken(access_token);

    console.log("✅ Clio access token stored");
    res.send("✅ Clio authentication successful! You can now log time entries.");
  } catch (err: any) {
    console.error("❌ OAuth error:", err.response?.data || err.message);
    res.status(500).json({ error: "OAuth failed" });
  }
});

export default router;
