"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ManualSchema = new mongoose_1.default.Schema({
    description: { type: String, required: true },
    timeSpent: { type: Number, required: true }, // stored in seconds
    clioMatterId: { type: String },
}, { timestamps: true });
exports.default = mongoose_1.default.model("ManualEntry", ManualSchema);
