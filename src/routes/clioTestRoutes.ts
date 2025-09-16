// src/routes/clioTestRoutes.ts
import express, { Request, Response } from "express";
import { getStoredTokens } from "../utils/tokenStore";
import { createClioTimeEntry } from "../config/createClioTimeEntry";

const router = express.Router();

// Test route to create a Clio time entry
router.post("/clio/test-entry", async (req: Request, res: Response) => {
  try {
    const tokens = getStoredTokens();
    if (!tokens?.access_token) {
      return res.status(401).json({ error: "No access token found" });
    }

    const result = await createClioTimeEntry(tokens.access_token, {
      description: "Test entry from clioTestRoutes.ts",
      duration: 60, // 1 hour
      matter_id: process.env.TEST_MATTER_ID || "your-matter-id",
    });

    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error("❌ Error creating Clio time entry:", error.response?.data || error.message);
    res.status(500).json({ error: error.message });
  }
});

export default router;
