// lib/tokenManager.ts
export const TokenManager = {
  setTokens(tokens: {
    access_token: string;
    refresh_token: string;
    token_type: string;
  }) {
    localStorage.setItem("access_token", JSON.stringify(tokens.access_token));
    localStorage.setItem("refresh_token", JSON.stringify(tokens.refresh_token));
    localStorage.setItem("token_type", JSON.stringify(tokens.token_type));
  },

  getAccessToken() {
    return JSON.parse(localStorage.getItem("access_token") || "null");
  },

  getRefreshToken() {
    return JSON.parse(localStorage.getItem("refresh_token") || "null");
  },

  clearTokens() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_type");
  },
};
