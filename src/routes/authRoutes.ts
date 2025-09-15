// src/routes/authRoutes.ts
import { Router } from "express";
import { redirectToClioLogin, handleClioCallback } from "../controllers/authController";

const router = Router();

// Step 1: Start OAuth
router.get("/api/auth/clio/login", redirectToClioLogin);

// Step 2: Handle callback
router.get("/api/auth/clio/callback", handleClioCallback);

export default router;
