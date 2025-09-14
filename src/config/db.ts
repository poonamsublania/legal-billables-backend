import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI not defined in .env");
}

mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

  mongoose.connection.on("connected", () => console.log("🔹 Mongoose connected to DB"));
mongoose.connection.on("error", err => console.error("🔹 Mongoose connection error:", err));
mongoose.connection.on("disconnected", () => console.log("🔹 Mongoose disconnected"));