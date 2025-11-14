// src/routes/clioRoutes.ts
import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { logTimeEntry } from "../controllers/clioController";

const router = Router();

// Create time entry
router.post("/time-entry", logTimeEntry);

// ❌ REMOVE THIS LINE (getClioToken does NOT exist)
// router.get("/token", requireAuth(true), getClioToken);

export default router;
