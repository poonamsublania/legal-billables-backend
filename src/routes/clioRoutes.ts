import { Router } from "express";
import { logTimeEntry } from "../controllers/clioController";

const router = Router();

router.post("/log", logTimeEntry);

export default router;
