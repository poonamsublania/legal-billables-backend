import { Router, Request, Response } from "express";
import ClioToken from "../models/clioToken";

const router = Router();

// Return current stored Clio token
router.get("/token", async (req: Request, res: Response) => {
  try {
    const tokenDoc = await ClioToken.findOne({ _id: "singleton" });
    if (!tokenDoc) return res.status(404).json({ error: "No token found" });

    res.json({ clioAccessToken: tokenDoc.clioAccessToken });
  } catch (err) {
    console.error("Error fetching Clio token:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
