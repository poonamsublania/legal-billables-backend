// src/routes/clioRoutes.ts
import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { logTimeEntry, getClioToken } from "../controllers/clioController";

const router = Router();

// ✅ Correct relative paths
router.post("/time-entry", logTimeEntry);
router.get("/token", requireAuth(true), getClioToken);

export default router;

