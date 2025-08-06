// src/utils/tokenStore.ts

let clioToken: string | null = null;

export const setClioToken = (token: string) => {
  clioToken = token;
};

export const getClioToken = (): string | null => {
  return clioToken;
};

export const clearClioToken = () => {
  clioToken = null;
};
