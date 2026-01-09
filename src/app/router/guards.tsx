import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth/useAuth";
import LoaderScreen from "@/components/ui/loaders/LoaderScreen";
import { PATHS } from "./paths";

/* ============================================================
 * 🔐 Protected Route
 * ============================================================ */
export const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoaderScreen />;
  if (!user) return <Navigate to={PATHS.AUTH_LOGIN} replace />;

  return <Outlet />;
};

/* ============================================================
 * 👤 Redirect por Rol
 * ============================================================ */
export const RoleRedirect: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to={PATHS.AUTH_LOGIN} replace />;

  switch (user.role) {
    case "ADMIN":
      return <Navigate to={PATHS.ADMIN_HOME} replace />;
    case "SOCIO":
    case "EXTERNO":
      return <Navigate to={PATHS.SOCIO_HOME} replace />;
    default:
      return <Navigate to={PATHS.AUTH_LOGIN} replace />;
  }
};
