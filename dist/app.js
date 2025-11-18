"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = require("./config/db");
// ----------------------------
// Initialize App
// ----------------------------
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "5000", 10);
// ----------------------------
// CORS
// ----------------------------
app.use((0, cors_1.default)({
    origin: [
        "chrome-extension://moiajblmfageiimmjnplhmpjlnhfnalm",
        "https://mail.google.com",
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:5000",
        "https://legal-billables-backend.onrender.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
// ----------------------------
// Middleware
// ----------------------------
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ----------------------------
// Health Check Routes
// ----------------------------
app.get("/", (_req, res) => {
    res.send("🚀 Legal Billables Backend Running Successfully");
});
app.get("/test", (_req, res) => {
    res.json({ message: "✅ Test route working" });
});
// ----------------------------
// Import Routes
// ----------------------------
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const gptRoutes_1 = __importDefault(require("./routes/gptRoutes"));
const clioRoutes_1 = __importDefault(require("./routes/clioRoutes"));
const billingRoutes_1 = __importDefault(require("./routes/billingRoutes")); // ✅ new file
const mockClioRoutes_1 = __importDefault(require("./routes/mockClioRoutes"));
const clientsRoutes_1 = __importDefault(require("./routes/clientsRoutes"));
const emailRoutes_1 = __importDefault(require("./routes/emailRoutes"));
const weeklySummaryRoutes_1 = __importDefault(require("./routes/weeklySummaryRoutes"));
const manualRoutes_1 = __importDefault(require("./routes/manualRoutes"));
const caseRoutes_1 = __importDefault(require("./routes/caseRoutes"));
const teamRoutes_1 = __importDefault(require("./routes/teamRoutes"));
// ----------------------------
// Load Routes
// ----------------------------
app.use("/api/auth", authRoutes_1.default);
app.use("/api/gpt", gptRoutes_1.default);
app.use("/api/clio", clioRoutes_1.default);
app.use("/api/billing", billingRoutes_1.default); // ⭐ Add real time entry route
app.use("/api/mock-clio", mockClioRoutes_1.default);
app.use("/api/clients", clientsRoutes_1.default);
app.use("/api/emails", emailRoutes_1.default);
app.use("/api/weekly-summary", weeklySummaryRoutes_1.default);
app.use("/api/manual", manualRoutes_1.default);
app.use("/api/cases", caseRoutes_1.default);
app.use("/api/team", teamRoutes_1.default);
console.log("✅ Mounted routes:", [
    "/api/auth",
    "/api/gpt",
    "/api/clio",
    "/api/billing",
    "/api/mock-clio",
    "/api/clients",
    "/api/emails",
    "/api/weekly-summary",
    "/api/manual",
    "/api/cases",
    "/api/team",
]);
// ----------------------------
// 404 Handler
// ----------------------------
app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
});
// ----------------------------
// Connect DB THEN start server
// ----------------------------
(async () => {
    try {
        console.log("⏳ Connecting to MongoDB...");
        await (0, db_1.connectDB)();
        console.log("✅ MongoDB connected!");
        app.listen(PORT, "0.0.0.0", () => {
            console.log(`🔥 Server running on port ${PORT}`);
        });
    }
    catch (err) {
        console.error("❌ Failed to start server:", err);
        process.exit(1);
    }
})();
// ----------------------------
// Optional Frontend Hosting
// ----------------------------
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../../frontend/dist")));
app.get(/.*/, (_req, res) => res.sendFile(path_1.default.resolve(__dirname, "../../frontend/dist/index.html")));
exports.default = app;
