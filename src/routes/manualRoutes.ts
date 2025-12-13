import express from "express";
import {
  createManualEntry,
  getManualEntries,
  deleteManualEntry,
} from "../controllers/manualController";

const router = express.Router();

// POST /manual/create
router.post("/create", createManualEntry);

// GET /manual/all
router.get("/all", getManualEntries);

// DELETE /manual/:id
router.delete("/:id", deleteManualEntry);

export default router;
