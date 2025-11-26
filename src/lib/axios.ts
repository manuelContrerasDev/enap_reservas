// src/lib/axios.ts
import axios from "axios";

export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: false,
});

// ==========================================================
// 🔐 Interceptor universal compatible con TODAS las versiones
// ==========================================================
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // Previene errores TS: aseguramos headers
    if (!config.headers) {
      config.headers = {};
    }

    if (token) {
      (config.headers as any)["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);
