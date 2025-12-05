// src/context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/lib/axios";

export type UserRole = "ADMIN" | "SOCIO" | "EXTERNO";

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
}

// ============================
// Tipado seguro de respuesta
// ============================
interface LoginResponse {
  ok: boolean;
  message?: string;
  code?: string; // ←🔥 FIX
  token?: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

interface LoginResult {
  ok: boolean;
  error?: string;
  user?: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (email: string, password: string) => Promise<LoginResult>;
  logout: () => void;
}

interface MeResponse {
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

const STORAGE_TOKEN = "enap_token";
const STORAGE_USER = "enap_user";

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ======================================
  // Restaurar sesión inicial
  // ======================================
  useEffect(() => {
    try {
      const rawUser = localStorage.getItem(STORAGE_USER);
      const rawToken = localStorage.getItem(STORAGE_TOKEN);

      if (rawUser && rawToken) {
        const parsed = JSON.parse(rawUser);

        const normalizedUser: User = {
          ...parsed,
          role: (parsed.role || "").toUpperCase() as UserRole,
        };

        setUser(normalizedUser);
        setToken(rawToken);

        // Re-write por seguridad
        localStorage.setItem(STORAGE_USER, JSON.stringify(normalizedUser));
      }
    } catch (err) {
      console.error("[Auth] Error restaurando sesión:", err);
      localStorage.removeItem(STORAGE_USER);
      localStorage.removeItem(STORAGE_TOKEN);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ======================================
  // Validar token restaurado contra backend
  // ======================================
  useEffect(() => {
    const validateSession = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const resp = await api.get<MeResponse>("/auth/me");

        if (resp.data.ok && resp.data.user) {
          const normalized: User = {
            ...resp.data.user,
            role: resp.data.user.role.toUpperCase() as UserRole,
          };

          setUser(normalized);
          localStorage.setItem(STORAGE_USER, JSON.stringify(normalized));
        } else {
          clearSession();
        }
      } catch (err) {
        console.warn("[Auth] Token inválido. Limpiando sesión.");
        clearSession();
      } finally {
        setIsLoading(false);
      }
    };

    validateSession();
  }, [token]);



  // ======================================
  // Sync token → axios
  // ======================================
  useEffect(() => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  }, [token]);

  const role = user?.role ?? null;
  const isAuthenticated = !!user && !!token;

  // ======================================
  // Helpers de sesión
  // ======================================
  const saveSession = (user: User, token: string) => {
    const normalizedUser: User = {
      ...user,
      role: (user.role || "").toUpperCase() as UserRole,
    };

    setUser(normalizedUser);
    setToken(token);

    localStorage.setItem(STORAGE_USER, JSON.stringify(normalizedUser));
    localStorage.setItem(STORAGE_TOKEN, token);
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_USER);
    localStorage.removeItem(STORAGE_TOKEN);
  };

  const login = async (
    email: string,
    password: string
  ): Promise<LoginResult> => {
    setIsLoading(true);

    try {
      const resp = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const data = resp.data;

      // Caso éxito total
      if (data.ok && data.user && data.token) {
        const normalizedUser: User = {
          ...data.user,
          role: (data.user.role || "").toUpperCase() as UserRole,
        };

        saveSession(normalizedUser, data.token);
        setIsLoading(false);
        return { ok: true, user: normalizedUser };
      }

      // Caso error del backend — devolver code exacto
      setIsLoading(false);
      return {
        ok: false,
        error: data.code || "UNKNOWN_ERROR",
      };

    } catch (err: any) {
      setIsLoading(false);

      // Capturar errores Axios con respuesta backend
      if (err.response?.data?.code) {
        return { ok: false, error: err.response.data.code };
      }

      return { ok: false, error: "CONNECTION_ERROR" };
    }
  };

  const logout = () => clearSession();

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("AuthContext no disponible");
  return ctx;
};
