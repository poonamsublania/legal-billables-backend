"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Mock "email send" endpoint
let emailEntries = [];
app.post("/api/emails", (req, res) => {
    const { subject, clientEmail, date, trackedTime, status } = req.body;
    const newEmail = {
        id: emailEntries.length + 1,
        subject,
        clientEmail,
        date,
        trackedTime,
        status,
    };
    emailEntries.push(newEmail);
    res.status(201).json(newEmail);
});
// Get all emails
app.get("/api/emails", (req, res) => {
    res.json(emailEntries);
});
const PORT = 5000;
app.listen(PORT, () => console.log(`✅ Backend running on http://localhost:${PORT}`));
