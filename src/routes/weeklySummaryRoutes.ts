import express from "express";
import {
  saveWeeklySummary,
  getWeeklySummaries,
} from "../controllers/weeklySummaryController";

const router = express.Router();

/**
 * -------------------------------------------
 * 🧠 GPT Weekly Summaries Routes
 * Base Path: /api/weekly-summary
 * -------------------------------------------
 */

// Save a GPT-generated weekly summary
router.post("/", saveWeeklySummary);

// Get all summaries grouped by date
router.get("/", getWeeklySummaries);

export default router;
