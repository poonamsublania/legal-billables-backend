import express from "express";
import {
  saveWeeklySummary,
  getWeeklySummaries,
} from "../controllers/weeklySummaryController";

const router = express.Router();

// --------------------
// 🧠 GPT Weekly Summaries
// --------------------

// ✅ Save a GPT-generated summary
router.post("/", saveWeeklySummary);

// ✅ Fetch all summaries grouped by date
router.get("/", getWeeklySummaries);

export default router;
