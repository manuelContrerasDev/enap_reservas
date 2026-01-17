import type { User } from "../types/auth.types";

const STORAGE_USER = "enap_user";
const STORAGE_TOKEN = "enap_token";

export const authStorage = {
  save(user: User, token: string) {
    localStorage.setItem(STORAGE_USER, JSON.stringify(user));
    localStorage.setItem(STORAGE_TOKEN, token);
  },

  load(): { user: User; token: string } | null {
    try {
      const rawUser = localStorage.getItem(STORAGE_USER);
      const rawToken = localStorage.getItem(STORAGE_TOKEN);
      if (!rawUser || !rawToken) return null;

      const user = JSON.parse(rawUser) as User;
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
