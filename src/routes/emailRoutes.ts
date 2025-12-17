import express from "express";
import {
  createEmailEntry,
  getAllEmailEntries,
  deleteEmailEntry,
  updateEmailEntry,
} from "../controllers/emailController";

const router = express.Router();

// DASHBOARD EMAIL ENTRIES
router.get("/", getAllEmailEntries);          // GET all
router.post("/", createEmailEntry);           // ADD
router.put("/:id", updateEmailEntry);          // EDIT
router.delete("/:id", deleteEmailEntry);       // DELETE

export default router;
