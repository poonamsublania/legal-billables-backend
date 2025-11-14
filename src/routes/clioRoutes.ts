import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { logTimeEntry } from "../controllers/clioController";

// ✅ Add this import
import ClioTokenModel from "../models/clioToken";

const router = Router();

// Debug route to view token in MongoDB
router.get("/debug-tokens", async (req, res) => {
  try {
    const tokenDoc = await ClioTokenModel.findOne({ _id: "singleton" });
    res.json(tokenDoc);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch token", details: err });
  }
});

// Clio API routes
router.post("/time-entry", logTimeEntry);

export default router;
