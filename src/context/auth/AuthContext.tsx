// src/context/auth/AuthContext.tsx
import { createContext, ReactNode, useEffect, useState } from "react";
import type {
  User,
  UserRole,
  LoginResult,
  RegisterResult,
} from "./types/auth.types";

import { authApi } from "./services/auth.api";
import { authStorage } from "./helpers/auth.storage";
import {
  getTarifaPerfil,
  isAdmin,
  isSocio,
  isExterno,
} from "./helpers/auth.role";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  role: UserRole | null;

  isAuthenticated: boolean;
  isLoading: boolean;

  // helpers de dominio
  isAdmin: boolean;
  isSocio: boolean;
  isExterno: boolean;
  tarifaPerfil: "SOCIO" | "EXTERNO";

  login: (email: string, password: string) => Promise<LoginResult>;
  register: (n: string, e: string, p: string) => Promise<RegisterResult>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /* ------------------------------------------------------------
   * Persistencia de sesión (DOMINIO, no infraestructura)
   * ------------------------------------------------------------ */
  const saveSession = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    authStorage.save(user, token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    authStorage.clear();
  };

  /* ------------------------------------------------------------
   * Restaurar sesión al cargar la app
   * ------------------------------------------------------------ */
  useEffect(() => {
    const stored = authStorage.load();
    if (stored) {
      setUser(stored.user);
      setToken(stored.token);
    }
    setIsLoading(false);
  }, []);

  /* ------------------------------------------------------------
   * Validar token contra backend (/auth/me)
   * ------------------------------------------------------------ */
  useEffect(() => {
    if (!token) return;

    const validate = async () => {
      try {
        const me = await authApi.me();
        if (!me) {
          logout();
        } else {
          setUser(me);
        }
      } catch {
        logout();
      }
    };

    validate();
  }, [token]);

  /* ------------------------------------------------------------
   * Auth actions
   * ------------------------------------------------------------ */
  const login = async (
    email: string,
    password: string
  ): Promise<LoginResult> => {
    const result = await authApi.login(email, password);

    if (result.ok && result.user && result.token) {
      saveSession(result.user, result.token);
    }

    return result;
  };

  const register = async (n: string, e: string, p: string) =>
    authApi.register(n, e, p);

  const role = user?.role ?? null;

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
