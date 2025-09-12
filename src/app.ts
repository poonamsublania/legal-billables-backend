import dotenv from "dotenv";
dotenv.config(); // Load env variables first

import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import gptRoutes from "./routes/gptRoutes";
import clioRoutes from "./routes/clioRoutes";
import mockClioRoutes from "./routes/mockClioRoutes"; // <-- you forgot this import

// Validate required environment variables
if (!process.env.GEMINI_API_KEY) {
  console.warn("❌ Warning: GEMINI_API_KEY is not set in .env");
} else {
  console.log("✅ GEMINI_API_KEY loaded");
}

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// ✅ Updated CORS to allow Chrome extension + Render + localhost
app.use(cors({
  origin: [
    "chrome-extension://moiajblmfageiimmjnplhmpjlnhfnalm", // ⚠️ remove space after //
    "http://localhost:5000",
    "https://legal-billables-backend.onrender.com"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middlewares
app.use(bodyParser.json());

// Routes
app.use("/api/gpt", gptRoutes);
app.use("/api/mock-clio", mockClioRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/clio", clioRoutes);

console.log("📩 GPT routes mounted at /api/gpt");

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Legal Billables Backend Running with Gemini");
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// Global error handler
app.use(
  (err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("Global error handler:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
});

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.get("/test", (_req, res) => {
  res.json({ message: "✅ Test route working" });
});
