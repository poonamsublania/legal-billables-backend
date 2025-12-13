"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClioToken = exports.refreshClioToken = exports.saveOrUpdateClioToken = exports.clioCallback = exports.clioLogin = void 0;
const axios_1 = __importDefault(require("axios"));
const ClioToken_1 = __importDefault(require("../models/ClioToken"));
/**
 * STEP 1 — Redirect user to Clio OAuth Login
 */
const clioLogin = async (req, res) => {
    try {
        const { CLIO_CLIENT_ID, CLIO_REDIRECT_URI, CLIO_ENV } = process.env;
        if (!CLIO_CLIENT_ID || !CLIO_REDIRECT_URI) {
            return res.status(500).send("❌ Missing Clio environment variables");
        }
        const authBase = CLIO_ENV === "sandbox"
            ? "https://app-sandbox.clio.com/oauth/authorize"
            : "https://app.clio.com/oauth/authorize";
        const url = `${authBase}?response_type=code` +
            `&client_id=${CLIO_CLIENT_ID}` +
            `&redirect_uri=${encodeURIComponent(CLIO_REDIRECT_URI)}` +
            `&scope=openid%20email%20profile%20read%20write`;
        console.log("➡️ Redirecting to Clio OAuth:", url);
        return res.redirect(url);
    }
    catch (err) {
        console.error("❌ Clio Login Redirect Error:", err);
        res.status(500).send("OAuth Redirect Failed");
    }
};
exports.clioLogin = clioLogin;
/**
 * STEP 2 — Handle OAuth Callback
 */
const clioCallback = async (req, res) => {
    try {
        const code = req.query.code;
        if (!code)
            return res.status(400).send("❌ Missing OAuth code");
        console.log("⬅️ Received OAuth code:", code);
        const { CLIO_CLIENT_ID, CLIO_CLIENT_SECRET, CLIO_REDIRECT_URI, CLIO_ENV } = process.env;
        const tokenURL = CLIO_ENV === "sandbox"
            ? "https://app-sandbox.clio.com/oauth/token"
            : "https://app.clio.com/oauth/token";
        const form = new URLSearchParams({
            grant_type: "authorization_code",
            client_id: CLIO_CLIENT_ID,
            client_secret: CLIO_CLIENT_SECRET,
            redirect_uri: CLIO_REDIRECT_URI,
            code,
        });
        const response = await axios_1.default.post(tokenURL, form, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });
        const { access_token, refresh_token, expires_in } = response.data;
        await (0, exports.saveOrUpdateClioToken)({
            access_token,
            refresh_token,
            expires_in,
        });
        console.log("🎉 Clio OAuth Success! Token saved.");
        // Return HTML that updates the Chrome extension & closes popup
        return res.send(`
      <html>
        <body>
          <script>
            if (chrome && chrome.storage) {
              chrome.storage.local.set({ clioAccessToken: "${access_token}" }, () => {
                alert("Clio connected successfully!");
                window.close();
              });
            } else {
              alert("Clio connected successfully! You can close this window.");
            }
          </script>
        </body>
      </html>
    `);
    }
    catch (err) {
        console.error("❌ OAuth Callback Error:", err.response?.data || err.message);
        res.status(500).send("Clio OAuth Failed. Check logs.");
    }
};
exports.clioCallback = clioCallback;
/**
 * Save OR Update Tokens
 */
const saveOrUpdateClioToken = async (data) => {
    const expiresAt = new Date(Date.now() + data.expires_in * 1000);
    const saved = await ClioToken_1.default.findOneAndUpdate({ _id: "singleton" }, {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        expiresAt,
    }, { upsert: true, new: true, setDefaultsOnInsert: true });
    console.log("💾 Saved Clio token:", saved);
    return saved;
};
exports.saveOrUpdateClioToken = saveOrUpdateClioToken;
/**
 * Refresh Token
 */
const refreshClioToken = async () => {
    const tokenDoc = await ClioToken_1.default.findById("singleton");
    if (!tokenDoc?.refreshToken)
        throw new Error("❌ No refresh token stored");
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
    console.log("🔄 Clio token refreshed");
    return response.data.access_token;
};
exports.refreshClioToken = refreshClioToken;
/**
 * Get Saved Clio Token (debug)
 */
const getClioToken = async (req, res) => {
    const token = await ClioToken_1.default.findById("singleton");
    res.json(token);
};
exports.getClioToken = getClioToken;
