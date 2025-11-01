import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usuarios } from "../data/mock";

/** 🎯 Tipos base */
type UserRole = "socio" | "admin";

interface AuthContextType {
  userRole: UserRole | null;
  userName: string | null;
  login: (nombre: string, password: string) => boolean;
  logout: () => void;
}

/** 🧱 Contexto */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/** 🧩 Proveedor del contexto */
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userName, setUserName] = useState<string | null>(null);

  /** 🔁 Cargar sesión previa al iniciar */
  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const storedName = localStorage.getItem("userName");

    if (storedRole && storedName) {
      setUserRole(storedRole as UserRole);
      setUserName(storedName);
    }
  }, []);

  /** 🌐 Sincronizar entre pestañas */
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "userRole" || event.key === "userName") {
        const storedRole = localStorage.getItem("userRole");
        const storedName = localStorage.getItem("userName");

        // Si se eliminan los datos en otra pestaña, cerrar sesión localmente
        if (!storedRole || !storedName) {
          setUserRole(null);
          setUserName(null);
        } else {
          setUserRole(storedRole as UserRole);
          setUserName(storedName);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  /** 🔐 Login simulado (usuarios mock) */
  const login = (nombre: string, password: string): boolean => {
    const user = usuarios.find(
      (u) =>
        u.nombre.toLowerCase() === nombre.toLowerCase() &&
        u.password === password
    );

    if (user) {
      setUserRole(user.rol);
      setUserName(user.nombre);
      localStorage.setItem("userRole", user.rol);
      localStorage.setItem("userName", user.nombre);
      return true;
    }

    return false;
  };

  /** 🚪 Logout limpio */
  const logout = (): void => {
    setUserRole(null);
    setUserName(null);
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
  };

  return (
    <AuthContext.Provider value={{ userRole, userName, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

/** 🚀 Hook seguro y tipado */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un <AuthProvider>");
  }
  return context;
};
