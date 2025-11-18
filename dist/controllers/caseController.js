"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCase = exports.updateCase = exports.createCase = exports.getClientsCases = exports.getSummary = void 0;
const Case_1 = __importDefault(require("../models/Case"));
const Client_1 = __importDefault(require("../models/Client"));
// --------------------
// Get overall summary
// --------------------
const getSummary = async (req, res) => {
    try {
        const totalClients = await Client_1.default.countDocuments();
        const activeCases = await Case_1.default.countDocuments({ status: "Active" });
        const pendingCases = await Case_1.default.countDocuments({ status: "Pending" });
        const closedCases = await Case_1.default.countDocuments({ status: "Closed" });
        const totalHoursAgg = await Case_1.default.aggregate([
            { $group: { _id: null, totalHours: { $sum: "$hoursLogged" } } }
        ]);
        const totalRevenueAgg = await Case_1.default.aggregate([
            { $group: { _id: null, totalRevenue: { $sum: "$revenueGenerated" } } }
        ]);
        res.json({
            totalClients,
            activeCases,
            pendingCases,
            closedCases,
            totalHours: totalHoursAgg[0]?.totalHours || 0,
            totalRevenue: totalRevenueAgg[0]?.totalRevenue || 0,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch summary" });
    }
};
exports.getSummary = getSummary;
// --------------------
// Get all clients with their cases
// --------------------
const getClientsCases = async (req, res) => {
    try {
        const clients = await Client_1.default.find().lean();
        const clientsWithCases = await Promise.all(clients.map(async (client) => {
            const cases = await Case_1.default.find({ client: client.name }).lean();
            return {
                ...client,
                totalCases: cases.length,
                cases,
            };
        }));
        res.json(clientsWithCases);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to fetch clients with cases" });
    }
};
exports.getClientsCases = getClientsCases;
// --------------------
// Create a new case
// --------------------
const createCase = async (req, res) => {
    try {
        const { client: clientName } = req.body;
        // Check if client exists; create if not
        let client = await Client_1.default.findOne({ name: clientName });
        if (!client) {
            client = await Client_1.default.create({
                name: clientName,
                email: `${clientName.toLowerCase().replace(/\s/g, "")}@example.com`,
            });
        }
        const newCase = await Case_1.default.create(req.body);
        res.json(newCase);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create case" });
    }
};
exports.createCase = createCase;
// --------------------
// Update case
// --------------------
const updateCase = async (req, res) => {
    try {
        const updatedCase = await Case_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCase);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to update case" });
    }
};
exports.updateCase = updateCase;
// --------------------
// Delete case
// --------------------
const deleteCase = async (req, res) => {
    try {
        await Case_1.default.findByIdAndDelete(req.params.id);
        res.json({ message: "Case deleted" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete case" });
    }
};
exports.deleteCase = deleteCase;
