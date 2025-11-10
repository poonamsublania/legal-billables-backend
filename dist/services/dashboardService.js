"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardData = void 0;
const Billable_1 = __importDefault(require("../models/Billable"));
const Client_1 = __importDefault(require("../models/Client"));
const Draft_1 = __importDefault(require("../models/Draft"));
const getDashboardData = async () => {
    const billables = await Billable_1.default.find().sort({ date: -1 });
    const clients = await Client_1.default.find();
    const drafts = await Draft_1.default.find().sort({ createdAt: -1 });
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weeklyBillables = billables.filter(b => b.date > weekAgo);
    const totalHours = billables.reduce((sum, b) => sum + b.duration / 3600, 0);
    return {
        billables,
        clients,
        drafts,
        weeklyBillables,
        totalHours,
    };
};
exports.getDashboardData = getDashboardData;
