// components/SessionProvider.js
"use client";
import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function SessionProvider({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const alertShownRef = useRef(false);
  const checkIntervalRef = useRef(null);
  const originalFetchRef = useRef(null);

  useEffect(() => {
    // Reset alert flag on route change
    alertShownRef.current = false;

    // Public routes where session should NOT be checked
    const publicRoutes = [
      "/",
      "/login",
      "/signup",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
    ];

    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isPublicRoute) {
      console.log("Public route detected, skipping session check:", pathname);
      return; // Don't check session on public routes
    }

    console.log("Protected route detected, enabling session check:", pathname);

    // Check token validity
    const checkSession = () => {
      const token = localStorage.getItem("access_token");

      if (!token && !alertShownRef.current) {
        alertShownRef.current = true;
        alert("Your session has expired. Please login again.");
        localStorage.clear();
        router.push("/login");
      }
    };

    // Check immediately
    checkSession();

    // Check every 30 seconds
    checkIntervalRef.current = setInterval(checkSession, 30000);

    // Global fetch interceptor for 401 errors
    if (!originalFetchRef.current) {
      originalFetchRef.current = window.fetch;
    }

    window.fetch = async function (...args) {
      try {
        const response = await originalFetchRef.current(...args);

        // Clone response to read status without consuming it
        const clonedResponse = response.clone();

        // Check for 401 on any API call (except login/signup)
        const url = args[0]?.toString() || "";
        const isAuthEndpoint =
          url.includes("/auth/login") ||
          url.includes("/auth/signup") ||
          url.includes("/auth/register");

        if (
          clonedResponse.status === 401 &&
          !alertShownRef.current &&
          !isAuthEndpoint
        ) {
          alertShownRef.current = true;
          alert("Your session has expired. Please login again.");
          localStorage.clear();
          router.push("/login");
        }

        return response;
      } catch (error) {
        throw error;
      }
    };

    // Cleanup
    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (originalFetchRef.current) {
        window.fetch = originalFetchRef.current;
      }
    };
  }, [pathname, router]);

  return <>{children}</>;
}
