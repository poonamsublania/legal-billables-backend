// src/app.ts
import dotenv from "dotenv";
dotenv.config(); // Load environment variables first

import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import "./config/db";

// ----------------------------
// ✅ Route Imports
// ----------------------------
import authRoutes from "./routes/authRoutes";
import gptRoutes from "./routes/gptRoutes";
import clioRoutes from "./routes/clioRoutes";
import mockClioRoutes from "./routes/mockClioRoutes";
import clientsRoutes from "./routes/clientsRoutes";
import emailRoutes from "./routes/emailRoutes";
import weeklySummaryRoutes from "./routes/weeklySummaryRoutes";
import manualRoutes from "./routes/manualRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";

// ----------------------------
// ✅ Initialize App
// ----------------------------
const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// ----------------------------
// ✅ CORS Configuration
// ----------------------------
app.use(
  cors({
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
  })
);

// ----------------------------
// ✅ Middleware Setup
// ----------------------------
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------
// ✅ Health + Debug Routes
// ----------------------------
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Legal Billables Backend Running Successfully");
});

app.get("/test", (_req: Request, res: Response) => {
  res.json({ message: "✅ Test route working" });
});

app.get("/api/billing/ping", (_req, res) =>
  res.json({ message: "Billing service is alive 🚀" })
);

// ----------------------------
// ✅ Main API Routes
// ----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/gpt", gptRoutes);
app.use("/api/mock-clio", mockClioRoutes);
app.use("/api/clio", clioRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/weekly-summary", weeklySummaryRoutes);
app.use("/api/manual", manualRoutes);
app.use("/api/analytics", analyticsRoutes);

// ----------------------------
// ✅ 404 Handler
// ----------------------------
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// ----------------------------
// ✅ Start Server
// ----------------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://0.0.0.0:${PORT}`);

  // Debug: list all registered routes
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

// ----------------------------
// ✅ Static Frontend Support (optional)
// ----------------------------
app.use(express.static(path.resolve(__dirname, "../../frontend/dist")));

app.get(/.*/, (_req, res) => {
  res.sendFile(path.resolve(__dirname, "../../frontend/dist/index.html"));
});

export default app;
