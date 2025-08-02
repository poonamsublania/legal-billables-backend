import express from "express";
import { logBillable } from "../controllers/billingController";

const router = express.Router();
router.post("/log", logBillable);

export default router;
