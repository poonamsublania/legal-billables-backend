// scripts/migrateClioToken.js
const mongoose = require("mongoose");
const ClioTokenModel = require("../src/models/clioToken").default;

const MONGO_URI = process.env.MONGO_URI || "your_mongo_uri_here";

async function run() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  const doc = await ClioTokenModel.findOne({ _id: "singleton" });
  if (!doc) {
    console.log("No token doc found.");
    process.exit(0);
  }

  // derive canonical fields from existing ones
  const accessToken = doc.accessToken || doc.clioAccessToken || doc.clio_access_token;
  const refreshToken = doc.refreshToken || doc.clioRefreshToken || doc.clio_refresh_token;
  const expiryRaw = doc.expiresAt || doc.clioTokenExpiry || doc.clio_token_expiry || doc.expires_at;

  const expiresAt = expiryRaw ? (typeof expiryRaw === "number" ? new Date(expiryRaw) : new Date(expiryRaw)) : null;

  const update = {};
  if (accessToken) update.accessToken = accessToken;
  if (refreshToken) update.refreshToken = refreshToken;
  if (expiresAt) update.expiresAt = expiresAt;

  if (Object.keys(update).length === 0) {
    console.log("Nothing to update.");
    process.exit(0);
  }

  await ClioTokenModel.updateOne({ _id: "singleton" }, { $set: update }, { upsert: false });
  console.log("Token migrated:", update);
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
