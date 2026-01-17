// src/context/auth/helpers/auth.normalizers.ts
import type { User, UserRole } from "../../../modules/auth/types/auth.types";

const VALID_ROLES: UserRole[] = ["ADMIN", "SOCIO", "EXTERNO"];

/**
 * Normaliza el rol recibido desde backend.
 * - Protege contra null / undefined
 * - Protege contra valores inesperados
 * - Mantiene comportamiento actual (fallback a SOCIO)
 */
export function normalizeRole(role: unknown): UserRole {
  const value = String(role ?? "").toUpperCase();

  if (VALID_ROLES.includes(value as UserRole)) {
    return value as UserRole;
  }

  // Fallback seguro por negocio ENAP
  return "SOCIO";
}

/**
 * Normaliza el usuario recibido desde backend.
 * Centraliza cualquier adaptación futura.
 */
export function normalizeUser(raw: any): User {
  return {
    ...raw,
    role: normalizeRole(raw?.role),
  };
}
