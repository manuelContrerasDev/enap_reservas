// src/context/auth/helpers/auth.role.ts
import type { TarifaPerfil, UserRole } from "../types/auth.types";

export function getTarifaPerfil(role: UserRole | null): TarifaPerfil {
  if (role === "EXTERNO") return "EXTERNO";
  return "SOCIO"; // ADMIN = SOCIO por defecto
}

export function isAdmin(role: UserRole | null) {
  return role === "ADMIN";
}

export function isSocio(role: UserRole | null) {
  return role === "SOCIO";
}

export function isExterno(role: UserRole | null) {
  return role === "EXTERNO";
}
