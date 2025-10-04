// src/routes/billingRoutes.ts
import express from "express";
import { createTimeEntry, pingBillingService } from "../controllers/billingController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = express.Router();
router.get("/ping", pingBillingService);

router.post("/time-entry", requireAuth, createTimeEntry);

export default router;

console.log("Billing routes loaded");
