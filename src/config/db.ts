// src/config/db.ts
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("❌ MONGO_URI not defined in .env");
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      dbName: "legal-billables-ai",
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    console.log(`✅ MongoDB connected: ${mongoose.connection.host}`);
  } catch (err: any) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }

  mongoose.connection.on("connected", () =>
    console.log("🔹 Mongoose connected to DB")
  );

  mongoose.connection.on("error", (err) =>
    console.error("🔹 Mongoose connection error:", err)
  );

  mongoose.connection.on("disconnected", () =>
    console.log("🔹 Mongoose disconnected")
  );
};

export default connectDB;
