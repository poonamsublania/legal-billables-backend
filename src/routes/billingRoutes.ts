import express from "express";
import { createTimeEntry } from "../controllers/billingController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/time-entry", requireAuth, createTimeEntry);

export default router;
