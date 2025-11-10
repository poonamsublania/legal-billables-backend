"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/emailRoutes.ts
const express_1 = __importDefault(require("express"));
const emailController_1 = require("../controllers/emailController");
const router = express_1.default.Router();
// --------------------
// 📋 Dashboard / Email Entries
// --------------------
// Get all email entries (for dashboard)
router.get("/entries", emailController_1.getAllEmailEntries);
// Create new email entry (dashboard tracking)
router.post("/entries", emailController_1.createEmailEntry);
// --------------------
// 📧 Actual Emails Storage
// --------------------
// Get all saved emails
router.get("/", emailController_1.getAllEmails);
// Save a new email (actual content)
router.post("/", emailController_1.saveEmail);
// --------------------
// 🤖 GPT Email Generation
// --------------------
// Generate GPT-based email
router.post("/generate", emailController_1.getGeneratedEmail);
exports.default = router;
