import express from "express";
import { getLatestEmailEntry } from "../controllers/latestEmailController";
import { saveAddonEmail } from "../controllers/addonEmailController";

const router = express.Router();

// GET /api/emails/latest
router.get("/latest", getLatestEmailEntry);

// POST /api/emails/addon  ✅ FIXED
router.post("/addon", saveAddonEmail);

export default router;
