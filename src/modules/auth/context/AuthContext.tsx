// src/modules/auth/context/AuthContext.tsx

import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import type { User, UserRole, LoginResult } from "../types/auth.types";

import { authApi } from "../api/auth.api";
import { authStorage } from "../helpers/auth.storage";
import { normalizeUser } from "../helpers/auth.normalizers";
import { getTarifaPerfil, isAdmin, isSocio, isExterno } from "../helpers/auth.role";
import { AuthErrorCode } from "../types/auth.errors";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  role: UserRole | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  isAdmin: boolean;
  isSocio: boolean;
  isExterno: boolean;
  tarifaPerfil: "SOCIO" | "EXTERNO";

  login: (email: string, password: string) => Promise<LoginResult>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: AuthErrorCode }>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveSession = (u: User, t: string) => {
    setUser(u);
    setToken(t);
    authStorage.save(u, t);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    authStorage.clear();
  };

  /**
   * BOOTSTRAP — carga sesión local
   */
  useEffect(() => {
    const stored = authStorage.load();
    if (stored?.token) {
      setUser(normalizeUser(stored.user));
      setToken(stored.token);
    }
    setIsLoading(false);
  }, []);

  /**
   * VALIDAR TOKEN (/auth/me)
   */
  useEffect(() => {
    if (!token) return;

    const validate = async () => {
      try {
        const res = await authApi.me();
        if (!res.data.ok) {
          logout();
          return;
        }
        setUser(normalizeUser(res.data.user));
      } catch {
        logout();
      }
    };

    validate();
  }, [token]);

  /**
   * LOGIN
   */
  const login = async (
    email: string,
    password: string
  ): Promise<LoginResult> => {
    try {
      const res = await authApi.login(email, password);

      if (!res.data.ok) {
        logout(); // limpieza defensiva
        return { ok: false, error: res.data.error };
      }

      const u = normalizeUser(res.data.user);
      saveSession(u, res.data.token);

      return { ok: true, user: u };
    } catch {
      logout();
      return { ok: false, error: AuthErrorCode.CONNECTION_ERROR };
    }
  };

  /**
   * REGISTER
   */
  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await authApi.register(name, email, password);

      if (!res.data.ok) {
        return { ok: false, error: res.data.error };
      }

      return { ok: true };
    } catch {
      return { ok: false, error: AuthErrorCode.CONNECTION_ERROR };
    }
  };

  const role = user?.role ?? null;

  const value = useMemo(
    () => ({
      user,
      token,
      role,
      isAuthenticated: !!user && !!token,
      isLoading,
      isAdmin: isAdmin(role),
      isSocio: isSocio(role),
      isExterno: isExterno(role),
      tarifaPerfil: getTarifaPerfil(role),
      login,
      register,
      logout,
    }),
    [user, token, role, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
