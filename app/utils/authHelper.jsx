// utils/authHelper.js
"use client";

let sessionExpiredShown = false;

export const handleSessionExpiry = (router) => {
  if (sessionExpiredShown) {
    return;
  }

  sessionExpiredShown = true;

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");

  alert("Your session has expired. Please login again.");

  router.push("/login");

  setTimeout(() => {
    sessionExpiredShown = false;
  }, 2000);
};

export const createAuthFetch = (router) => {
  return async (url, options = {}) => {
    try {
      const token = localStorage.getItem("access_token");

      if (!token) {
        handleSessionExpiry(router);
        throw new Error("No token found");
      }

      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 401) {
        handleSessionExpiry(router);
        throw new Error("Session expired");
      }

      return response;
    } catch (error) {
      if (
        error.message === "Session expired" ||
        error.message === "No token found"
      ) {
        throw error;
      }
      console.error("Fetch error:", error);
      throw error;
    }
  };
};
