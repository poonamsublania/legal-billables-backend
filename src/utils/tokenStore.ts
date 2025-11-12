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

// ✅ Create and export model
const TokenStore = mongoose.model("TokenStore", tokenSchema);
export default TokenStore; // <-- ✅ default export (NOT named export)

// ✅ Helper function
export async function getStoredTokens() {
  const tokens = await TokenStore.findById("singleton");
  return tokens;
}

// ✅ Export both
export { TokenStore };