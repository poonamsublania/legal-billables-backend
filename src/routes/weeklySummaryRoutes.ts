import express from "express";
import {
  saveWeeklySummary,
  getWeeklySummaries,
  deleteWeeklySummary,
} from "../controllers/weeklySummaryController";

const router = express.Router();

router.post("/", saveWeeklySummary);
router.get("/", getWeeklySummaries);
router.delete("/:id", deleteWeeklySummary);

export default router;
