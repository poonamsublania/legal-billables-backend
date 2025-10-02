// src/routes/billingRoutes.ts
import express from "express";
import { createTimeEntry } from "../controllers/billingController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = express.Router();

// Health check /ping route
router.get("/ping", (req, res) => {
  res.json({ message: "Billing service is alive 🚀" });
});

// Protected route
router.post("/time-entry", requireAuth, createTimeEntry);

export default router;

console.log("Billing routes loaded");
