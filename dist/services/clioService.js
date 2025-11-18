"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createClioTimeEntry = exports.getClioAccessToken = exports.refreshClioToken = void 0;
// src/services/clioService.ts
const axios_1 = __importDefault(require("axios"));
const clioToken_1 = __importDefault(require("../models/clioToken"));
const CLIO_BASE_URL = (process.env.CLIO_BASE_URL || "https://app.clio.com").replace(/\/+$/, "");
// ------------------------
// 🔍 Check token expiry
// ------------------------
const isTokenExpired = (expiresAt) => {
    if (!expiresAt)
        return true;
    return Date.now() >= expiresAt.getTime();
};
// ------------------------
// 🔄 Refresh Clio access token
// ------------------------
const refreshClioToken = async () => {
    try {
        const tokenDoc = await clioToken_1.default.findOne({ _id: "singleton" });
        if (!tokenDoc?.refreshToken) {
            console.error("[ClioService] ❌ No refresh token found in DB");
            return null;
        }
        console.log("[ClioService] 🔄 Refreshing Clio access token...");
        const response = await axios_1.default.post(`${CLIO_BASE_URL}/oauth/token`, new URLSearchParams({
            grant_type: "refresh_token",
            client_id: process.env.CLIO_CLIENT_ID,
            client_secret: process.env.CLIO_CLIENT_SECRET,
            refresh_token: tokenDoc.refreshToken,
        }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        const { access_token, refresh_token, expires_in } = response.data;
        // Save updates
        tokenDoc.accessToken = access_token ?? null;
        tokenDoc.refreshToken = refresh_token ?? tokenDoc.refreshToken;
        tokenDoc.expiresAt = new Date(Date.now() + expires_in * 1000);
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
// ------------------------
// 🔐 Get valid Clio token (auto-refresh)
// ------------------------
const getClioAccessToken = async () => {
    try {
        const tokenDoc = await clioToken_1.default.findOne({ _id: "singleton" });
        if (!tokenDoc?.accessToken) {
            console.warn("[ClioService] ⚠️ No Clio access token — refreshing…");
            return await (0, exports.refreshClioToken)();
        }
        if (isTokenExpired(tokenDoc.expiresAt)) {
            console.warn("[ClioService] ⚠️ Clio token expired — refreshing…");
            return await (0, exports.refreshClioToken)();
        }
        console.log("[ClioService] ✅ Using existing valid Clio token");
        return tokenDoc.accessToken;
    }
    catch (error) {
        console.error("[ClioService] Error reading token:", error.message);
        return null;
    }
};
exports.getClioAccessToken = getClioAccessToken;
// ------------------------
// 🕒 Create time entry (This is the function controller expects)
// ------------------------
const createClioTimeEntry = async ({ contactId, matterId, description, minutes, }) => {
    try {
        const token = await (0, exports.getClioAccessToken)();
        if (!token)
            throw new Error("❌ No valid Clio token available");
        const payload = {
            data: {
                type: "time-entries",
                attributes: {
                    description,
                    duration: minutes,
                    "activity-date": new Date().toISOString().split("T")[0],
                },
                relationships: {
                    contact: {
                        data: {
                            type: "contacts",
                            id: contactId,
                        },
                    },
                    matter: {
                        data: {
                            type: "matters",
                            id: matterId,
                        },
                    },
                },
            },
        };
        const response = await axios_1.default.post(`${CLIO_BASE_URL}/api/v4/time_entries`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        console.log("[ClioService] ✅ Time entry created:", response.data);
        return response.data;
    }
    catch (err) {
        console.error("❌ Failed to create time entry:", err.response?.data || err.message);
        throw err;
    }
};
exports.createClioTimeEntry = createClioTimeEntry;
