import axios, {
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from "axios";
import { tokenExtractor } from "@/lib/utils";
import { toast } from "sonner";

const handleSignOut = () => {
  if (typeof window === "undefined") return;
  if (window.location.pathname === "/signin") return;

  localStorage.removeItem("whoami");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("token_type");

  window.location.href = "/signin";
};

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (
      e.key === "access_token" ||
      e.key === "refresh_token" ||
      e.key === "token_type"
    ) {
      const token = tokenExtractor();
      if (!token) handleSignOut();
    }
  });
}

export const baseURL =
  process.env.NODE_ENV === "production"
    ? process.env.NEXT_PUBLIC_PRODUCTION_API_BASE_URL
    : process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL;

const axiosInstance = axios.create({ baseURL });

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenExtractor();
    if (token?.authHeader) {
      config.headers.Authorization = token.authHeader;
    }
    if (!(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// axiosInstance.interceptors.response.use(
//   (response: AxiosResponse) => response,
//   (error: AxiosError) => {
//     const status = error.response?.status;

//     if (status === 401 || status === 403) {
//       handleSignOut();
//       toast.error(
//         status === 401
//           ? "Your session has expired. Please sign in again."
//           : "You don't have permission to access this resource.",
//       );
//       return Promise.reject(error);
//     }
//     const errorMessage =
//     //@ts-ignore
//       error.response?.data?.message ||
//       error.message ||
//       "An unexpected error occurred";
//     if (status !== 401 && status !== 403) {
//       toast.error(errorMessage);
//     }

//     return Promise.reject(error);
//   },
// );

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const errorMessage =
      (error.response?.data as any)?.message ||
      error.message ||
      "An unexpected error occurred";

    // Only log out for authentication issues
    const isAuthenticationError =
      status === 401 ||
      errorMessage.toLowerCase().includes("unauthenticated") ||
      errorMessage.toLowerCase().includes("token expired") ||
      errorMessage.toLowerCase().includes("invalid token") ||
      errorMessage.toLowerCase().includes("token is invalid");

    if (isAuthenticationError) {
      // Get current path
      const currentPath = window.location.pathname;

      // Check if the path matches /campaign/:id pattern
      const isCampaignIdPage = /^\/guests\/campaign\/[^/]+$/.test(currentPath);

      // Only logout if not on a /campaign/{id} page
      if (!isCampaignIdPage) {
        handleSignOut();
        //toast.error("Your session has expired. Please sign in again.");
      }
      return Promise.reject(error);
    }

    // For all other errors (including 403/permission issues), just show the error message
    // toast.error(errorMessage);
    return Promise.reject(error);
  }
);

export default axiosInstance;
