// src/config/db.ts
import mongoose from "mongoose";

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGO_URI;
  if (!MONGO_URI) throw new Error("❌ MONGO_URI not defined in .env");

  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    mongoose.connection.on("connected", () =>
      console.log("🔹 Mongoose connected")
    );
    mongoose.connection.on("error", (err) =>
      console.error("🔹 Mongoose error:", err)
    );
    mongoose.connection.on("disconnected", () =>
      console.log("🔹 Mongoose disconnected")
    );
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
};
