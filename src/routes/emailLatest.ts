import express from "express";
import { getLatestEmailEntry } from "../controllers/latestEmailController";

const router = express.Router();

// GET /api/emails/latest
router.get("/latest", getLatestEmailEntry);

export default router;
