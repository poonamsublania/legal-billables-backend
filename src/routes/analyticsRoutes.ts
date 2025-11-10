import express from "express";
import { getAnalyticsData } from "../controllers/analyticsController";

const router = express.Router();

router.get("/analytics", getAnalyticsData);

export default router;
