"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClioToken = exports.refreshClioToken = exports.saveOrUpdateClioToken = void 0;
const axios_1 = __importDefault(require("axios"));
const clioToken_1 = __importDefault(require("../models/clioToken"));
/**
 * Save OR Update Token
 */
const saveOrUpdateClioToken = async (data) => {
    const expiresAt = new Date(Date.now() + data.expires_in * 1000);
    const saved = await clioToken_1.default.findOneAndUpdate({ _id: "singleton" }, {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt,
    }, { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log("✅ Clio token saved:", saved);
    return saved;
};
exports.saveOrUpdateClioToken = saveOrUpdateClioToken;
/**
 * Refresh Token
 */
const refreshClioToken = async () => {
    const tokenDoc = await clioToken_1.default.findById("singleton");
    if (!tokenDoc?.refreshToken)
        throw new Error("No refresh token stored");
    const form = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.CLIO_CLIENT_ID,
        client_secret: process.env.CLIO_CLIENT_SECRET,
        refresh_token: tokenDoc.refreshToken,
    });
    const response = await axios_1.default.post("https://app.clio.com/oauth/token", form, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });
    await (0, exports.saveOrUpdateClioToken)({
        access_token: response.data.access_token,
        refresh_token: response.data.refresh_token,
        expires_in: response.data.expires_in,
    });
    console.log("🔄 Token refreshed successfully");
    return response.data.access_token;
};
exports.refreshClioToken = refreshClioToken;
/** Debug — see token */
const getClioToken = async (req, res) => {
    const token = await clioToken_1.default.findById("singleton");
    res.json(token);
};
exports.getClioToken = getClioToken;
