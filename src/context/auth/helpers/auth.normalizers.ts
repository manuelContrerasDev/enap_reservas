// src/context/auth/helpers/auth.normalizers.ts
import type { User, UserRole } from "../types/auth.types";

export function normalizeRole(role: string): UserRole {
  return role.toUpperCase() as UserRole;
}

export function normalizeUser(raw: any): User {
  return {
    ...raw,
    role: normalizeRole(raw.role),
  };
}
