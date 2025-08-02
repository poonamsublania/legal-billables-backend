// src/controllers/authController.ts
import { Request, Response } from 'express';
import axios from 'axios';

export const redirectToClioLogin = (req: Request, res: Response) => {
  const authURL = `https://app.clio.com/oauth/authorize?response_type=code&client_id=${process.env.CLIO_CLIENT_ID}&redirect_uri=${process.env.CLIO_REDIRECT_URI}&scope=read%20write`;

  res.redirect(authURL);
};

export const handleClioCallback = async (req: Request, res: Response) => {
  const code = req.query.code as string;

  try {
    const tokenResponse = await axios.post('https://app.clio.com/oauth/token', {
      grant_type: 'authorization_code',
      client_id: process.env.CLIO_CLIENT_ID,
      client_secret: process.env.CLIO_CLIENT_SECRET,
      redirect_uri: process.env.CLIO_REDIRECT_URI,
      code,
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // TODO: Store these tokens in DB/session (based on your auth system)
    console.log("Access Token:", access_token);

    res.send("✅ Clio authorization successful! You may now close this tab.");
  } catch (error: any) {
    console.error("Clio token exchange failed", error?.response?.data || error.message);
    res.status(500).send("❌ Clio OAuth failed.");
  }
};
