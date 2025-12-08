// src/context/auth/helpers/auth.storage.ts
import type { User } from "../types/auth.types";
import { normalizeUser } from "./auth.normalizers";

const STORAGE_USER = "enap_user";
const STORAGE_TOKEN = "enap_token";

export const authStorage = {
  save(user: User, token: string) {
    localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_TOKEN, token);
  },

  load() {
    try {
      const rawUser = localStorage.getItem(STORAGE_USER);
      const rawToken = localStorage.getItem(STORAGE_TOKEN);

      if (!rawUser || !rawToken) return null;

      const user = normalizeUser(JSON.parse(rawUser));
      return { user, token: rawToken };
    } catch {
      return null;
    }
  },

  clear() {
    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem(STORAGE_TOKEN);
  },
};
