import express from "express";
import {
  createManualEntry,
  getManualEntries,
  deleteManualEntry,
} from "../controllers/manualController";

const router = express.Router();

// REST style (THIS IS WHAT YOUR FRONTEND EXPECTS)
router.post("/", createManualEntry);
router.get("/", getManualEntries);
router.delete("/:id", deleteManualEntry);

export default router;
