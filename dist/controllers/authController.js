"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleClioCallback = exports.redirectToClioLogin = void 0;
const axios_1 = __importDefault(require("axios"));
const redirectToClioLogin = (req, res) => {
    const authURL = `https://app.clio.com/oauth/authorize?response_type=code&client_id=${process.env.CLIO_CLIENT_ID}&redirect_uri=${process.env.CLIO_REDIRECT_URI}&scope=read%20write`;
    res.redirect(authURL);
};
exports.redirectToClioLogin = redirectToClioLogin;
const handleClioCallback = async (req, res) => {
    const code = req.query.code;
    try {
        const tokenResponse = await axios_1.default.post('https://app.clio.com/oauth/token', {
            grant_type: 'authorization_code',
            client_id: process.env.CLIO_CLIENT_ID,
            client_secret: process.env.CLIO_CLIENT_SECRET,
            redirect_uri: process.env.CLIO_REDIRECT_URI,
            code,
        });
        const { access_token, refresh_token, expires_in } = tokenResponse.data;
        // TODO: Store these tokens in DB/session (based on your auth system)
        console.log("Access Token:", access_token);
        res.send("✅ Clio authorization successful! You may now close this tab.");
    }
    catch (error) {
        console.error("Clio token exchange failed", error?.response?.data || error.message);
        res.status(500).send("❌ Clio OAuth failed.");
    }
};
exports.handleClioCallback = handleClioCallback;
