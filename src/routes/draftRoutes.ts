import { Router } from "express";
import {
  createDraft,
  getDrafts,
  updateDraft,
  deleteDraft,
  pushDraftToClio,
} from "../controllers/draftsController";

const router = Router();

router.post("/", createDraft);
router.get("/", getDrafts);
router.put("/:id", updateDraft);
router.delete("/:id", deleteDraft);
router.post("/push/:id", pushDraftToClio);

export default router;
