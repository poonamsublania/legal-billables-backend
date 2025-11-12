"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenStore = void 0;
exports.getStoredTokens = getStoredTokens;
const mongoose_1 = __importDefault(require("mongoose"));
// ✅ Define schema
const tokenSchema = new mongoose_1.default.Schema({
    _id: { type: String, default: "singleton" },
    clioAccessToken: { type: String, default: null },
    clioRefreshToken: { type: String, default: null },
    clioTokenExpiry: { type: Number, default: null },
    accessToken: { type: String, default: null },
    refreshToken: { type: String, default: null },
    expiresAt: { type: Date, default: null },
});
// ✅ Create and export model
const TokenStore = mongoose_1.default.model("TokenStore", tokenSchema);
exports.TokenStore = TokenStore;
exports.default = TokenStore; // <-- ✅ default export (NOT named export)
// ✅ Helper function
async function getStoredTokens() {
    const tokens = await TokenStore.findById("singleton");
    return tokens;
}
