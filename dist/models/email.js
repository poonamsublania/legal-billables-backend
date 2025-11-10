"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const emailSchema = new mongoose_1.default.Schema({
    subject: String,
    clientEmail: String,
    date: String,
    trackedTime: String,
    status: { type: String, default: "Pending" },
});
exports.default = mongoose_1.default.model("Email", emailSchema);
