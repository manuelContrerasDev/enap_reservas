import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/modules/auth/hooks/useAuth";
import LoaderScreen from "@/shared/ui/loaders/LoaderScreen";
import { PATHS } from "./paths";

export const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoaderScreen />;
  if (!isAuthenticated) return <Navigate to={PATHS.AUTH_LOGIN} replace />;

  return <Outlet />;
};

export const RoleRedirect: React.FC = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) return <Navigate to={PATHS.AUTH_LOGIN} replace />;

  switch (user.role) {
    case "ADMIN":
      return <Navigate to={PATHS.ADMIN_HOME} replace />;
    case "SOCIO":
    case "EXTERNO":
      return <Navigate to={PATHS.SOCIO_HOME} replace />;
    default:
      console.warn("Rol desconocido:", user.role);
      return <Navigate to={PATHS.AUTH_LOGIN} replace />;
      }
};
