import express from "express";
import {
  createManualEntry,
  getManualEntries,
  deleteManualEntry,
} from "../controllers/manualController";

const router = express.Router();

// ✅ Create manual entry
router.post("/", createManualEntry);

// ✅ Get all entries
router.get("/", getManualEntries);

// ✅ Delete manual entry
router.delete("/:id", deleteManualEntry);

export default router;
