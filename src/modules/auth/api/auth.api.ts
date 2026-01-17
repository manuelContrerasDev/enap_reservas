// src/modules/auth/api/auth.api.ts

import { http } from "@/shared/api/http";
import type {
  LoginResponse,
  RegisterResponse,
  MeResponse,
  ResendConfirmationResponse,
} from "../types/auth.types";

/**
 * AUTH API
 * Capa de transporte pura (HTTP)
 */
export const authApi = {
  login(email: string, password: string) {
    return http.post<LoginResponse>("/auth/login", { email, password });
  },

  register(name: string, email: string, password: string) {
    return http.post<RegisterResponse>("/auth/register", {
      name,
      email,
      password,
    });
  },

  me() {
    return http.get<MeResponse>("/auth/me");
  },

  confirmEmail(token: string) {
    return http.get("/auth/confirm", {
      params: { token },
    });
  },

  resetRequest(email: string) {
    return http.post("/auth/reset-request", { email });
  },

  checkReset(token: string) {
    return http.get("/auth/check-reset", {
      params: { token },
    });
  },

  resetPassword(token: string, newPassword: string) {
    return http.post("/auth/reset-password", {
      token,
      newPassword, // nombre EXACTO backend
    });
  },

  resendConfirmation(email: string) {
    return http.post<ResendConfirmationResponse>(
      "/auth/resend-confirmation",
      { email }
    );
  },
};
