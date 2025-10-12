// src/routes/billingRoutes.ts
import { Router } from "express";
import { createTimeEntry } from "../controllers/billingController";

const router = Router();

// Create a new billing time entry
router.post("/time-entry", createTimeEntry);

// Health ping
router.get("/ping", (_req, res) => {
  res.json({ message: "Billing service is alive 🚀" });
});

export default router;
