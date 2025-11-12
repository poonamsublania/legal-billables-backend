// src/routes/clioRoutes.ts
import express from "express";
import {
  clioAuth,
  clioCallback,
  pushToClio,
  logTimeEntry,
  getClioToken,
} from "../controllers/clioController";
import { requireAuth } from "../middlewares/authMiddleware";

const router = express.Router();

// 🔐 OAuth flow
router.get("/auth", clioAuth);
router.get("/callback", clioCallback);

// 🧾 Push to Clio
router.post("/push-to-clio", pushToClio);

// 🕒 Legacy local routes
router.post("/time-entry", requireAuth, logTimeEntry);
router.get("/token", requireAuth(true), getClioToken);

export default router;
