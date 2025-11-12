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
require("./config/db");
// ----------------------------
// ✅ Route Imports
// ----------------------------
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const gptRoutes_1 = __importDefault(require("./routes/gptRoutes"));
const clioRoutes_1 = __importDefault(require("./routes/clioRoutes"));
const mockClioRoutes_1 = __importDefault(require("./routes/mockClioRoutes"));
const clientsRoutes_1 = __importDefault(require("./routes/clientsRoutes"));
const emailRoutes_1 = __importDefault(require("./routes/emailRoutes"));
const weeklySummaryRoutes_1 = __importDefault(require("./routes/weeklySummaryRoutes"));
const manualRoutes_1 = __importDefault(require("./routes/manualRoutes"));
const analyticsRoutes_1 = __importDefault(require("./routes/analyticsRoutes"));
const clioTestRoutes_1 = __importDefault(require("./routes/clioTestRoutes"));
// ----------------------------
// ✅ Initialize App
// ----------------------------
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "5000", 10);
// ----------------------------
// ✅ CORS Configuration
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
// ✅ Middleware Setup
// ----------------------------
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// ----------------------------
// ✅ Health Routes
// ----------------------------
app.get("/", (_req, res) => {
    res.send("🚀 Legal Billables Backend Running Successfully");
});
app.get("/test", (_req, res) => {
    res.json({ message: "✅ Test route working" });
});
// ----------------------------
// ✅ Main API Routes
// ----------------------------
app.use("/api/auth", authRoutes_1.default);
app.use("/api/gpt", gptRoutes_1.default);
app.use("/api/mock-clio", mockClioRoutes_1.default);
app.use("/api/clio", clioRoutes_1.default);
app.use("/api/clients", clientsRoutes_1.default);
app.use("/api/emails", emailRoutes_1.default);
app.use("/api/weekly-summary", weeklySummaryRoutes_1.default);
app.use("/api/manual", manualRoutes_1.default);
app.use("/api/analytics", analyticsRoutes_1.default);
app.use("/api/clio", clioTestRoutes_1.default);
// ----------------------------
// ✅ Mounted Routes Debug Log
// ----------------------------
const mountedRoutes = [
    "/api/auth",
    "/api/gpt",
    "/api/mock-clio",
    "/api/clio",
    "/api/clients",
    "/api/emails",
    "/api/weekly-summary",
    "/api/manual",
    "/api/analytics",
];
console.log("✅ Mounted routes:");
mountedRoutes.forEach((r) => console.log(`➡️  ${r}`));
// ----------------------------
// ✅ 404 Handler
// ----------------------------
app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
});
// ----------------------------
// ✅ Start Server
// ----------------------------
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running on: http://localhost:${PORT}`);
});
// ----------------------------
// ✅ Optional Static Frontend
// ----------------------------
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../../frontend/dist")));
app.get(/.*/, (_req, res) => res.sendFile(path_1.default.resolve(__dirname, "../../frontend/dist/index.html")));
exports.default = app;
