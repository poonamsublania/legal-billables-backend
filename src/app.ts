import dotenv from "dotenv";
dotenv.config(); // Load env variables first

import express, { Request, Response } from "express";
import cors from "cors";
import path from "path"; // ✅ Added import
import "./config/db";
import { createTimeEntry } from "./controllers/billingController";

import authRoutes from "./routes/authRoutes";
import gptRoutes from "./routes/gptRoutes";
import clioRoutes from "./routes/clioRoutes";
import mockClioRoutes from "./routes/mockClioRoutes";
import billingRoutes from "./routes/billingRoutes";
import draftRoutes from "./routes/draftRoutes";
import billablesRoutes from "./routes/billablesRoutes";
import clientsRoutes from "./routes/clientsRoutes";

// 🆕 Newly added imports
import dashboardRoutes from "./routes/dashboardRoutes"; // ✅ Added dashboard routes

// ✅ Validate required environment variables
if (!process.env.GEMINI_API_KEY) {
  console.warn("❌ Warning: GEMINI_API_KEY is not set in .env");
} else {
  console.log("✅ GEMINI_API_KEY loaded");
}

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// ✅ Updated CORS
app.use(
  cors({
    origin: [
      "chrome-extension://moiajblmfageiimmjnplhmpjlnhfnalm",
      "http://localhost:5000",
      "http://localhost:5173",
      "https://legal-billables-backend.onrender.com",
    ],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Middlewares
app.use(express.json());

// ✅ Routes
app.get("/api/billing/ping", (_req, res) =>
  res.json({ message: "Billing service is alive 🚀" })
);
app.post("/api/billing/time-entry", createTimeEntry);

console.log("📩 GPT routes mounted at /api/gpt");

// ✅ Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Legal Billables Backend Running with Gemini");
});

// ✅ Test route
app.get("/test", (_req, res) => {
  res.json({ message: "✅ Test route working" });
});

// ✅ Mount routes
app.use("/api/auth", authRoutes);
console.log("✅ Mounted Auth routes from routes/authRoutes.ts at /api/auth");

app.use("/api/gpt", gptRoutes);
console.log("✅ Mounted GPT routes from routes/gptRoutes.ts at /api/gpt");

app.use("/api/mock-clio", mockClioRoutes);
console.log("✅ Mounted Mock Clio routes from routes/mockClioRoutes.ts at /api/mock-clio");

app.use("/api/clio", clioRoutes);
console.log("✅ Mounted Clio routes from routes/clioRoutes.ts at /api/clio");

app.use("/api/billing", billingRoutes);
console.log("✅ Mounted Billing routes from routes/billingRoutes.ts at /api/billing");

app.use("/api/drafts", draftRoutes);
app.use("/api/billables", billablesRoutes);
app.use("/api/clients", clientsRoutes);

// 🆕 Added dashboard route
app.use("/api/dashboard", dashboardRoutes);
console.log("✅ Mounted Dashboard routes from routes/dashboardRoutes.ts at /api/dashboard");

// ✅ 404 handler
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://0.0.0.0:${PORT}`);

  // ✅ Health check
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Legal Billables Backend Running with Gemini");
});

// Debug: list all mounted routes
  const router = (app as any)._router;
  if (router && router.stack) {
    router.stack.forEach((middleware: any) => {
      if (middleware.route && middleware.route.path) {
        const methods = Object.keys(middleware.route.methods)
          .map((m) => m.toUpperCase())
          .join(", ");
        console.log(`➡️  [${methods}] ${middleware.route.path}`);
      }
    });
  }
});  

// Express 5 style, safer

app.use(express.static(path.resolve(__dirname, "../../frontend/dist")));

app.get(/.*/, (_req, res) => {
  res.sendFile(path.resolve(__dirname, "../../frontend/dist/index.html"));
});
