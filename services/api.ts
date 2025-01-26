// services/api.ts
import axios from "axios";
import { serverRoute, tokenExtractor } from "@/lib/utils";
import { toast } from "sonner";
import { userLogout } from "./auth";
import { TokenManager } from "@/lib/tokenManager";
import { useAuthStore } from "@/stores/authStore";

// Create axios instance with default config
export const api = axios.create({
  baseURL: serverRoute(""),
});

// Add request interceptor to attach token
api.interceptors.request.use((config) => {
  const tokenData = tokenExtractor();
  if (tokenData) {
    config.headers.Authorization = tokenData.authHeader;
  }
  return config;
});

// Add response interceptor to handle auth errors
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Handle auth errors (401, 403)
//     if (
//       (error.response?.status === 401 || error.response?.status === 403) &&
//       !originalRequest._retry
//     ) {
//       originalRequest._retry = true;

//       try {
//         // Try to refresh token
//         const refreshToken = JSON.parse(
//           localStorage.getItem("refresh_token") || ""
//         );
//         const response = await axios.post(serverRoute("refresh-token"), {
//           refresh_token: refreshToken,
//         });

//         const { access_token, token_type } = response.data;

//         // Update tokens
//         localStorage.setItem("access_token", JSON.stringify(access_token));
//         localStorage.setItem("token_type", JSON.stringify(token_type));

//         // Retry original request
//         originalRequest.headers.Authorization = `${token_type} ${access_token}`;
//         return api(originalRequest);
//       } catch (refreshError) {
//         // If refresh fails, logout user
//         handleLogout();
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = TokenManager.getRefreshToken();

        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(serverRoute("refresh-token"), {
          refresh_token: refreshToken,
        });

        const { access_token, refresh_token, token_type } = response.data;

        // Update tokens
        TokenManager.setTokens({
          access_token,
          refresh_token,
          token_type,
        });

        // Update auth store
        useAuthStore.getState().setAuthenticated(true);

        // Retry original request
        originalRequest.headers.Authorization = `${token_type} ${access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Force logout
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Centralized logout function
export const handleLogout = async () => {
  try {
    await userLogout();
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("token_type");
    window.location.href = "/signin";
    toast.error("Session expired. Please login again.");
  }
};
