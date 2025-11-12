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
const formatDate = (date = new Date()) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};
// Format tracked time into "Xs" or "Xm Ys"
const formatTrackedTime = (seconds) => {
    if (seconds < 60)
        return `${seconds}s`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
};
// =====================================================
// 📩 SECTION 1: EMAIL ENTRIES (Dashboard logging)
// =====================================================
const createEmailEntry = async (req, res) => {
    try {
        const { subject, clientEmail, trackedTimeInSeconds } = req.body;
        if (!subject || subject.trim() === "") {
            return res
                .status(400)
                .json({ success: false, message: "Subject is required" });
        }
        const formattedDate = formatDate();
        const trackedTime = trackedTimeInSeconds
            ? formatTrackedTime(trackedTimeInSeconds)
            : "0s";
        const newEntry = new emailEntry_1.default({
            subject,
            clientEmail: clientEmail || "Unknown Client",
            date: formattedDate,
            trackedTime,
            status: "Pending",
        });
        await newEntry.save();
        console.log("✅ EmailEntry saved:", newEntry);
        res.status(201).json({ success: true, entry: newEntry });
    }
    catch (error) {
        console.error("❌ Error saving EmailEntry:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createEmailEntry = createEmailEntry;
const getAllEmailEntries = async (_req, res) => {
    try {
        const entries = await emailEntry_1.default.find().sort({ _id: -1 });
        console.log("📨 Fetched Email Entries:", entries.length);
        res.json(entries);
    }
    catch (error) {
        console.error("❌ Error fetching EmailEntries:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllEmailEntries = getAllEmailEntries;
// =====================================================
// 📧 SECTION 2: ACTUAL EMAILS (Backend storage)
// =====================================================
const saveEmail = async (req, res) => {
    try {
        const { subject, clientEmail, trackedTimeInSeconds } = req.body;
        if (!subject || subject.trim() === "") {
            return res
                .status(400)
                .json({ success: false, message: "Subject is required" });
        }
        const formattedDate = formatDate();
        const trackedTime = trackedTimeInSeconds
            ? formatTrackedTime(trackedTimeInSeconds)
            : "0s";
        const email = new email_1.default({
            subject,
            clientEmail: clientEmail || "Unknown Client",
            date: formattedDate,
            trackedTime,
        });
        await email.save();
        console.log("📨 Saved Email:", email);
        res.status(201).json({ success: true, email });
    }
    catch (error) {
        console.error("❌ Error saving email:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.saveEmail = saveEmail;
const getAllEmails = async (_req, res) => {
    try {
        const emails = await email_1.default.find().sort({ date: -1 });
        console.log("📤 Fetched Emails:", emails.length);
        res.json({ success: true, emails });
    }
    catch (error) {
        console.error("❌ Error fetching emails:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllEmails = getAllEmails;
// =====================================================
// 🤖 SECTION 3: GPT EMAIL GENERATION
// =====================================================
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
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getGeneratedEmail = getGeneratedEmail;
