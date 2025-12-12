"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeeklyLegalReports = exports.generateWeeklyLegalReport = exports.getWeeklySummaries = exports.saveWeeklySummary = void 0;
const weeklySummary_1 = __importDefault(require("../models/weeklySummary"));
const openai_1 = require("../config/openai"); // Your existing OpenAI config
/**
 * ------------------------------------------------------
 *  SAVE DAILY / GPT-GENERATED SUMMARY  (NO CHANGES)
 * ------------------------------------------------------
 */
const saveWeeklySummary = async (req, res) => {
    try {
        const { clientEmail, summary, subject } = req.body;
        if (!clientEmail || !summary) {
            res.status(400).json({ success: false, error: "Missing clientEmail or summary" });
            return;
        }
        const now = new Date();
        const dayNum = String(now.getDate()).padStart(2, "0");
        const monthNum = String(now.getMonth() + 1).padStart(2, "0");
        const yearNum = now.getFullYear();
        const date = `${dayNum}-${monthNum}-${yearNum}`;
        const day = now.toLocaleDateString("en-US", { weekday: "long" });
        const newSummary = new weeklySummary_1.default({
            clientEmail,
            summary,
            subject,
            date,
            day,
            createdAt: now,
        });
        await newSummary.save();
        res.status(201).json({
            success: true,
            message: "Summary saved successfully!",
            summary: newSummary,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Failed to save summary" });
    }
};
exports.saveWeeklySummary = saveWeeklySummary;
/**
 * ------------------------------------------------------
 *  GET DAILY / GPT SUMMARIES (NO CHANGES)
 * ------------------------------------------------------
 */
const getWeeklySummaries = async (req, res) => {
    try {
        const summaries = await weeklySummary_1.default.find().sort({ createdAt: -1 });
        if (!summaries.length) {
            res.json({ success: true, grouped: {} });
            return;
        }
        const grouped = {};
        summaries.forEach((entry) => {
            const key = `${entry.date} (${entry.day})`;
            if (!grouped[key])
                grouped[key] = [];
            grouped[key].push(entry);
        });
        res.json({ success: true, grouped });
    }
    catch (error) {
        res.status(500).json({ success: false, error: "Failed to fetch summaries" });
    }
};
exports.getWeeklySummaries = getWeeklySummaries;
/**
 * ------------------------------------------------------
 *  NEW: GENERATE WEEKLY LEGAL SUMMARY REPORT (PROFESSIONAL)
 * ------------------------------------------------------
 */
const generateWeeklyLegalReport = async (req, res) => {
    try {
        const { startDate, endDate, hourlyRate = 150 } = req.body;
        if (!startDate || !endDate) {
            res.status(400).json({ error: "startDate and endDate required" });
            return;
        }
        // Fetch entries from your weeklySummary collection
        const entries = await weeklySummary_1.default.find({
            createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
        });
        if (!entries.length) {
            res.status(404).json({ error: "No summaries found for the given date range" });
            return;
        }
        // Prepare text for GPT
        const entriesText = entries
            .map((e) => `Client: ${e.clientEmail}\nSubject: ${e.subject}\nSummary: ${e.summary}\nDate: ${e.date} (${e.day})`)
            .join("\n\n");
        const prompt = `
You are a senior legal billing analyst.  
Create a highly professional Weekly Legal Summary Report.

Required Sections:

📅 Weekly Summary Report (${startDate} — ${endDate})

🧠 Key Legal Themes This Week  
👥 Clients Covered  
💼 Matters Worked On  
📌 Major Work Completed  
⏳ Total Time & Revenue (Assume each summary = 1 hour unless specified)  
📉 Productivity Insights  
📄 Follow-Up Actions for Next Week  
💼 Client-by-Client Breakdown  

Entries:\n\n${entriesText}
    `;
        // Call GPT
        const response = await openai_1.openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.4,
        });
        const report = response.choices[0]?.message?.content || "No report generated.";
        res.status(200).json({
            success: true,
            report,
            entriesCount: entries.length,
        });
    }
    catch (error) {
        console.error("Error generating weekly report:", error);
        res.status(500).json({ error: "Failed to generate weekly report" });
    }
};
exports.generateWeeklyLegalReport = generateWeeklyLegalReport;
/**
 * ------------------------------------------------------
 *  NEW: GET ALL GENERATED WEEKLY REPORTS (If you save them)
 * ------------------------------------------------------
 */
const getWeeklyLegalReports = async (req, res) => {
    try {
        const reports = await weeklySummary_1.default.find().sort({ createdAt: -1 });
        res.json({ success: true, reports });
    }
    catch (err) {
        res.status(500).json({ error: "Failed to fetch weekly reports" });
    }
};
exports.getWeeklyLegalReports = getWeeklyLegalReports;
