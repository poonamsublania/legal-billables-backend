// src/utils/tokenStore.ts

// Store the full Clio token response (access + refresh + expiry)
let clioToken: any | null = null;

export const setClioToken = (token: any) => {
  clioToken = token;
};

export const getClioToken = (): any | null => {
  return clioToken;
};

export const clearClioToken = () => {
  clioToken = null;
};

// ✅ Alias export so older code using getStoredTokens still works
export const getStoredTokens = getClioToken;
