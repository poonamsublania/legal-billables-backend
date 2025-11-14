import mongoose from "mongoose";

export function keepMongoAwake() {
  setInterval(async () => {
    try {
      if (mongoose.connection.readyState !== 1) {
        console.log("⚠️ MongoDB not connected, skipping ping...");
        return;
      }

      const db = mongoose.connection.db;
      if (!db) {
        console.log("⚠️ MongoDB DB instance not ready, skipping ping...");
        return;
      }

      await db.admin().ping();
      console.log("📡 MongoDB is awake");

    } catch (err) {
      console.error("🔥 MongoDB ping error:", err);
    }
  }, 5 * 60 * 1000); // ping every 5 minutes
}
