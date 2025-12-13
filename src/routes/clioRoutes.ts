// src/routes/clioRoutes.ts
import express from "express";
import {
  clioLogin,
  clioCallback,
  saveOrUpdateClioToken,
  getClioToken,
} from "../controllers/clioController";

const router = express.Router();

/**
 * Step 1 – Redirect user to Clio OAuth login
 * URL: /auth/clio/login
 */
router.get("/auth/clio/login", clioLogin);

/**
 * Step 2 – Handle OAuth callback
 * URL inside Clio Developer Portal:
 * http://127.0.0.1:5000/auth/clio/callback
 */
router.get("/auth/clio/callback", clioCallback);

/**
 * Manual token save (only for testing)
 * URL: /clio/save-token
 */
router.post("/clio/save-token", async (req, res) => {
  try {
    const { access_token, refresh_token, expires_in } = req.body;

    if (!access_token || !refresh_token || !expires_in) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const saved = await saveOrUpdateClioToken({
      access_token,
      refresh_token,
      expires_in,
    });

    res.json({ success: true, saved });
  } catch (err: any) {
    console.error("❌ Failed to save token:", err.message);
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get stored token
 * URL: /clio/token
 */
router.get("/clio/token", getClioToken);

export default router;
