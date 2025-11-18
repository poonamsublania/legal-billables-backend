"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logTimeEntry = exports.getClioToken = exports.refreshClioToken = void 0;
// src/services/clioService.ts
const axios_1 = __importDefault(require("axios"));
const clioToken_1 = __importDefault(require("../models/clioToken"));
const CLIO_BASE_URL = (process.env.CLIO_BASE_URL || "https://app.clio.com").replace(/\/+$/, "");
// Check if token is expired
const isTokenExpired = (expiresAt) => {
    if (!expiresAt)
        return true;
    return Date.now() >= expiresAt.getTime();
};
// Refresh Clio token
const refreshClioToken = async () => {
    try {
        const tokenDoc = await clioToken_1.default.findById("singleton");
        if (!tokenDoc?.refreshToken) {
            console.error("[ClioService] ❌ No refresh token found in DB");
            return null;
        }
        console.log("[ClioService] 🔄 Refreshing Clio token...");
        const response = await axios_1.default.post(`${CLIO_BASE_URL}/oauth/token`, new URLSearchParams({
            grant_type: "refresh_token",
            client_id: process.env.CLIO_CLIENT_ID,
            client_secret: process.env.CLIO_CLIENT_SECRET,
            refresh_token: tokenDoc.refreshToken,
        }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        const { access_token, refresh_token, expires_in } = response.data;
        // Update MongoDB
        tokenDoc.accessToken = access_token;
        tokenDoc.refreshToken = refresh_token ?? tokenDoc.refreshToken;
        tokenDoc.expiresAt = new Date(Date.now() + expires_in * 1000);
        await tokenDoc.save();
        console.log("[ClioService] ✅ Token refreshed successfully");
        return access_token;
    }
    catch (err) {
        console.error("[ClioService] 🔴 Token refresh failed:", err.response?.data || err.message);
        return null;
    }
};
exports.refreshClioToken = refreshClioToken;
// Get valid token (auto-refresh if expired)
const getClioToken = async () => {
    try {
        let tokenDoc = await clioToken_1.default.findById("singleton");
        if (!tokenDoc) {
            console.error("[ClioService] ❌ No token found in DB");
            return null;
        }
        if (!tokenDoc.accessToken || isTokenExpired(tokenDoc.expiresAt)) {
            console.log("[ClioService] ⚠️ Token missing or expired, refreshing...");
            return await (0, exports.refreshClioToken)();
        }
        return tokenDoc.accessToken;
    }
    catch (err) {
        console.error("[ClioService] Error fetching token:", err.message);
        return null;
    }
};
exports.getClioToken = getClioToken;
// Log time entry
const logTimeEntry = async (entry) => {
    const token = await (0, exports.getClioToken)();
    if (!token)
        throw new Error("No valid Clio token available");
    const payload = {
        data: {
            type: "TimeEntry",
            attributes: {
                description: entry.description,
                duration: entry.duration,
                date: entry.date,
                matter_id: entry.matterId,
            },
        },
    };
    const response = await axios_1.default.post(`${CLIO_BASE_URL}/api/v4/time_entries`, payload, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });
    console.log("[ClioService] ✅ Time entry logged:", response.data);
    return response.data;
};
exports.logTimeEntry = logTimeEntry;
