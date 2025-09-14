// src/controllers/authController.ts
import { Request, Response } from "express";
import axios from "axios";
import ClioToken from "../models/clioToken"; // MongoDB model

// Step 1: Redirect user to Clio login page
// Step 1: Redirect user to Clio login page
export const redirectToClioLogin = (req: Request, res: Response) => {
  const authURL = `https://app.clio.com/oauth/authorize?response_type=code&client_id=${process.env.CLIO_CLIENT_ID}&redirect_uri=${process.env.CLIO_REDIRECT_URI}&scope=read%20write%20openid%20profile%20email`;

  console.log("🌍 Redirecting to Clio:", authURL);
  res.redirect(authURL);
};


// Step 2: Handle Clio callback and save tokens to MongoDB
export const handleClioCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  if (!code) {
    console.error("❌ Missing OAuth code from Clio callback");
    return res.status(400).send("❌ Missing code from Clio");
  }

  try {
    console.log("📥 Received OAuth code:", code);

    // Exchange code for access token
    const tokenResponse = await axios.post("https://app.clio.com/oauth/token", {
      grant_type: "authorization_code",
      client_id: process.env.CLIO_CLIENT_ID,
      client_secret: process.env.CLIO_CLIENT_SECRET,
      redirect_uri: process.env.CLIO_REDIRECT_URI,
      code,
    });

    console.log("📤 Clio Token Response:", tokenResponse.data);

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Step 3: Save token in MongoDB (singleton pattern)
    const savedToken = await ClioToken.findOneAndUpdate(
      { _id: "singleton" }, // always overwrite 1 record
      {
        clioAccessToken: access_token,
        clioRefreshToken: refresh_token,
        clioTokenExpiry: Date.now() + expires_in * 1000, // expiry in ms
      },
      { 
        upsert: true,
         new: true,
         setDefaultsOnInsert: true 
        }
    );
    console.log("✅ Clio token saved in MongoDB:", savedToken);

    res.send("✅ Clio authorization successful! You may now close this tab.");
  } catch (err: any) {
    console.error(
      "❌ Clio token exchange failed",
      err?.response?.data || err.message
    );
    res.status(500).send("❌ Clio OAuth failed.");
  }
};
