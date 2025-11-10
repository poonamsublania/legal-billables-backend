"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClioAccessToken = getClioAccessToken;
exports.refreshClioToken = refreshClioToken;
exports.createClioTimeEntry = createClioTimeEntry;
exports.getClioMatters = getClioMatters;
// src/config/clio.ts
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const CLIO_BASE_URL = "https://app.clio.com";
const API_BASE_URL = "https://app.clio.com";
/**
 * Helper: Pretty print API errors
 */
function logAxiosError(error, context) {
    if (axios_1.default.isAxiosError(error)) {
        console.error(`🔴 ${context}:`, error.response?.data || error.message);
    }
    else {
        console.error(`🔴 ${context}:`, error);
    }
}
/**
 * Exchange authorization code for access & refresh tokens
 */
async function getClioAccessToken(code) {
    try {
        const response = await axios_1.default.post(`${CLIO_BASE_URL}/oauth/token`, new URLSearchParams({
            grant_type: "authorization_code",
            client_id: process.env.CLIO_CLIENT_ID,
            client_secret: process.env.CLIO_CLIENT_SECRET,
            code,
            redirect_uri: process.env.CLIO_REDIRECT_URI,
        }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        return response.data; // { access_token, refresh_token, expires_in, token_type }
    }
    catch (error) {
        logAxiosError(error, "Failed to get Clio access token");
        throw error;
    }
}
/**
 * Refresh an expired Clio access token
 */
async function refreshClioToken(refreshToken) {
    try {
        const response = await axios_1.default.post(`${CLIO_BASE_URL}/oauth/token`, new URLSearchParams({
            grant_type: "refresh_token",
            client_id: process.env.CLIO_CLIENT_ID,
            client_secret: process.env.CLIO_CLIENT_SECRET,
            refresh_token: refreshToken,
        }), { headers: { "Content-Type": "application/x-www-form-urlencoded" } });
        return response.data; // { access_token, refresh_token, expires_in, token_type }
    }
    catch (error) {
        logAxiosError(error, "Failed to refresh Clio token");
        throw error;
    }
}
/**
 * Create a time entry in Clio
 * Note: `duration` must be in SECONDS
 */
async function createClioTimeEntry(accessToken, data) {
    try {
        const response = await axios_1.default.post(`${API_BASE_URL}/time_entries`, {
            description: data.description,
            duration: data.duration, // seconds
            matter_id: data.matter_id,
            billable: true,
        }, { headers: { Authorization: `Bearer ${accessToken}` } });
        return response.data;
    }
    catch (error) {
        logAxiosError(error, "Failed to create Clio time entry");
        throw error;
    }
}
/**
 * Fetch list of matters for logged-in user
 */
async function getClioMatters(accessToken) {
    try {
        const response = await axios_1.default.get(`${API_BASE_URL}/matters`, {
            headers: { Authorization: `Bearer ${accessToken}` },
        });
        return response.data;
    }
    catch (error) {
        logAxiosError(error, "Failed to fetch Clio matters");
        throw error;
    }
}
