"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/models/Case.ts
const mongoose_1 = __importDefault(require("mongoose"));
const CaseSchema = new mongoose_1.default.Schema({
    title: String,
    client: String,
    status: String,
    assignedTo: String,
    hoursLogged: Number,
    revenueGenerated: Number,
});
// ✅ Export model + interface
exports.default = mongoose_1.default.model("Case", CaseSchema);
