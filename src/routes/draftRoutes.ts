import express from "express";
import { createDraft, getDrafts, pushDraftToClio } from "../controllers/draftController";

const router = express.Router();

router.post("/", createDraft);
router.get("/", getDrafts);
router.post("/:draftId/push", pushDraftToClio);

export default router;
