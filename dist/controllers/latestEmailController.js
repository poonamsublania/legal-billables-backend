"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLatestEmailEntry = void 0;
const emailEntry_1 = __importDefault(require("../models/emailEntry"));
/**
 * GET /api/emails/latest
 * Returns the most recent EmailEntry
 */
const getLatestEmailEntry = async (_req, res) => {
    try {
        const latest = await emailEntry_1.default
            .findOne()
            .sort({ _id: -1 })
            .lean();
        if (!latest) {
            return res.status(404).json({
                success: false,
                message: "No email entries found",
            });
        }
        const responsePayload = {
            subject: latest.subject || "",
            trackedTime: latest.trackedTime || "0s",
            summary: typeof latest.summary === "string" &&
                latest.summary.trim().length > 0
                ? latest.summary
                : "",
            clientEmail: latest.clientEmail || "",
            date: latest.date || "",
            status: latest.status || "Pending",
        };
        return res.json({
            success: true,
            data: responsePayload,
        });
    }
    catch (error) {
        console.error("❌ Error fetching latest email entry:", error);
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.getLatestEmailEntry = getLatestEmailEntry;
