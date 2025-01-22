/* eslint-disable @typescript-eslint/no-unused-vars */
// hooks/useAuth.ts
import { useState, useEffect } from "react";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for auth token or session
    const checkAuth = async () => {
      try {
        // Your auth check logic here
        const token = localStorage.getItem("token");
        // Or check session/cookie
        setIsAuthenticated(!!token);
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isLoading };
}
