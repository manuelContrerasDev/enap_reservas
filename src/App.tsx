// src/App.tsx
import React, { Suspense, lazy, useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import { PATHS } from "./routes/paths";

import ErrorBoundary from "./components/common/ErrorBoundary";
import LoaderScreen from "./components/ui/LoaderScreen";   // Splash inicial (una sola vez)
import Loader from "./components/ui/Loader";               // Loader inline para lazy
import LayoutBase from "./components/layout/LayoutBase";

/* 🔹 Lazy imports */
const LoginPage = lazy(() => import("./pages/LoginPage"));
const LoginSocio = lazy(() => import("./pages/login/login-socio"));
const LoginAdmin = lazy(() => import("./pages/login/login-admin"));
const EspaciosPage = lazy(() => import("./pages/EspaciosPage"));
const ReservaForm = lazy(() => import("./pages/ReservaForm"));
const PagoPage = lazy(() => import("./pages/PagoPage"));
const AdminPage = lazy(() => import("./pages/AdminPage"));
const AdminEspaciosPage = lazy(() => import("./pages/admin/AdminEspaciosPage"));
const TesoreriaPage = lazy(() => import("./pages/TesoreriaPage"));
const NotFoundPage = lazy(() => import("./pages/errors/NotFoundPage"));

/**
 * 🔒 Rutas protegidas según rol de usuario.
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { userRole } = useAuth();
  if (!userRole) return <Navigate to={PATHS.LOGIN} replace />;
  return <>{children}</>;
};

const SPLASH_MS = 1200;

/**
 * 🧭 Sistema de rutas principal ENAP Limache
 */
const App: React.FC = () => {
  // ✅ Splash solo al inicio
  const [showSplash, setShowSplash] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setShowSplash(false), SPLASH_MS);
    return () => clearTimeout(t);
  }, []);

  if (showSplash) {
    // ⛳️ Pantalla de carga inicial; no bloquea clics por pointer-events en el componente
    return <LoaderScreen />;
  }

  return (
    <ErrorBoundary>
      {/* ✅ Para lazy routes usamos un loader inline (sin overlay full-screen) */}
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* 🔓 Rutas públicas */}
          <Route path={PATHS.LOGIN} element={<LoginPage />} />
          <Route path={PATHS.LOGIN_SOCIO} element={<LoginSocio />} />
          <Route path={PATHS.LOGIN_ADMIN} element={<LoginAdmin />} />

          {/* 🔐 Rutas protegidas dentro del layout */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <LayoutBase />
              </ProtectedRoute>
            }
          >
            {/* 👥 SOCIO */}
            <Route index element={<Navigate to={PATHS.ESPACIOS} replace />} />
            <Route path={PATHS.ESPACIOS.replace("/", "")} element={<EspaciosPage />} />
            <Route path={PATHS.RESERVA.replace("/", "")} element={<ReservaForm />} />
            <Route path={PATHS.RESERVA_DETALLE.replace("/", "")} element={<ReservaForm />} />
            <Route path={PATHS.PAGO.replace("/", "")} element={<PagoPage />} />

            {/* 🧑‍💼 ADMIN */}
            <Route path={PATHS.ADMIN.replace("/", "")} element={<AdminPage />} />
            <Route path={PATHS.ADMIN_ESPACIOS.replace("/", "")} element={<AdminEspaciosPage />} />
            <Route path={PATHS.TESORERIA.replace("/", "")} element={<TesoreriaPage />} />

            {/* 404 dentro del layout */}
            <Route path="*" element={<NotFoundPage />} />
          </Route>

          {/* 404 global (fuera del layout) */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
};

export default App;
