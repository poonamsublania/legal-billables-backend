"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ManualSchema = new mongoose_1.default.Schema({
    category: String,
    clientName: String,
    caseName: String,
    description: String,
    duration: String,
    timeSpent: Number,
    date: String,
    createdAt: Date,
});
exports.default = mongoose_1.default.model("Manual", ManualSchema);
