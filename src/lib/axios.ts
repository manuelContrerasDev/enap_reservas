// src/lib/axios.ts
import axios from "axios";

const TOKEN_KEY = "enap_token";

// Normalizamos URL para evitar errores de concatenación
const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = API_BASE.endsWith("/")
  ? `${API_BASE}api`
  : `${API_BASE}/api`;

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

// ==========================================================
// 🔐 Interceptor universal (token siempre actualizado)
// ==========================================================
api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem(TOKEN_KEY)
        : null;

    if (!config.headers) {
      config.headers = {};
    }

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
