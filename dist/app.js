"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load env variables first
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
require("./config/db");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const gptRoutes_1 = __importDefault(require("./routes/gptRoutes"));
const clioRoutes_1 = __importDefault(require("./routes/clioRoutes"));
const mockClioRoutes_1 = __importDefault(require("./routes/mockClioRoutes"));
const billingRoutes_1 = __importDefault(require("./routes/billingRoutes"));
// Validate required environment variables
if (!process.env.GEMINI_API_KEY) {
    console.warn("❌ Warning: GEMINI_API_KEY is not set in .env");
}
else {
    console.log("✅ GEMINI_API_KEY loaded");
}
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || "5000", 10);
// ✅ Updated CORS
app.use((0, cors_1.default)({
    origin: [
        "chrome-extension://moiajblmfageiimmjnplhmpjlnhfnalm",
        "http://localhost:5000",
        "https://legal-billables-backend.onrender.com"
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
// Middlewares
app.use(body_parser_1.default.json());
console.log("📩 GPT routes mounted at /api/gpt");
// Health check
app.get("/", (_req, res) => {
    res.send("🚀 Legal Billables Backend Running with Gemini");
});
// Test route
app.get("/test", (_req, res) => {
    res.json({ message: "✅ Test route working" });
});
app.use("/api/auth", authRoutes_1.default);
console.log("✅ Mounted Auth routes from routes/authRoutes.ts at /api/auth");
app.use("/api/gpt", gptRoutes_1.default);
console.log("✅ Mounted GPT routes from routes/gptRoutes.ts at /api/gpt");
app.use("/api/mock-clio", mockClioRoutes_1.default);
console.log("✅ Mounted Mock Clio routes from routes/mockClioRoutes.ts at /api/mock-clio");
app.use("/api/clio", clioRoutes_1.default);
console.log("✅ Mounted Clio routes from routes/clioRoutes.ts at /api/clio");
app.use("/api/billing", billingRoutes_1.default);
console.log("✅ Mounted Billing routes from routes/billingRoutes.ts at /api/billing");
// 404 handler (keep only ONE)
app.use((_req, res) => {
    res.status(404).json({ error: "Route not found" });
});
// Start server
app.listen(PORT, "0.0.0.0", () => {
    console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
    // Debug: list all mounted routes
    if (app._router) {
        app._router.stack.forEach((middleware) => {
            if (middleware.route && middleware.route.path) {
                const methods = Object.keys(middleware.route.methods)
                    .map(m => m.toUpperCase())
                    .join(", ");
                console.log(`➡️  [${methods}] ${middleware.route.path}`);
            }
        });
    }
});
