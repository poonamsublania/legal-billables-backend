import mongoose from "mongoose";

// ✅ Define schema
const tokenSchema = new mongoose.Schema({
  _id: { type: String, default: "singleton" },
  clioAccessToken: { type: String, default: null },
  clioRefreshToken: { type: String, default: null },
  clioTokenExpiry: { type: Number, default: null },
  accessToken: { type: String, default: null },
  refreshToken: { type: String, default: null },
  expiresAt: { type: Date, default: null },
});

// ✅ Prevent re-compiling model during hot reload (important for dev + Render)
const TokenStore =
  mongoose.models.TokenStore || mongoose.model("TokenStore", tokenSchema);

export default TokenStore; // ✅ default export for direct import

// ✅ Get stored tokens
export async function getStoredTokens() {
  try {
    const tokens = await TokenStore.findById("singleton");
    return tokens;
  } catch (error: any) {
    console.error("❌ Error fetching tokens:", error.message);
    return null;
  }
}

// ✅ Save or update tokens
export async function saveTokens(tokens: any) {
  try {
    const updated = await TokenStore.findByIdAndUpdate(
      "singleton",
      { $set: tokens },
      { upsert: true, new: true }
    );
    console.log("✅ Tokens saved to MongoDB");
    return updated;
  } catch (error: any) {
    console.error("❌ Error saving tokens:", error.message);
    throw error;
  }
}

// ✅ Optional helper to clear tokens (for debugging)
export async function clearTokens() {
  try {
    await TokenStore.findByIdAndDelete("singleton");
    console.log("🗑️ Tokens cleared");
  } catch (error: any) {
    console.error("❌ Error clearing tokens:", error.message);
  }
}
