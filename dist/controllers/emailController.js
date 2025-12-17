"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGeneratedEmail = exports.getAllEmails = exports.saveEmail = exports.getLatestEmailEntry = exports.deleteEmailEntry = exports.updateEmailEntry = exports.getAllEmailEntries = exports.createEmailEntry = void 0;
const emailEntry_1 = __importDefault(require("../models/emailEntry")); // Dashboard entries
const email_1 = __importDefault(require("../models/email")); // Actual emails storage
const openaiService_1 = require("../services/openaiService");
// =====================================================
// 🕓 HELPER FUNCTIONS
// =====================================================
// Format date to ISO (SAFE for frontend)
// Format date → DD/MM/YYYY (SAFE + CONSISTENT)
const normalizeDate = (date) => {
    const d = date ? new Date(date) : new Date();
    if (isNaN(d.getTime()))
        return "";
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};
// =====================================================
// 🕓 HELPERS
// =====================================================
// Date → DD/MM/YYYY
const formatDate = (input) => {
    const d = input ? new Date(input) : new Date();
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};
// Seconds → 10s | 2m | 2m 10s
const formatTime = (value) => {
    if (!value)
        return "0s";
    if (typeof value === "string")
        return value;
    if (value < 60)
        return `${value}s`;
    const m = Math.floor(value / 60);
    const s = value % 60;
    return s ? `${m}m ${s}s` : `${m}m`;
};
// =====================================================
// 📩 SECTION 1: EMAIL ENTRIES (Dashboard)
// =====================================================
// ➕ Create Email Entry
const createEmailEntry = async (req, res) => {
    try {
        const { subject, clientEmail, date, trackedTime, status } = req.body;
        if (!subject || !subject.trim()) {
            return res.status(400).json({ success: false, message: "Subject required" });
        }
        const entry = new emailEntry_1.default({
            subject,
            clientEmail: clientEmail || "Unknown Client",
            date: normalizeDate(date),
            trackedTime: typeof trackedTime === "number"
                ? formatTime(trackedTime)
                : trackedTime || "0s",
            status: status === "Pushed" ? "Pushed" : "Pending",
        });
        await entry.save();
        res.status(201).json({
            success: true,
            entry,
        });
    }
    catch (error) {
        console.error("❌ createEmailEntry:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createEmailEntry = createEmailEntry;
// 📋 Get all Email Entries
const getAllEmailEntries = async (_req, res) => {
    try {
        const entries = await emailEntry_1.default.find().sort({ date: -1 });
        res.json({ success: true, entries });
    }
    catch (error) {
        console.error("❌ getAllEmailEntries:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllEmailEntries = getAllEmailEntries;
// ✏️ Update Email Entry
const updateEmailEntry = async (req, res) => {
    try {
        const updated = await emailEntry_1.default.findByIdAndUpdate(req.params.id, { ...req.body, date: normalizeDate(req.body.date) }, { new: true });
        if (!updated) {
            return res.status(404).json({ success: false, message: "Entry not found" });
        }
        res.json({ success: true, entry: updated });
    }
    catch (error) {
        console.error("❌ updateEmailEntry:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateEmailEntry = updateEmailEntry;
// =====================================================
// ❌ DELETE EMAIL ENTRY
// =====================================================
const deleteEmailEntry = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await emailEntry_1.default.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Not found" });
        }
        res.json({ success: true });
    }
    catch (err) {
        console.error("deleteEmailEntry error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.deleteEmailEntry = deleteEmailEntry;
// 🆕 Get Latest Email Entry (Gmail Add-on / Extension)
const getLatestEmailEntry = async (_req, res) => {
    try {
        const latest = await emailEntry_1.default.findOne().sort({ date: -1 });
        if (!latest) {
            return res.status(404).json({ success: false, message: "No entries found" });
        }
        res.json({ success: true, entry: latest });
    }
    catch (error) {
        console.error("❌ getLatestEmailEntry:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getLatestEmailEntry = getLatestEmailEntry;
// =====================================================
// 📧 SECTION 2: ACTUAL EMAIL STORAGE
// =====================================================
// ➕ Save Email
const saveEmail = async (req, res) => {
    try {
        const { subject, clientEmail, date, trackedTime } = req.body;
        const email = new email_1.default({
            subject,
            clientEmail: clientEmail || "Unknown Client",
            date: normalizeDate(date),
            trackedTime: typeof trackedTime === "number"
                ? formatTime(trackedTime)
                : trackedTime || "0s",
        });
        await email.save();
        res.status(201).json({ success: true, email });
    }
    catch (error) {
        console.error("❌ saveEmail:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.saveEmail = saveEmail;
// 📬 Get All Emails
const getAllEmails = async (_req, res) => {
    try {
        const emails = await email_1.default.find().sort({ date: -1 });
        res.json({ success: true, emails });
    }
    catch (error) {
        console.error("❌ getAllEmails:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getAllEmails = getAllEmails;
// =====================================================
// 🤖 GPT EMAIL GENERATION
// =====================================================
const getGeneratedEmail = async (req, res) => {
    try {
        const { prompt, thread } = req.body;
        if (!prompt || !prompt.trim()) {
            return res.status(400).json({ success: false, message: "Prompt required" });
        }
        const email = await (0, openaiService_1.generateGPTEmail)(prompt, thread || "No previous context");
        res.json({ success: true, email });
    }
    catch (error) {
        console.error("❌ GPT error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getGeneratedEmail = getGeneratedEmail;
