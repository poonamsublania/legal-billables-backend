// src/app.ts
import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import { connectDB } from "./config/db";

// ----------------------------
// Initialize App
// ----------------------------
const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// ----------------------------
// CORS
// ----------------------------
app.use(
  cors({
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
  })
);

// ----------------------------
// Middleware
// ----------------------------
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----------------------------
// Health Check Routes
// ----------------------------
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Legal Billables Backend Running Successfully");
});

app.get("/test", (_req: Request, res: Response) => {
  res.json({ message: "✅ Test route working" });
});

// ----------------------------
// Import Routes
// ----------------------------
import authRoutes from "./routes/authRoutes";
import gptRoutes from "./routes/gptRoutes";
import clioRoutes from "./routes/clioRoutes";
import billingRoutes from "./routes/billingRoutes";   // ✅ new file
import mockClioRoutes from "./routes/mockClioRoutes";
import clientsRoutes from "./routes/clientsRoutes";
import emailRoutes from "./routes/emailRoutes";
import weeklySummaryRoutes from "./routes/weeklySummaryRoutes";
import manualRoutes from "./routes/manualRoutes";
import caseRoutes from "./routes/caseRoutes";
import teamRoutes from "./routes/teamRoutes";



// ----------------------------
// Load Routes
// ----------------------------
app.use("/auth", authRoutes);
app.use("/api/gpt", gptRoutes);
app.use("/clio", clioRoutes);
app.use("/api/billing", billingRoutes);   // ⭐ Add real time entry route
app.use("/api/mock-clio", mockClioRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/weekly-summary", weeklySummaryRoutes);
app.use("/api/manual", manualRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/team", teamRoutes);


console.log("✅ Mounted routes:", [
  "auth",
  "/api/gpt",
  "clio",
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
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// ----------------------------
// Connect DB THEN start server
// ----------------------------
(async () => {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await connectDB();
    console.log("✅ MongoDB connected!");

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🔥 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  }
})();

// ----------------------------
// Optional Frontend Hosting
// ----------------------------
app.use(express.static(path.resolve(__dirname, "../../frontend/dist")));
app.get(/.*/, (_req, res) =>
  res.sendFile(path.resolve(__dirname, "../../frontend/dist/index.html"))
);

export default app;
