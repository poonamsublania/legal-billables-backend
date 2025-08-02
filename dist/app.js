"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// Import your route files
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const billingRoutes_1 = __importDefault(require("./routes/billingRoutes"));
const gptRoutes_1 = __importDefault(require("./routes/gptRoutes"));
// Load environment variables from .env
dotenv_1.default.config();
// Get MongoDB URI and Port from env
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
// Connect to MongoDB
const connectToDB = async () => {
    try {
        if (!MONGO_URI) {
            throw new Error("❌ MONGO_URI is not defined in .env");
        }
        await mongoose_1.default.connect(MONGO_URI);
        console.log("✅ MongoDB connected");
    }
    catch (error) {
        console.error("❌ MongoDB connection error:", error);
        process.exit(1);
    }
};
// Initialize Express app
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ✅ Basic test route
app.get("/api/test", (req, res) => {
    res.send("✅ API is working!");
});
// ✅ Use routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/billing", billingRoutes_1.default);
app.use("/api/gpt", gptRoutes_1.default);
// Start the server after DB connects
connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
});
