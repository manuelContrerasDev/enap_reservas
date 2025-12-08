import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/auth";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="p-10">Cargando sesión…</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return children;
}
