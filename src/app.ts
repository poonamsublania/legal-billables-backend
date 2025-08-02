import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

// Import your route files
import authRoutes from "./routes/authRoutes";
import billingRoutes from "./routes/billingRoutes";
import gptRoutes from "./routes/gptRoutes";

// Load environment variables from .env
dotenv.config();

// Get MongoDB URI and Port from env
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
const connectToDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("❌ MONGO_URI is not defined in .env");
    }

    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Basic test route
app.get("/api/test", (req, res) => {
  res.send("✅ API is working!");
});

// ✅ Use routes
app.use("/api/auth", authRoutes);
app.use("/api/billing", billingRoutes);
app.use("/api/gpt", gptRoutes);

// Start the server after DB connects
connectToDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
  });
});
