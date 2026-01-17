// src/modules/auth/types/auth.types.ts

import type { AuthErrorCode } from "./auth.errors";

export type UserRole = "ADMIN" | "SOCIO" | "EXTERNO";

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
}

/**
 * RESPONSES — contrato HTTP con backend
 */
export type LoginResponse =
  | { ok: true; token: string; user: User }
  | { ok: false; error: AuthErrorCode };

export type RegisterResponse =
  | { ok: true }
  | { ok: false; error: AuthErrorCode };

  export type ResendConfirmationResponse =
  | { ok: true }
  | { ok: false; error: AuthErrorCode };


export type MeResponse =
  | {
      ok: true;
      user: {
        id: string;
        email: string;
        name: string | null;
        role: UserRole;
        createdAt: string;
        emailConfirmed: boolean;
      };
    }
  | { ok: false; error: AuthErrorCode };

/**
 * RESULTADOS INTERNOS (Context / Hooks)
 */
export type LoginResult =
  | { ok: true; user: User }
  | { ok: false; error: AuthErrorCode };

export type TarifaPerfil = "SOCIO" | "EXTERNO";
