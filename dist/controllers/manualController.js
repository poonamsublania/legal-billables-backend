"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteManualEntry = exports.getManualEntries = exports.createManualEntry = void 0;
const manualModel_1 = __importDefault(require("../models/manualModel"));
/**
 * CREATE Manual Entry
 */
const createManualEntry = async (req, res) => {
    try {
        const { description, timeSpent, clioMatterId } = req.body;
        const entry = await manualModel_1.default.create({
            description,
            timeSpent,
            clioMatterId,
            createdAt: new Date(),
        });
        res.status(201).json(entry);
    }
    catch (err) {
        console.error("❌ Error creating manual entry:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.createManualEntry = createManualEntry;
/**
 * GET Manual Entries
 */
const getManualEntries = async (req, res) => {
    try {
        const entries = await manualModel_1.default.find().sort({ createdAt: -1 });
        res.json(entries);
    }
    catch (err) {
        console.error("❌ Error fetching manual entries:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.getManualEntries = getManualEntries;
/**
 * DELETE Manual Entry
 */
const deleteManualEntry = async (req, res) => {
    try {
        const { id } = req.params;
        await manualModel_1.default.findByIdAndDelete(id);
        res.json({ message: "Entry deleted" });
    }
    catch (err) {
        console.error("❌ Error deleting entry:", err);
        res.status(500).json({ error: err.message });
    }
};
exports.deleteManualEntry = deleteManualEntry;
