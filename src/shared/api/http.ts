// src/shared/api/http.ts
import axios from "axios";

const TOKEN_KEY = "enap_token";

const API_BASE = import.meta.env.VITE_API_URL;
const BASE_URL = API_BASE.endsWith("/")
  ? `${API_BASE}api`
  : `${API_BASE}/api`;

export const http = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    return config;
  },
  (error) => Promise.reject(error)
);
