"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
    throw new Error("❌ MONGO_URI not defined in .env");
}
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch(err => console.error("❌ MongoDB connection error:", err));
mongoose_1.default.connection.on("connected", () => console.log("🔹 Mongoose connected to DB"));
mongoose_1.default.connection.on("error", err => console.error("🔹 Mongoose connection error:", err));
mongoose_1.default.connection.on("disconnected", () => console.log("🔹 Mongoose disconnected"));
