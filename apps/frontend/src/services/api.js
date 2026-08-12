import axios from "axios";
import { env } from "../config/env.js";
import { loadSession, clearSession } from "../utils/storage.js";

// Single Axios instance shared by every *.service.js file.
// Do not create additional axios instances elsewhere.
export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach the current session token (if any) to every outgoing request.
api.interceptors.request.use((config) => {
  const session = loadSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

// A listener the AuthContext registers so this module can trigger a
// logout without importing React context logic directly (keeps the
// service layer framework-agnostic).
let onSessionExpired = null;
export function registerSessionExpiredHandler(handler) {
  onSessionExpired = handler;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      clearSession();
      if (typeof onSessionExpired === "function") {
        onSessionExpired();
      }
    }

    // Normalize error shape so calling code can rely on `error.message`
    // and an optional `error.details` regardless of backend response shape.
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unexpected network error";

    return Promise.reject({
      message,
      status: status ?? null,
      details: error?.response?.data ?? null,
      original: error,
    });
  }
);

export default api;
