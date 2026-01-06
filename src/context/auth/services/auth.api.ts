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

/* ============================================================
 * 🔐 NORMALIZADOR DE ERRORES LOGIN
 * ============================================================ */
function mapLoginError(message?: string, code?: string): string {
  if (code) return code;

  if (!message) return "UNKNOWN_ERROR";

  const msg = message.toLowerCase();

  if (msg.includes("no registrado")) return "USER_NOT_FOUND";
  if (msg.includes("contraseña")) return "INVALID_PASSWORD";
  if (msg.includes("no está confirmado")) return "EMAIL_NOT_CONFIRMED";

  return "UNKNOWN_ERROR";
}

export const authApi = {
  /* ============================================================
   * LOGIN
   * ============================================================ */
  async login(email: string, password: string): Promise<LoginResult> {
    try {
      const resp = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const data = resp.data;

      if (data.ok && data.user && data.token) {
        const user: User = normalizeUser(data.user);
        return { ok: true, user, token: data.token };
      }

      return {
        ok: false,
        error: mapLoginError(data.message, data.code),
      };
    } catch (err: any) {
      return {
        ok: false,
        error: mapLoginError(
          err.response?.data?.message,
          err.response?.data?.code
        ),
      };
    }
  },

  /* ============================================================
   * REGISTER
   * ============================================================ */
  async register(
    name: string,
    email: string,
    password: string
  ): Promise<RegisterResult> {
    try {
      const resp = await api.post<RegisterResponse>("/auth/register", {
        name,
        email,
        password,
      });

      const data = resp.data;

      if (data.ok) return { ok: true, message: data.message };

      return { ok: false, error: data.code || data.message };
    } catch (err: any) {
      return {
        ok: false,
        error: err.response?.data?.code || "CONNECTION_ERROR",
      };
    }
  },

  /* ============================================================
   * ME
   * ============================================================ */
  async me(): Promise<User | null> {
    try {
      const resp = await api.get<MeResponse>("/auth/me");
      if (resp.data.ok && resp.data.user) {
        return normalizeUser(resp.data.user);
      }
      return null;
    } catch {
      return null;
    }
  },
};
