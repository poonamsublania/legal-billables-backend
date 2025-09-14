import { Router } from "express";
import { logBillable } from "../controllers/billingController"; // your controller
import { requireAuth } from "../middlewares/authMiddleware"; // correct middleware name

const router = Router();

router.post("/log", requireAuth, logBillable);

export default router;
