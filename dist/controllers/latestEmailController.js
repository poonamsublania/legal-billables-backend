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
        const latest = await emailEntry_1.default.findOne().sort({ _id: -1 });
        if (!latest) {
            return res.status(404).json({
                success: false,
                message: "No email entries found",
            });
        }
        res.json({
            success: true,
            data: latest,
        });
    }
    catch (error) {
        console.error("❌ Error fetching latest email entry:", error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
exports.getLatestEmailEntry = getLatestEmailEntry;
