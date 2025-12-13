// backend/src/routes/emailRoutes.ts
import express from "express";
import {
  createEmailEntry,
  getAllEmailEntries,
  getGeneratedEmail,
  saveEmail,
  getAllEmails,
  getLatestEmail, // ✅ ADD THIS

} from "../controllers/emailController";

const router = express.Router();

// --------------------
// 📋 Dashboard / Email Entries
// --------------------

// Get all email entries (for dashboard)
router.get("/entries", getAllEmailEntries);

// Create new email entry (dashboard tracking)
router.post("/entries", createEmailEntry);

// --------------------
// 📧 Actual Emails Storage
// --------------------

// Get all saved emails
router.get("/", getAllEmails);

// Save a new email (actual content)
router.post("/", saveEmail);

router.get("/latest", getLatestEmail);


// --------------------
// 🤖 GPT Email Generation
// --------------------

// Generate GPT-based email
router.post("/generate", getGeneratedEmail);

export default router;
