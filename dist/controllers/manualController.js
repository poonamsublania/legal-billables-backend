"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManualEntry = exports.getManualEntries = exports.createManualEntry = void 0;
const manualEntry_1 = __importDefault(require("../models/manualEntry"));
const createManualEntry = async (req, res) => {
    try {
        const { category, clientName, caseName, description, duration, date } = req.body;
        if (!category || !clientName || !description || !duration) {
            return res.status(400).json({
                success: false,
                message: "category, clientName, description, and duration are required",
            });
        }
        const entry = new manualEntry_1.default({
            category,
            clientName,
            caseName,
            description,
            duration,
            date,
        });
        await entry.save();
        res.status(201).json({ success: true, data: entry });
    }
    catch (error) {
        console.error("Error saving manual entry:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.createManualEntry = createManualEntry;
const getManualEntries = async (req, res) => {
    try {
        const entries = await manualEntry_1.default.find().sort({ date: -1 });
        res.status(200).json({ success: true, data: entries });
    }
    catch (error) {
        console.error("Error fetching manual entries:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.getManualEntries = getManualEntries;
const deleteManualEntry = async (req, res) => {
    try {
        const deleted = await manualEntry_1.default.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ success: false, message: "Entry not found" });
        }
        res.status(200).json({ success: true, message: "Entry deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting manual entry:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
exports.deleteManualEntry = deleteManualEntry;
