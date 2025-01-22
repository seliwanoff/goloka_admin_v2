// components/auth/ProtectedRoute.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth"; // Your auth hook

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/signin?from=" + router.asPath);
    }
  }, [isLoading, isAuthenticated, router]);

  // Show loading state while checking auth
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Only render children if authenticated
  return isAuthenticated ? <>{children}</> : null;
}
