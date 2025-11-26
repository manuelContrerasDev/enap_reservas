// src/App.tsx
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { PATHS } from "./routes/paths";

import ErrorBoundary from "./components/common/ErrorBoundary";
import LoaderScreen from "./components/ui/LoaderScreen";
import Loader from "./components/ui/Loader";
import LayoutBase from "./components/layout/LayoutBase";
import ConfirmEmailPage from "./pages/auth/ConfirmEmailPage";
import EspacioDetallePage from "@/pages/socio/EspacioDetallePage";

// Auth
const LoginPro = lazy(() => import("./pages/auth/LoginPage"));
const RegisterPro = lazy(() => import("./pages/auth/RegisterPage"));
const ResetRequestPage = lazy(() => import("./pages/auth/ResetRequestPage"));
const ResetConfirmPage = lazy(() => import("./pages/auth/ResetConfirmPage"));

// Socio / externo
const EspaciosPage = lazy(() => import("./pages/socio/EspaciosPage"));
const ReservaForm = lazy(() => import("./pages/socio/ReservaFormPage"));
const PagoPage = lazy(() => import("./pages/pago/PagoPage"));
const WebpayRetornoPage = lazy(() => import("./pages/pago/RetornoWebpayPage"));
const PagoResultadoPage = lazy(() => import("./pages/pago/PagoResultadoPage"));
const ReservaPreviewPage = lazy(() =>
  import("./pages/socio/ReservaPreviewPage")
);


// Admin
const AdminPage = lazy(() => import("./pages/admin/AdminReservasPage"));
const AdminEspaciosPage = lazy(() => import("./pages/admin/AdminEspaciosPage"));
const TesoreriaPage = lazy(() => import("./pages/admin/TesoreriaPage"));

const NotFoundPage = lazy(() => import("./pages/errors/NotFoundPage"));

/* =========================================================================
 * 🌐 App principal
 * ========================================================================= */
const SPLASH_MS = 1200;

// ===========================================================
// ✅ ProtectedRoute — Versión segura
// ===========================================================
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { role, isLoading } = useAuth();

  if (isLoading) return <LoaderScreen />;

  const isAuthenticated = !!role;

  return isAuthenticated ? <>{children}</> : <Navigate to={PATHS.AUTH_LOGIN} replace />;
};

// ===========================================================
// ✅ RequiredRoleRoute — Versión segura
// ===========================================================
const RequiredRoleRoute: React.FC<{
  role: ("ADMIN" | "SOCIO" | "EXTERNO")[];
  children: React.ReactNode;
}> = ({ role, children }) => {
  const { role: userRole, isLoading } = useAuth();

  if (isLoading) return <LoaderScreen />;

  const isAuthenticated = !!userRole;
  const hasPermission = isAuthenticated && role.includes(userRole);

  if (!isAuthenticated) {
    return <Navigate to={PATHS.AUTH_LOGIN} replace />;
  }

  if (!hasPermission) {
    return (
      <Navigate to={userRole === "ADMIN" ? PATHS.ADMIN : PATHS.ESPACIOS} replace />
    );
  }

  return <>{children}</>;
};

// ===========================================================
// APP
// ===========================================================
const App: React.FC = () => {
  const { role } = useAuth();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  if (showSplash) return <LoaderScreen />;

  return (
    <ErrorBoundary>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* PÚBLICO */}
          <Route path={PATHS.AUTH_LOGIN} element={<LoginPro />} />
          <Route path={PATHS.AUTH_REGISTER} element={<RegisterPro />} />
          <Route path={PATHS.AUTH_RESET_REQUEST} element={<ResetRequestPage />} />
          <Route path={PATHS.AUTH_RESET_CONFIRM} element={<ResetConfirmPage />} />
          <Route path="/espacios/:id" element={<EspacioDetallePage />} />

          {/* CONFIRMACIÓN */}
          <Route path="/auth/confirm" element={<ConfirmEmailPage />} />

          {/* WEBPAY */}
          <Route path="/pago/webpay/retorno" element={<WebpayRetornoPage />} />
          <Route path={PATHS.PAGO_WEBPAY_FINAL} element={<PagoResultadoPage />} />

          {/* PROTEGIDO */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LayoutBase />
              </ProtectedRoute>
            }
          >
            <Route
              index
              element={
                role === "ADMIN"
                  ? <Navigate to={PATHS.ADMIN} replace />
                  : <Navigate to={PATHS.ESPACIOS} replace />
              }
            />

            {/* SOCIO / EXTERNO */}
            <Route
              path="espacios"
              element={
                <RequiredRoleRoute role={["SOCIO", "EXTERNO"]}>
                  <EspaciosPage />
                </RequiredRoleRoute>
              }
            />

            <Route
              path="reserva"
              element={
                <RequiredRoleRoute role={["SOCIO", "EXTERNO"]}>
                  <ReservaForm />
                </RequiredRoleRoute>
              }
            />

            <Route
              path="reservar/:id"
              element={
                <RequiredRoleRoute role={["SOCIO", "EXTERNO"]}>
                  <ReservaForm />
                </RequiredRoleRoute>
              }
            />

            <Route
              path="reserva/preview"
              element={
                <RequiredRoleRoute role={["SOCIO", "EXTERNO"]}>
                  <ReservaPreviewPage />
                </RequiredRoleRoute>
              }
            />

            <Route
              path="pago"
              element={
                <RequiredRoleRoute role={["SOCIO", "EXTERNO"]}>
                  <PagoPage />
                </RequiredRoleRoute>
              }
            />

            {/* ADMIN */}
            <Route
              path="admin"
              element={
                <RequiredRoleRoute role={["ADMIN"]}>
                  <AdminPage />
                </RequiredRoleRoute>
              }
            />

            <Route
              path="admin/espacios"
              element={
                <RequiredRoleRoute role={["ADMIN"]}>
                  <AdminEspaciosPage />
                </RequiredRoleRoute>
              }
            />

            <Route
              path="tesoreria"
              element={
                <RequiredRoleRoute role={["ADMIN"]}>
                  <TesoreriaPage />
                </RequiredRoleRoute>
              }
            />

            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* FUERA DE RUTAS */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
