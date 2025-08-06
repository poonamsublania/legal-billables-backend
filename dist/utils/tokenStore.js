"use strict";
// src/utils/tokenStore.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearClioToken = exports.getClioToken = exports.setClioToken = void 0;
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
