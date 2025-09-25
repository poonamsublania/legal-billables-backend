// src/routes/clioRoutes.ts
import { Router } from "express";
import { requireAuth } from "../middlewares/authMiddleware";
import { logTimeEntry, getClioToken } from "../controllers/clioController";

const router = Router();

// Endpoint to push tracked time and GPT summary to Clio
router.post("/time-entry", requireAuth, logTimeEntry);

// Optional endpoint for frontend to fetch the current stored Clio token
router.get("/token", requireAuth, getClioToken);

export default router;
