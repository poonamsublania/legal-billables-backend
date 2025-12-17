"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const emailController_1 = require("../controllers/emailController");
const emailController_2 = require("../controllers/emailController");
const router = express_1.default.Router();
// =====================================================
// 📋 DASHBOARD EMAIL ENTRIES
// =====================================================
// Get all email entries (dashboard table)
router.get("/entries", emailController_2.getAllEmailEntries);
// Create new email entry (tracking)
router.post("/entries", emailController_2.createEmailEntry);
// =====================================================
// 📧 ACTUAL EMAIL STORAGE
// =====================================================
// Get all saved emails
router.get("/", emailController_2.getAllEmails);
// Save a new email
router.post("/", emailController_2.saveEmail);
// =====================================================
// 🤖 GPT EMAIL GENERATION
// =====================================================
// Generate GPT-based email
router.post("/generate", emailController_2.getGeneratedEmail);
router.delete("/:id", emailController_1.deleteEmailEntry);
exports.default = router;
