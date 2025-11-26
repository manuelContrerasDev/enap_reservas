import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";

const API_URL = import.meta.env.VITE_API_URL;

// ======================================================
// Tipos
// ======================================================
export type UserRole = "ADMIN" | "SOCIO" | "EXTERNO";

const roleLabels: Record<UserRole, string> = {
  ADMIN: "Administrador",
  SOCIO: "Socio",
  EXTERNO: "Invitado",
};

export interface User {
  id: string;
  name: string | null;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  role: UserRole | null;

  /** GETTERS derivados */
  userRole: UserRole;
  userName: string;

  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string; user?: User }>;

  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

// ======================================================
// Notificaciones seguras
// ======================================================
function notifySafe(message: string, type: "success" | "error" | "info") {
  try {
    const { useNotificacion } = require("./NotificacionContext");
    const ctx = useNotificacion();
    ctx.agregarNotificacion(message, type);
  } catch {
    // Para evitar crash si se llama fuera del árbol
  }
}

// ======================================================
// Provider
// ======================================================
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );
  const [role, setRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /** GETTERS derivados (evita null-checks en UI) */
  const userRole: UserRole = user?.role ?? "EXTERNO";
  const userName: string = user?.name ?? "";

  const isAuthenticated = !!token && !!user;

  // ======================================================
  // RESTORE SESSION → /auth/me
  // ======================================================
  useEffect(() => {
    const restore = async () => {
      try {
        if (!token) {
          setIsLoading(false);
          return;
        }

        const resp = await fetch(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await resp.json();

        if (!resp.ok || !data.ok || !data.user) {
          throw new Error("Sesión inválida");
        }

        setUser(data.user);
        setRole(data.user.role);
      } catch {
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    restore();
  }, [token]);

  // ======================================================
  // LOGIN
  // ======================================================
  const login = async (email: string, password: string) => {
    try {
      const resp = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();

      if (!resp.ok || !data.ok) {
        return { ok: false, error: data.message || "Credenciales inválidas" };
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);

      setUser(data.user);
      setRole(data.user.role);

      notifySafe("Bienvenido nuevamente", "success");

      return { ok: true, user: data.user };
    } catch {
      return { ok: false, error: "Error de red" };
    }
  };

  // ======================================================
  // LOGOUT
  // ======================================================
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setRole(null);

    notifySafe("Sesión finalizada", "info");
  };

  // ======================================================
  // Render
  // ======================================================
  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,

        /** Derivados listos para UI */
        userRole,
        userName,

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

// ======================================================
// Hook público
// ======================================================
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro del AuthProvider");
  return ctx;
};
