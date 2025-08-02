"use strict";
// backend/src/config/db.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectToDB = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load .env variables
dotenv_1.default.config();
const connectToDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            console.error("❌ MONGO_URI not found in environment variables.");
            process.exit(1);
        }
        await mongoose_1.default.connect(mongoURI);
        console.log("✅ MongoDB connected successfully.");
    }
    catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};
exports.connectToDB = connectToDB;
