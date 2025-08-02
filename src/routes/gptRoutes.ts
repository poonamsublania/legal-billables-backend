import express from "express";
import { getBillableSummary } from "../controllers/gptController";
const router = express.Router();
router.post("/summary", getBillableSummary);

export default router;
