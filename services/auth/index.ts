/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosResponse } from "axios";
// import { serverRoute } from "@/lib/utils";
import { queryClient } from "@/components/layout/tanstackProvider";
import { postData, ServerResponse } from "@/lib/api";
import { UseQueryResult } from "@tanstack/react-query";
import { TokenManager } from "@/lib/tokenManager";
import { useAuthStore } from "@/stores/authStore";
import { api } from "../api";

// =============================================
// ======= user sign in  -->
// =============================================
// export const userSignIn = async (email: string, password: string) => {
//   return await queryClient.fetchQuery({
//     queryKey: ["user sign in"],
//     queryFn: async (): Promise<AxiosResponse<any> | null> => {
//       try {
//         const response = await axios.post(
//           serverRoute("login"),
//           {
//             email,
//             password,
//             platform: "web",
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//           },
//         );
//         console.log(response, "enduee");
//         return response?.data;
//       } catch (error) {
//         if (axios.isAxiosError(error)) {
//           console.error("Axios error during sign in:", error.message);
//           throw error;
//         } else {
//           console.error("Unexpected error during sign in:", error);
//           throw error;
//         }
//       }
//     },
//   });
// };
// services/auth.ts
export const userSignIn = async (email: string, password: string) => {
  try {
    const response = await api.post("/login", {
      email,
      password,
      platform: "web",
    });

    if (response.data) {
      const { access_token, refresh_token, token_type } = response.data;

      // Set tokens
      TokenManager.setTokens({
        access_token,
        refresh_token,
        token_type,
      });

      // Update auth store
      useAuthStore.getState().setAuthenticated(true);

      return response.data;
    }
  } catch (error) {
    // Handle login errors
    useAuthStore.getState().setAuthenticated(false);
    throw error;
  }
};

// =============================================
// ======= forgot password  -->
// =============================================
// Define the interface for the password reset data
interface PasswordResetData {
  email: string;
  otp: string;
  password: string;
  password_confirmation: string;
}

export const resetPassword = async (
  resetData: PasswordResetData
): Promise<UseQueryResult<AxiosResponse<any>>> =>
  await queryClient.fetchQuery({
    queryKey: ["ResetPassword"],
    queryFn: async () => {
      try {
        return await postData<ServerResponse<any>>(
          "/password/reset",
          resetData
        );
      } catch (error) {
        console.error("Error resetting password:", error);
        throw error;
      }
    },
  });

export const markTransactionAsPaid = async (
  id: string
): Promise<UseQueryResult<AxiosResponse<any>>> =>
  await queryClient.fetchQuery({
    queryKey: ["MarkAsPaid"],
    queryFn: async () => {
      try {
        return await postData<ServerResponse<any>>(
          `/transactions/${id}/mark-successful`
        );
      } catch (error) {
        console.error("Error marking transaction as paid:", error);
        throw error;
      }
    },
  });

export const userLogout = async () => {
  await queryClient.fetchQuery({
    queryKey: ["user logout"],
    queryFn: async () => {
      try {
        await postData<ServerResponse<any>>("/logout", { platform: "web" });
        // Clear tokens
        TokenManager.clearTokens();

        // Update auth store
        const authStore = useAuthStore.getState();
        authStore.setAuthenticated(false);
      } catch (error) {
        console.error("Error logging out:", error);
        // Clear tokens
        TokenManager.clearTokens();

        useAuthStore.getState().setAuthenticated(false);
        throw error;
      }
    },
  });
};
