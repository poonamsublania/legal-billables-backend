// backend/src/config/db.ts

import mongoose from "mongoose";
import dotenv from "dotenv";

// Load .env variables
dotenv.config();

export const connectToDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error("❌ MONGO_URI not found in environment variables.");
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log("✅ MongoDB connected successfully.");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};
