import { Router } from "express";
import { getBillableSummary } from "../controllers/gptController";
import { getGeneratedEmail } from "../controllers/emailController";

const router = Router();

router.post("/summary", getBillableSummary);
router.post("/email", getGeneratedEmail); // ✅ directly here

export default router;
