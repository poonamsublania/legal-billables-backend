import dotenv from "dotenv";
dotenv.config();


console.log("🔑 OPENAI KEY VALUE:", process.env.OPENAI_API_KEY);
console.log("🔑 OPENAI KEY LOADED:", !!process.env.OPENAI_API_KEY);
import express, { Request, Response } from "express";
import cors from "cors";
import path from "path";
import bodyParser from "body-parser";
import { connectDB } from "./config/db";

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
// Health Check
// ----------------------------
app.get("/", (_req: Request, res: Response) => {
  res.send("🚀 Legal Billables Backend Running Successfully");
});

app.get("/test", (_req: Request, res: Response) => {
  res.json({ message: "✅ Test route working" });
});

// ----------------------------
// Routes Imports
// ----------------------------
import authRoutes from "./routes/authRoutes";
import gptRoutes from "./routes/gptRoutes";
import clioRoutes from "./routes/clioRoutes";
import clientsRoutes from "./routes/clientsRoutes";
import emailRoutes from "./routes/emailRoutes";
import weeklySummaryRoutes from "./routes/weeklySummaryRoutes";
import manualRoutes from "./routes/manualRoutes";
import caseRoutes from "./routes/caseRoutes";
import teamRoutes from "./routes/teamRoutes";
import clioTestRoutes from "./routes/clioTest";
import clioLogRoutes from "./routes/clioLog";

import addonEmailRoutes from "./routes/addonEmailRoutes";

// ----------------------------
// Routes Mounting + LOGS
// ----------------------------

// ⭐ Clio OAuth MUST be root
app.use("/", clioRoutes);
console.log("✅ Mounted: /");

app.use("/auth", authRoutes);
console.log("✅ Mounted: /auth");

app.use("/api/gpt", gptRoutes);
console.log("✅ Mounted: /api/gpt");

app.use("/api/clients", clientsRoutes);
console.log("✅ Mounted: /api/clients");

app.use("/api/emails", emailRoutes);
console.log("✅ Mounted: /api/emails");

app.use("/api/weekly-summary", weeklySummaryRoutes);
console.log("✅ Mounted: /api/weekly-summary");

app.use("/api/manual", manualRoutes);
console.log("✅ Mounted: /api/manual");

app.use("/api/cases", caseRoutes);
console.log("✅ Mounted: /api/cases");

app.use("/api/team", teamRoutes);
console.log("✅ Mounted: /api/team");

app.use("/api/clio", clioTestRoutes);
console.log("✅ Mounted: /api/clio (test)");

app.use("/api/clio", clioLogRoutes);
console.log("✅ Mounted: /api/clio (logs)");



app.use("/api", addonEmailRoutes);
console.log("✅ Mounted: /api (addon emails)");

// ----------------------------
// 404
// ----------------------------
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

// ----------------------------
// Start Server
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
// Frontend Hosting (optional)
// ----------------------------
app.use(express.static(path.resolve(__dirname, "../../frontend/dist")));

app.get(/.*/, (_req, res) =>
  res.sendFile(path.resolve(__dirname, "../../frontend/dist/index.html"))
);

export default app;

