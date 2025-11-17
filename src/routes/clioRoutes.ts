// src/routes/clioRoutes.ts
import express, { Request, Response } from "express";
import {
  saveOrUpdateClioToken,
  getClioToken,
} from "../controllers/clioController";

const router = express.Router();

/**
 * Save token (manual testing only)
 */
router.post("/save-token", async (req: Request, res: Response) => {
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

    return res.json({ success: true, saved });
  } catch (err: any) {
    console.error("❌ Failed to save token:", err.message);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Get stored token
 */
router.get("/token", getClioToken);

export default router;
