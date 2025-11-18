"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Client_1 = __importDefault(require("../models/Client"));
const Case_1 = __importDefault(require("../models/Case"));
dotenv_1.default.config();
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI)
    throw new Error("❌ MONGO_URI not defined");
mongoose_1.default.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected for seeding"))
    .catch(err => console.error(err));
const seed = async () => {
    try {
        await Client_1.default.deleteMany({});
        await Case_1.default.deleteMany({});
        const clients = await Client_1.default.insertMany([
            { name: "John Doe", email: "john@example.com" },
            { name: "Jane Smith", email: "jane@example.com" },
            { name: "Acme Corp", email: "contact@acme.com" }
        ]);
        await Case_1.default.insertMany([
            { title: "Contract Review", client: "John Doe", status: "Active", assignedTo: "Alice", hoursLogged: 5, revenueGenerated: 500 },
            { title: "Trademark Filing", client: "Jane Smith", status: "Pending", assignedTo: "Bob", hoursLogged: 2, revenueGenerated: 200 },
            { title: "Legal Consultation", client: "Acme Corp", status: "Closed", assignedTo: "Charlie", hoursLogged: 8, revenueGenerated: 800 },
            { title: "M&A Due Diligence", client: "Acme Corp", status: "Active", assignedTo: "David", hoursLogged: 6, revenueGenerated: 600 }
        ]);
        console.log("✅ Dummy data seeded successfully");
        process.exit(0);
    }
    catch (err) {
        console.error("❌ Seeding error:", err);
        process.exit(1);
    }
};
seed();
