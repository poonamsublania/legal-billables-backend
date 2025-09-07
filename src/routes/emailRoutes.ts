// src/routes/emailRoutes.ts
import { Router } from "express";
import { getGeneratedEmail } from "../controllers/emailController";

const router = Router();

router.post("/email", getGeneratedEmail);

export default router;
