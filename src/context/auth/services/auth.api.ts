// src/context/auth/services/auth.api.ts
import { api } from "@/lib/axios";
import {
  LoginResponse,
  RegisterResponse,
  LoginResult,
  RegisterResult,
  MeResponse,
  User,
} from "../types/auth.types";
import { normalizeUser } from "../helpers/auth.normalizers";

export const authApi = {
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      const resp = await api.post<LoginResponse>("/auth/login", { email, password });
      const data = resp.data;

      if (data.ok && data.user && data.token) {
        const user: User = normalizeUser(data.user);
        return { ok: true, user, token: data.token } as any;
      }

      return { ok: false, error: data.code || "UNKNOWN_ERROR" };
    } catch (err: any) {
      return { ok: false, error: err.response?.data?.code || "CONNECTION_ERROR" };
    }
  },

  async register(name: string, email: string, password: string): Promise<RegisterResult> {
    try {
      const resp = await api.post<RegisterResponse>("/auth/register", { name, email, password });
      const data = resp.data;

      if (data.ok) return { ok: true, message: data.message };

      return { ok: false, error: data.code || data.message };
    } catch (err: any) {
      return { ok: false, error: err.response?.data?.code || "CONNECTION_ERROR" };
    }
  },

  async me(): Promise<User | null> {
    try {
      const resp = await api.get<MeResponse>("/auth/me");
      if (resp.data.ok && resp.data.user) return normalizeUser(resp.data.user);
      return null;
    } catch {
      return null;
    }
  },
};
