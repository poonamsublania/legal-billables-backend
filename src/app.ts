// src/app.ts
import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import { connectDB } from "./config/db";   // ✅ FIXED (import proper function)
import { keepMongoAwake } from "./utils/pingMongo";

// ----------------------------
// Initialize App
// ----------------------------
const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// ----------------------------
// Connect to MongoDB BEFORE loading routes
// ----------------------------
(async () => {
  console.log("⏳ Connecting to MongoDB...");
  await connectDB();  // ✅ WAIT UNTIL MONGO CONNECTS
  console.log("✅ Mongo DB ready!");
})();

keepMongoAwake();

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
// Health Routes
// ----------------------------
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Legal Billables Backend Running Successfully");
});

app.get("/test", (_req: Request, res: Response) => {
  res.json({ message: "✅ Test route working" });
});

// ----------------------------
// Lazy-load routes AFTER DB connection is ready
// ----------------------------
import authRoutes from "./routes/authRoutes";
import gptRoutes from "./routes/gptRoutes";
import clioRoutes from "./routes/clioRoutes";
import mockClioRoutes from "./routes/mockClioRoutes";
import clientsRoutes from "./routes/clientsRoutes";
import emailRoutes from "./routes/emailRoutes";
import weeklySummaryRoutes from "./routes/weeklySummaryRoutes";
import manualRoutes from "./routes/manualRoutes";
import caseRoutes from "./routes/caseRoutes";
import teamRoutes from "./routes/teamRoutes";

app.use("/api/auth", authRoutes);
app.use("/api/gpt", gptRoutes);
app.use("/api/mock-clio", mockClioRoutes);
app.use("/api/clio", clioRoutes);
app.use("/api/clients", clientsRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/weekly-summary", weeklySummaryRoutes);
app.use("/api/manual", manualRoutes);
app.use("/api/cases", caseRoutes);
app.use("/api/team", teamRoutes);

console.log("✅ Mounted routes:", [
  "/api/auth",
  "/api/gpt",
  "/api/mock-clio",
  "/api/clio",
  "/api/clients",
  "/api/emails",
  "/api/weekly-summary",
  "/api/manual",
  "/api/analytics",
]);

// ----------------------------
// 404 Handler
// ----------------------------
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// ----------------------------
// Start Server
// ----------------------------
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🔥 Server running on port ${PORT}`);
});

// ----------------------------
// Optional Frontend Hosting
// ----------------------------
app.use(express.static(path.resolve(__dirname, "../../frontend/dist")));
app.get(/.*/, (_req, res) =>
  res.sendFile(path.resolve(__dirname, "../../frontend/dist/index.html"))
);

export default app;
