// src/routes/authRoutes.ts
import { Router } from "express";
import { redirectToClioLogin, handleClioCallback } from "../controllers/authController";

const router = Router();

// Step 1: Start OAuth
router.get("/clio/login", redirectToClioLogin);

// Step 2: Handle callback
router.get("/clio/callback", handleClioCallback);

export default router;
