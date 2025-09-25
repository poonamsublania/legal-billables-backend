"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleClioCallback = exports.redirectToClioLogin = void 0;
const axios_1 = __importDefault(require("axios"));
const clioToken_1 = __importDefault(require("../models/clioToken"));
// Redirect to Clio login
const redirectToClioLogin = (req, res) => {
    const authURL = `https://app.clio.com/oauth/authorize?response_type=code&client_id=${process.env.CLIO_CLIENT_ID}&redirect_uri=${process.env.CLIO_REDIRECT_URI}&scope=read write openid profile email`;
    console.log("🌍 Redirecting to Clio:", authURL);
    res.redirect(authURL);
};
exports.redirectToClioLogin = redirectToClioLogin;
// Handle Clio callback
const handleClioCallback = async (req, res) => {
    const code = req.query.code;
    if (!code)
        return res.status(400).send("❌ Missing Clio OAuth code");
    try {
        // Exchange code for access token (use x-www-form-urlencoded)
        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("client_id", process.env.CLIO_CLIENT_ID);
        params.append("client_secret", process.env.CLIO_CLIENT_SECRET);
        params.append("redirect_uri", process.env.CLIO_REDIRECT_URI);
        params.append("code", code);
        const response = await axios_1.default.post("https://app.clio.com/oauth/token", params, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        const { access_token, refresh_token, expires_in } = response.data;
        // Save token in MongoDB
        const savedToken = await clioToken_1.default.findOneAndUpdate({ _id: "singleton" }, {
            clioAccessToken: access_token,
            clioRefreshToken: refresh_token,
            clioTokenExpiry: Date.now() + expires_in * 1000,
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
        console.log("✅ Clio token saved:", savedToken);
        res.send("✅ Clio authentication successful! You can now log time entries.");
    }
    catch (err) {
        console.error("❌ Clio token exchange failed:", err?.response?.data || err.message);
        res.status(500).send("❌ Clio OAuth failed.");
    }
};
exports.handleClioCallback = handleClioCallback;
