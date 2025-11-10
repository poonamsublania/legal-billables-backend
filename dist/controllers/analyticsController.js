"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticsData = void 0;
const Billable_1 = __importDefault(require("../models/Billable"));
const Client_1 = __importDefault(require("../models/Client"));
const Case_1 = __importDefault(require("../models/Case"));
const getAnalyticsData = async (req, res) => {
    try {
        const [billables, clients, cases] = await Promise.all([
            Billable_1.default.find().lean(),
            Client_1.default.find().lean(),
            Case_1.default.find().lean(),
        ]);
        const openCases = cases.filter(c => c.status === "Open").length;
        const onHoldCases = cases.filter(c => c.status === "On Hold").length;
        const closedCases = cases.filter(c => c.status === "Closed").length;
        const draftBills = billables.filter(b => b.status === "Draft").length;
        const sentBills = billables.filter(b => b.status === "Sent").length;
        const partiallyPaid = billables.filter(b => b.status === "Partially Paid").length;
        const overdue = billables.filter(b => b.status === "Overdue").length;
        const totalHours = billables.reduce((sum, b) => sum + (b.duration || 0) / 3600, 0);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const weeklyBillables = billables.filter(b => new Date(b.date) > weekAgo);
        res.json({
            success: true,
            stats: {
                openCases,
                onHoldCases,
                closedCases,
                draftBills,
                sentBills,
                partiallyPaid,
                overdue,
                totalHours,
                weeklyBillables: weeklyBillables.length,
            },
            recentCases: cases.slice(-5),
            outstandingClients: clients.filter(c => (c.outstandingAmount || 0) > 0),
        });
    }
    catch (err) {
        console.error("Error fetching analytics:", err);
        res.status(500).json({ success: false, message: "Error fetching analytics" });
    }
};
exports.getAnalyticsData = getAnalyticsData;
