"use client";
import Swal from "sweetalert2";
export function createApiFetch(router) {
  return async function apiFetch(url, options = {}) {
    const token = localStorage.getItem("access_token");

    // Don't set Content-Type if body is FormData
    const isFormData = options.body instanceof FormData;

    const headers = {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Token expire ho gaya? Seedha login par bhejo
    if (response.status === 401 || response.status === 403) {
      localStorage.removeItem("access_token");
      const errorMessage = "session expired login again";
      Swal.fire({
        icon: "error",
        title: errorMessage,
        confirmButtonColor: "#3085d6",
        timer: 2000,
      });
      window.location.href = "/login"; // Hard redirect use karo
      return null; // Response return karo
    }

    return response;
  };
}
