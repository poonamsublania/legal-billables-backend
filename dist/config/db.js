"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
// src/config/db.ts
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI)
        throw new Error("❌ MONGO_URI not defined in .env");
    try {
        await mongoose_1.default.connect(MONGO_URI);
        console.log("✅ MongoDB connected");
        mongoose_1.default.connection.on("connected", () => console.log("🔹 Mongoose connected"));
        mongoose_1.default.connection.on("error", (err) => console.error("🔹 Mongoose error:", err));
        mongoose_1.default.connection.on("disconnected", () => console.log("🔹 Mongoose disconnected"));
    }
    catch (err) {
        console.error("❌ MongoDB connection failed:", err);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
