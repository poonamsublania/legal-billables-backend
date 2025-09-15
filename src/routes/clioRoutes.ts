import { Router } from "express";// your controller
import { requireAuth } from "../middlewares/authMiddleware"; // correct middleware name
import { createTimeEntry } from "../controllers/billingController"

const router = Router();

router.post("/time-entry", requireAuth, createTimeEntry);

export default router;
