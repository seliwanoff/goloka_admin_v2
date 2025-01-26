/* eslint-disable @typescript-eslint/ban-ts-comment */
// stores/authStore.ts
import { handleLogout } from "@/services/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthStore {
  isAuthenticated: boolean;
  setAuthenticated: (status: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      setAuthenticated: (status) => set({ isAuthenticated: status }),
      logout: () => {
        set({ isAuthenticated: false });
        // Additional logout logic if needed
        handleLogout();
      },
    }),
    {
      name: "auth-storage",
      //@ts-ignore
      storage: typeof window !== "undefined" ? localStorage : undefined,
    }
  )
);
