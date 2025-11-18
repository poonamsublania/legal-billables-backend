"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const TeamMember_1 = require("../models/TeamMember");
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI)
    throw new Error("❌ MONGO_URI not defined");
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected for team seeding"))
    .catch(err => console.error(err));
const seed = async () => {
    try {
        // Delete existing team members
        await TeamMember_1.TeamMember.deleteMany({});
        // Insert dummy team members
        await TeamMember_1.TeamMember.insertMany([
            { name: "Alice Johnson", role: "Attorney", email: "alice@example.com", activeCases: 3, hoursLogged: 25, revenueGenerated: 5000 },
            { name: "Bob Smith", role: "Paralegal", email: "bob@example.com", activeCases: 2, hoursLogged: 15, revenueGenerated: 2500 },
            { name: "Charlie Brown", role: "Associate", email: "charlie@example.com", activeCases: 5, hoursLogged: 40, revenueGenerated: 8000 }
        ]);
        console.log("✅ Team members seeded successfully");
        process.exit(0);
    }
    catch (err) {
        console.error("❌ Seeding error:", err);
        process.exit(1);
    }
};
seed();
