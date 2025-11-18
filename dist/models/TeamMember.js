"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMember = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const teamSchema = new mongoose_1.default.Schema({
    name: String,
    role: String,
    email: String,
    activeCases: { type: Number, default: 0 },
    hoursLogged: { type: Number, default: 0 },
    revenueGenerated: { type: Number, default: 0 }
});
exports.TeamMember = mongoose_1.default.model("TeamMember", teamSchema);
