"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestAddonEmailEntry = exports.saveAddonEmailEntry = void 0;
const addonEmailEntry_1 = __importDefault(require("../models/addonEmailEntry"));
/**
 * POST /api/addon/save
 */
const saveAddonEmailEntry = async (req, res) => {
    try {
        console.log("📨 ADDON SAVE BODY:", req.body);
        const entry = await addonEmailEntry_1.default.create({
            subject: req.body.subject,
            clientEmail: req.body.clientEmail,
            date: req.body.date,
            trackedTime: req.body.trackedTime,
            summary: req.body.summary, // 🔥 IMPORTANT
            status: "Pending",
        });
        return res.json({ success: true, data: entry });
    }
    catch (err) {
        console.error("❌ Addon save error:", err);
        return res.status(500).json({ success: false });
    }
};
exports.saveAddonEmailEntry = saveAddonEmailEntry;
/**
 * GET /api/addon/latest
 */
const getLatestAddonEmailEntry = async (_req, res) => {
    try {
        const latest = await addonEmailEntry_1.default
            .findOne()
            .sort({ createdAt: -1 })
            .lean();
        if (!latest) {
            return res.json({ success: false });
        }
        return res.json({
            success: true,
            data: latest,
        });
    }
    catch (err) {
        console.error("❌ Addon latest error:", err);
        return res.status(500).json({ success: false });
    }
};
exports.getLatestAddonEmailEntry = getLatestAddonEmailEntry;
