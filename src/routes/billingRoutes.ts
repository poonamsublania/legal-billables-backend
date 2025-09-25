import { Router } from "express";
import { logBillable } from "../controllers/billingController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = Router();

// Make sure this exists
router.post("/log-billable", requireAuth, logBillable);

export default router;

