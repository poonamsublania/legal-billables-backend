"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveAddonEmail = void 0;
const emailEntry_1 = __importDefault(require("../models/emailEntry"));
/**
 * POST /api/emails/addon
 * Always creates a NEW entry (never update)
 */
const saveAddonEmail = async (req, res) => {
    try {
        const entry = new emailEntry_1.default({
            ...req.body,
            createdAt: new Date(),
        });
        await entry.save();
        return res.json({
            success: true,
            data: entry,
        });
    }
    catch (err) {
        console.error("❌ Add-on save failed:", err);
        return res.status(500).json({
            success: false,
            message: "Add-on save failed",
        });
    }
};
exports.saveAddonEmail = saveAddonEmail;
