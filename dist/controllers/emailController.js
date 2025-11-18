"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeneratedEmail = exports.getAllEmails = exports.saveEmail = exports.getAllEmailEntries = exports.createEmailEntry = void 0;
const emailEntry_1 = __importDefault(require("../models/emailEntry")); // Dashboard entries
const email_1 = __importDefault(require("../models/email")); // Actual emails storage
const openaiService_1 = require("../services/openaiService");
// =====================================================
// 🕓 HELPER FUNCTIONS
// =====================================================
// Format date to "DD/MM/YYYY"
const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`; // e.g., 10/11/2025
};
// Format tracked time into "Xs" or "Xm Ys"
const formatTime = (seconds) => {
    if (seconds < 60)
        return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};
// =====================================================
// 📩 SECTION 1: EMAIL ENTRIES (Dashboard logging)
// =====================================================
// 📨 Create a new EmailEntry
const createEmailEntry = async (req, res) => {
    try {
        const { subject, clientEmail, date, trackedTime, status } = req.body;
        if (!subject || subject.trim() === "") {
            return res
                .status(400)
                .json({ success: false, message: "Subject is required" });
        }
        const formattedDate = formatDate(date || new Date());
        const formattedTime = typeof trackedTime === "number"
            ? formatTime(trackedTime)
            : trackedTime || "0s";
        const newEntry = new emailEntry_1.default({
            subject,
            clientEmail: clientEmail || "Unknown Client",
            date: formattedDate,
            trackedTime: formattedTime,
            status: status === "Pushed" ? "Pushed" : "Pending",
        });
        await newEntry.save();
        console.log("✅ EmailEntry saved:", newEntry);
        res
            .status(201)
            .json({ success: true, message: "EmailEntry saved", entry: newEntry });
    }
    catch (error) {
        console.error("❌ Error saving EmailEntry:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error", error: error.message });
    }
};
exports.createEmailEntry = createEmailEntry;
// 📋 Get all EmailEntries
const getAllEmailEntries = async (_req, res) => {
    try {
        const entries = await emailEntry_1.default.find().sort({ _id: -1 });
        console.log("📨 Fetched Email Entries:", entries.length);
        res.json(entries);
    }
    catch (error) {
        console.error("❌ Error fetching EmailEntries:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error", error: error.message });
    }
};
exports.getAllEmailEntries = getAllEmailEntries;
// =====================================================
// 📧 SECTION 2: ACTUAL EMAILS (Backend storage)
// =====================================================
// 💾 Save a new email
const saveEmail = async (req, res) => {
    try {
        const { subject, clientEmail, date, trackedTime } = req.body;
        if (!subject || subject.trim() === "") {
            return res
                .status(400)
                .json({ success: false, message: "Subject is required" });
        }
        const formattedDate = formatDate(date || new Date());
        const formattedTime = typeof trackedTime === "number"
            ? formatTime(trackedTime)
            : trackedTime || "0s";
        const email = new email_1.default({
            subject,
            clientEmail: clientEmail || "Unknown Client",
            date: formattedDate,
            trackedTime: formattedTime,
        });
        await email.save();
        console.log("📨 Saved Email:", email);
        res.status(201).json({ success: true, email });
    }
    catch (error) {
        console.error("❌ Error saving email:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error", error: error.message });
    }
};
exports.saveEmail = saveEmail;
// 📬 Get all emails
const getAllEmails = async (_req, res) => {
    try {
        const emails = await email_1.default.find().sort({ date: -1 });
        console.log("📤 Fetched Emails:", emails.length);
        res.json({ success: true, emails });
    }
    catch (error) {
        console.error("❌ Error fetching emails:", error);
        res
            .status(500)
            .json({ success: false, message: "Server error", error: error.message });
    }
};
exports.getAllEmails = getAllEmails;
// =====================================================
// 🤖 SECTION 3: GPT EMAIL GENERATION
// =====================================================
// Generate GPT-based email
const getGeneratedEmail = async (req, res) => {
    try {
        const { prompt, thread } = req.body;
        if (!prompt || prompt.trim() === "") {
            return res
                .status(400)
                .json({ success: false, message: "Prompt is required" });
        }
        const safeThread = thread && thread.trim() !== ""
            ? thread
            : "No prior email context provided.";
        const email = await (0, openaiService_1.generateGPTEmail)(prompt, safeThread);
        console.log("🤖 GPT email generated:", email);
        res.json({ success: true, email });
    }
    catch (error) {
        console.error("❌ GPT Email Generation Error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate GPT email",
            error: error.message,
        });
    }
};
exports.getGeneratedEmail = getGeneratedEmail;
