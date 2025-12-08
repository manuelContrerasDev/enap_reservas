// src/context/auth/types/auth.types.ts
export type UserRole = "ADMIN" | "SOCIO" | "EXTERNO";

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
}

export interface LoginResponse {
  ok: boolean;
  message?: string;
  code?: string;
  token?: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

export interface RegisterResponse {
  ok: boolean;
  message?: string;
  code?: string;
}

export interface MeResponse {
  ok: boolean;
  user?: {
    id: string;
    email: string;
    name: string | null;
    role: string;
    createdAt: string;
    emailConfirmed: boolean;
  };
}

export interface LoginResult {
  ok: boolean;
  error?: string;
  user?: User;
  token?: string;
}

export interface RegisterResult {
  ok: boolean;
  error?: string;
  message?: string;
}

export type TarifaPerfil = "SOCIO" | "EXTERNO";
