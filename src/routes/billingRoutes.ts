// src/routes/billingRoutes.ts
import { Router } from "express";
import { createTimeEntry } from "../controllers/billingController";
import { requireAuth } from "../middlewares/authMiddleware";  // ✅ Correct import

const router = Router();

// 🕒 Log time entry (Requires API Key)
router.post("/time-entry", requireAuth(), createTimeEntry);

export default router;
