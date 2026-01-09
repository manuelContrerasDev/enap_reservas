// src/context/auth/services/auth.api.ts
import { http, HttpError } from "@/shared/api/http";
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
      const data = await http<LoginResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        auth: false, // 👈 login NO requiere token
      });

      if (data.ok && data.user && data.token) {
        const user: User = normalizeUser(data.user);
        return { ok: true, user, token: data.token };
      }

      return {
        ok: false,
        error: mapLoginError(data.message, data.code),
      };
    } catch (err) {
      if (err instanceof HttpError) {
        return {
          ok: false,
          error: mapLoginError(
            (err.data as any)?.message,
            (err.data as any)?.code
          ),
        };
      }

      return { ok: false, error: "CONNECTION_ERROR" };
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
      const data = await http<RegisterResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        auth: false,
      });

      if (data.ok) return { ok: true, message: data.message };

      return { ok: false, error: data.code || data.message };
    } catch (err) {
      if (err instanceof HttpError) {
        return {
          ok: false,
          error:
            (err.data as any)?.code ||
            (err.data as any)?.message ||
            "CONNECTION_ERROR",
        };
      }

      return { ok: false, error: "CONNECTION_ERROR" };
    }
  },

  /* ============================================================
   * ME
   * ============================================================ */
  async me(): Promise<User | null> {
    try {
      const data = await http<MeResponse>("/api/auth/me");
      if (data.ok && data.user) {
        return normalizeUser(data.user);
      }
      return null;
    } catch {
      return null;
    }
  },
};
