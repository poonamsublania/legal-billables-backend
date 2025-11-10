"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables first
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
        "chrome-extension://moiajblmfageiimmjnplhmpjlnhfnalm", // your Chrome extension ID
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
// ✅ Health + Debug Routes
// ----------------------------
app.get("/", (_req, res) => {
    res.send("🚀 Legal Billables Backend Running Successfully");
});
app.get("/test", (_req, res) => {
    res.json({ message: "✅ Test route working" });
});
app.get("/api/billing/ping", (_req, res) => res.json({ message: "Billing service is alive 🚀" }));
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
    console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
    // Debug: list all registered routes
    const router = app._router;
    if (router && router.stack) {
        router.stack.forEach((middleware) => {
            if (middleware.route && middleware.route.path) {
                const methods = Object.keys(middleware.route.methods)
                    .map((m) => m.toUpperCase())
                    .join(", ");
                console.log(`➡️  [${methods}] ${middleware.route.path}`);
            }
        });
    }
});
// ----------------------------
// ✅ Static Frontend Support (optional)
// ----------------------------
app.use(express_1.default.static(path_1.default.resolve(__dirname, "../../frontend/dist")));
app.get(/.*/, (_req, res) => {
    res.sendFile(path_1.default.resolve(__dirname, "../../frontend/dist/index.html"));
});
exports.default = app;
