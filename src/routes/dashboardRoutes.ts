// src/routes/dashboardRoutes.ts
import express from "express";
import { dashboardHandler } from "../controllers/dashboardController";

const router = express.Router();

// ✅ Single endpoint for dashboard data
router.get("/", dashboardHandler);

export default router;
