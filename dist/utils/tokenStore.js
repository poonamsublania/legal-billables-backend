"use strict";
// src/utils/tokenStore.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoredTokens = exports.clearClioToken = exports.getClioToken = exports.setClioToken = void 0;
// Store the full Clio token response (access + refresh + expiry)
let clioToken = null;
const setClioToken = (token) => {
    clioToken = token;
};
exports.setClioToken = setClioToken;
const getClioToken = () => {
    return clioToken;
};
exports.getClioToken = getClioToken;
const clearClioToken = () => {
    clioToken = null;
};
exports.clearClioToken = clearClioToken;
// ✅ Alias export so older code using getStoredTokens still works
exports.getStoredTokens = exports.getClioToken;
