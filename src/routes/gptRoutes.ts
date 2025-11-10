// src/routes/gptRoutes.ts
import express from "express";
import { getSummary, getEmail } from "../controllers/gptController";

const router = express.Router();

router.post("/summary", getSummary);
router.post("/email", getEmail);

export default router;
