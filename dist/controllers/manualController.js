"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManualEntry = exports.getManualEntries = exports.createManualEntry = void 0;
const manualModel_1 = __importDefault(require("../models/manualModel"));
const createManualEntry = async (req, res) => {
    try {
        const { category, clientName, caseName, description, duration, date, timeSpent, } = req.body;
        const entry = await manualModel_1.default.create({
            category,
            clientName,
            caseName,
            description,
            duration,
            date,
            timeSpent,
            createdAt: new Date(),
        });
        res.status(201).json({ success: true, entry });
    }
    catch (err) {
        console.error("❌ Error creating manual entry:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.createManualEntry = createManualEntry;
const getManualEntries = async (_req, res) => {
    try {
        const entries = await manualModel_1.default.find().sort({ createdAt: -1 });
        res.json({ success: true, data: entries });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.getManualEntries = getManualEntries;
const deleteManualEntry = async (req, res) => {
    try {
        await manualModel_1.default.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};
exports.deleteManualEntry = deleteManualEntry;
