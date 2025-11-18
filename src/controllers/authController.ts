// src/controllers/authController.ts
import { Request, Response } from "express";
import axios from "axios";
import ClioToken from "../models/clioToken";

// --------------------------
// Redirect user to Clio OAuth
// --------------------------
export const redirectToClioLogin = (req: Request, res: Response) => {
  if (!process.env.CLIO_CLIENT_ID || !process.env.CLIO_REDIRECT_URI) {
    return res.status(500).send("❌ Clio client ID or redirect URI not set");
  }

  const authURL = `https://app.clio.com/oauth/authorize?response_type=code&client_id=${process.env.CLIO_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.CLIO_REDIRECT_URI)}&scope=read write openid profile email`;
  console.log("🌍 Redirecting to Clio:", authURL);
  res.redirect(authURL);
};

// --------------------------
// Handle Clio OAuth callback
// --------------------------
interface ClioCallbackQuery {
  code?: string;
}

export const handleClioCallback = async (
  req: Request<{}, {}, {}, ClioCallbackQuery>,
  res: Response
) => {
  const code = req.query.code;
  if (!code) return res.status(400).send("❌ Missing Clio OAuth code");

  try {
    if (!process.env.CLIO_CLIENT_ID || !process.env.CLIO_CLIENT_SECRET || !process.env.CLIO_REDIRECT_URI) {
      throw new Error("Clio environment variables missing");
    }

    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", process.env.CLIO_CLIENT_ID);
    params.append("client_secret", process.env.CLIO_CLIENT_SECRET);
    params.append("redirect_uri", process.env.CLIO_REDIRECT_URI);
    params.append("code", code);

    const response = await axios.post(
      "https://app.clio.com/oauth/token",
      params.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token, refresh_token, expires_in } = response.data;

    // Save token in MongoDB
    const savedToken = await ClioToken.findOneAndUpdate(
      { _id: "singleton" },
      {
        clioAccessToken: access_token,
        clioRefreshToken: refresh_token,
        clioTokenExpiry: Date.now() + expires_in * 1000,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    console.log("✅ Clio token saved:", savedToken);

    // Return HTML to close window & store token in Chrome extension
    res.send(`
      <html>
        <body>
          <script>
            if (typeof chrome !== "undefined" && chrome.storage) {
              chrome.storage.local.set({ clioAccessToken: "${access_token}" }, () => {
                alert("Clio connected successfully!");
                window.close();
              });
            } else {
              alert("Clio connected! You can close this window.");
            }
          </script>
        </body>
      </html>
    `);
  } catch (err: any) {
    console.error("❌ Clio token exchange failed:", err?.response?.data || err.message);
    res.status(500).send("❌ Clio OAuth failed. Check server logs for details.");
  }
};
