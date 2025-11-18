import { Router } from "express";
import { redirectToClioLogin, handleClioCallback } from "../controllers/authController";

const router = Router();

// Step 1: Start OAuth with Clio
router.get("/clio/login", redirectToClioLogin);

// Step 2: Handle Clio callback
router.get("/clio/callback", handleClioCallback);

export default router;
