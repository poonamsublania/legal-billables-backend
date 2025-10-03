import dotenv from "dotenv";
dotenv.config(); // Load env variables first

import express, { Request, Response, NextFunction } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "./config/db";
import { createTimeEntry } from "./controllers/billingController";


import authRoutes from "./routes/authRoutes";
import gptRoutes from "./routes/gptRoutes";
import clioRoutes from "./routes/clioRoutes";
import mockClioRoutes from "./routes/mockClioRoutes";
import billingRoutes from "./routes/billingRoutes";

// Validate required environment variables
if (!process.env.GEMINI_API_KEY) {
  console.warn("❌ Warning: GEMINI_API_KEY is not set in .env");
} else {
  console.log("✅ GEMINI_API_KEY loaded");
}

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// ✅ Updated CORS
app.use(cors({
  origin: [
    "chrome-extension://moiajblmfageiimmjnplhmpjlnhfnalm",
    "http://localhost:5000",
    "https://legal-billables-backend.onrender.com"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middlewares
app.use(express.json());


// Routes
app.get("/api/billing/ping", (_req, res) => res.json({ message: "Billing service is alive 🚀" }));
app.post("/api/billing/time-entry", createTimeEntry);


console.log("📩 GPT routes mounted at /api/gpt");

// Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Legal Billables Backend Running with Gemini");
});

// Test route
app.get("/test", (_req, res) => {
  res.json({ message: "✅ Test route working" });
});

app.use("/api/auth", authRoutes);
console.log("✅ Mounted Auth routes from routes/authRoutes.ts at /api/auth");

app.use("/api/gpt", gptRoutes);
console.log("✅ Mounted GPT routes from routes/gptRoutes.ts at /api/gpt");

app.use("/api/mock-clio", mockClioRoutes);
console.log("✅ Mounted Mock Clio routes from routes/mockClioRoutes.ts at /api/mock-clio");

app.use("/api/clio", clioRoutes);
console.log("✅ Mounted Clio routes from routes/clioRoutes.ts at /api/clio");

app.use("/api/billing/", billingRoutes);
console.log("✅ Mounted Billing routes from routes/billingRoutes.ts at /api/billing");

// 404 handler (keep only ONE)
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});


// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://0.0.0.0:${PORT}`);

  // Debug: list all mounted routes
  if ((app as any)._router) {
    (app as any)._router.stack.forEach((middleware: any) => {
      if (middleware.route && middleware.route.path) {
        const methods = Object.keys(middleware.route.methods)
          .map(m => m.toUpperCase())
          .join(", ");
        console.log(`➡️  [${methods}] ${middleware.route.path}`);
      }
    });
  }
});

