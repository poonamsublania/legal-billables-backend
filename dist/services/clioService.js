"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClioToken = exports.refreshClioToken = void 0;
exports.logTimeEntry = logTimeEntry;
// src/services/clioService.ts
const axios_1 = __importDefault(require("axios"));
const clioToken_1 = __importDefault(require("../models/clioToken"));
const CLIO_BASE_URL = (process.env.CLIO_BASE_URL || "https://app.clio.com").replace(/\/+$/, "");
/** 🧠 Check if the token is expired */
const isTokenExpired = (expiresAt) => {
    if (!expiresAt)
        return true;
    const expiry = typeof expiresAt === "number" ? expiresAt * 1000 : new Date(expiresAt).getTime();
    return Date.now() >= expiry;
};
/** 🔄 Refresh Clio access token */
const refreshClioToken = async () => {
    try {
        const tokenDoc = await clioToken_1.default.findOne();
        if (!tokenDoc?.clioRefreshToken) {
            console.error("[ClioService] ❌ No refresh token found in DB");
            return null;
        }
        console.log("[ClioService] 🔄 Refreshing Clio access token...");
        const response = await axios_1.default.post(`${CLIO_BASE_URL}/oauth/token`, {
            grant_type: "refresh_token",
            client_id: process.env.CLIO_CLIENT_ID,
            client_secret: process.env.CLIO_CLIENT_SECRET,
            refresh_token: tokenDoc.clioRefreshToken,
        }, { headers: { "Content-Type": "application/json" } });
        const { access_token, refresh_token, expires_in } = response.data;
        // Update DB safely
        tokenDoc.clioAccessToken = access_token ?? null;
        tokenDoc.clioRefreshToken = refresh_token ?? null;
        tokenDoc.clioTokenExpiry = Math.floor(Date.now() / 1000) + expires_in;
        await tokenDoc.save();
        console.log("[ClioService] ✅ Token refreshed successfully");
        return access_token ?? null;
    }
    catch (error) {
        console.error("[ClioService] 🔴 Token refresh failed:", error.response?.data || error.message);
        return null;
    }
};
exports.refreshClioToken = refreshClioToken;
/** 🧾 Get valid Clio token (auto-refresh if expired) */
const getClioToken = async () => {
    try {
        const tokenDoc = await clioToken_1.default.findOne();
        if (!tokenDoc) {
            console.error("[ClioService] ❌ No Clio token found in DB");
            return null;
        }
        const accessToken = tokenDoc.clioAccessToken ?? null;
        if (!accessToken) {
            console.error("[ClioService] ⚠️ Missing Clio access token in DB");
            return null;
        }
        if (isTokenExpired(tokenDoc.clioTokenExpiry ?? null)) {
            console.warn("[ClioService] ⚠️ Token expired, refreshing...");
            return await (0, exports.refreshClioToken)();
        }
        console.log("[ClioService] ✅ Using existing valid Clio token");
        return accessToken;
    }
    catch (err) {
        console.error("[ClioService] Error fetching token:", err.message);
        return null;
    }
};
exports.getClioToken = getClioToken;
// Temporary mock Clio push (for free trial)
async function logTimeEntry(entry) {
    console.log("🧪 Simulated Clio push (free trial):", entry);
    return { message: "Simulated Clio push successful (free trial)" };
}
