// src/App.tsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";

import LayoutBase from "@/components/layout/LayoutBase";

import AppShell from "@/pages/AppShell";
import EspaciosPage from "@/pages/socio/EspaciosPage";
import MisReservasPage from "@/pages/socio/MisReservasPage";

import ReservaPage from "@/pages/socio/ReservaPage";
import ReservaPreviewPage from "@/pages/socio/ReservaPreviewPage";

import AdminEspaciosPage from "@/pages/admin/AdminEspaciosPage";
import TesoreriaPage from "@/pages/admin/TesoreriaPage";
import AdminReservasPage from "@/pages/admin/AdminReservasPage";

import { PATHS } from "@/routes/paths";
import { ReservaProvider } from "@/context/ReservaContext";
import SuccessRegisterPage from "./pages/auth/redirects/SuccesRegisterPage";
import LinkExpiredPage from "./pages/auth/redirects/LinkExpiredPage";
import EmailSentPage from "./pages/auth/redirects/EmailSentPage";
import AlreadyConfirmedPage from "./pages/auth/redirects/AlreadyConfirmedPage";
import ResendConfirmationPage from "./pages/auth/redirects/ResendConfirmPage";
import ResetRequestPage from "./pages/auth/ResetRequestPage";
import ResetConfirmPage from "./pages/auth/redirects/ResetConfirmPage";
import ConfirmEmailPage from "./pages/auth/ConfirmEmailPage";
import LoaderScreen from "./components/ui/LoaderScreen";


// ============================================================
// 🔐 PROTECTED ROUTE
// ============================================================
const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoaderScreen />;
  if (!user) return <Navigate to={PATHS.AUTH_LOGIN} replace />;

  return <Outlet />;
};

// ============================================================
// 👤 HOME POR ROL — SIN LOOPS
// ============================================================
const RoleRedirect: React.FC = () => {
  const { role } = useAuth();

  if (role === "ADMIN") return <Navigate to={PATHS.ADMIN_HOME} replace />;
  if (role === "SOCIO") return <Navigate to={PATHS.SOCIO_HOME} replace />;
  if (role === "EXTERNO") return <Navigate to={PATHS.EXTERNO_HOME} replace />;

  return <Navigate to={PATHS.AUTH_LOGIN} replace />;
};

// ============================================================
// 🚀 APP ROUTER
// ============================================================
export default function App() {
  return (
    <Routes>
      {/* LOGIN */}
    /* AUTH */
    <Route path={PATHS.AUTH_LOGIN} element={<LoginPage />} />
    <Route path={PATHS.AUTH_REGISTER} element={<RegisterPage />} />

    <Route path={PATHS.AUTH_CONFIRM} element={<ConfirmEmailPage />} />
    <Route path={PATHS.AUTH_EMAIL_SENT} element={<EmailSentPage />} />
    <Route path={PATHS.AUTH_LINK_EXPIRED} element={<LinkExpiredPage />} />
    <Route path={PATHS.AUTH_ALREADY_CONFIRMED} element={<AlreadyConfirmedPage />} />
    <Route path={PATHS.AUTH_RESEND_CONFIRMATION} element={<ResendConfirmationPage />} />
    <Route path={PATHS.AUTH_RESET_REQUEST} element={<ResetRequestPage />} />
    <Route path={PATHS.AUTH_RESET_CONFIRM} element={<ResetConfirmPage />} />

      {/* ZONA PROTEGIDA */}
      <Route path="/app" element={<ProtectedRoute />}>
        <Route element={<LayoutBase />}>

          {/* HOME dinámico */}
          <Route index element={<RoleRedirect />} />

          {/* HOME genérico */}
          <Route path="home" element={<AppShell />} />

          {/* SOCIO / EXTERNO */}
          <Route path="espacios" element={<EspaciosPage />} />
          <Route path="mis-reservas" element={<MisReservasPage />} />

          {/* RESERVAS — ✔ ENVUELTO en ReservaProvider */}
          <Route
            element={
              <ReservaProvider>
                <Outlet />
              </ReservaProvider>
            }
          >
            <Route path="reservar/:id" element={<ReservaPage />} />
            <Route path="reserva/preview" element={<ReservaPreviewPage />} />
          </Route>

          {/* ADMIN */}
          <Route path="admin/reservas" element={<AdminReservasPage />} />
          <Route path="admin/espacios" element={<AdminEspaciosPage />} />
          <Route path="admin/tesoreria" element={<TesoreriaPage />} />

          {/* TEST */}
          <Route path="test" element={<div>TEST OK ✔</div>} />

        </Route>
      </Route>

      {/* DEFAULTS */}
      <Route path="/" element={<Navigate to={PATHS.AUTH_LOGIN} replace />} />
      <Route path="*" element={<Navigate to={PATHS.AUTH_LOGIN} replace />} />
    </Routes>
  );
}
