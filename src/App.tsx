// src/App.tsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth/useAuth";

import LayoutBase from "@/components/layout/LayoutBase";
import LoaderScreen from "@/components/ui/loaders/LoaderScreen";

// AUTH
import LoginPage from "@/modules/auth/pages/LoginPage";
import RegisterPage from "@/modules/auth/pages/RegisterPage";
import {
  LinkExpiredPage,
  EmailSentPage,
  AlreadyConfirmedPage,
  ResendConfirmPage,
  ResetRequestPage,
  ResetConfirmPage,
  ConfirmEmailPage,
} from "@/modules/auth/pages";

// SOCIO / EXTERNO
import EspaciosPage from "@/modules/espacios/pages/PublicoEspaciosPage";
import MisReservasPage from "@/modules/reservas/pages/MisReservasPage";

// RESERVAS
import ReservaPage from "@/modules/reservas/pages/ReservaPage";
import ReservaPreviewPage from "@/modules/reservas/pages/ReservaPreviewPage";
import TransferenciaPage from "@/modules/reservas/pages/TransferenciaPage";

// ADMIN
import AdminEspaciosPage from "@/modules/espacios/pages/AdminEspaciosPage";
import AdminReservasPage from "@/modules/admin/reservas/pages/AdminReservasPage";
import AdminReservaManualPage from "@/modules/admin/reservas/pages/AdminReservaManualPage";
import TesoreriaPage from "@/modules/admin/reservas/pages/AdminTesoreriaPage";

import { PATHS } from "@/routes/paths";
import { ReservaProvider } from "@/context/ReservaContext";

/* ============================================================
 * 🔐 PROTECTED ROUTE
 * ============================================================ */
const ProtectedRoute: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoaderScreen />;
  if (!user) return <Navigate to={PATHS.AUTH_LOGIN} replace />;

  return <Outlet />;
};

/* ============================================================
 * 👤 REDIRECT POR ROL
 * ============================================================ */
const RoleRedirect: React.FC = () => {
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

/* ============================================================
 * 🚀 ROUTER PRINCIPAL — ENAP 2025
 * ============================================================ */
export default function App() {
  return (
    <Routes>

      {/* ================= AUTH ================= */}
      <Route path={PATHS.AUTH_LOGIN} element={<LoginPage />} />
      <Route path={PATHS.AUTH_REGISTER} element={<RegisterPage />} />
      <Route path={PATHS.AUTH_CONFIRM} element={<ConfirmEmailPage />} />
      <Route path={PATHS.AUTH_EMAIL_SENT} element={<EmailSentPage />} />
      <Route path={PATHS.AUTH_LINK_EXPIRED} element={<LinkExpiredPage />} />
      <Route path={PATHS.AUTH_ALREADY_CONFIRMED} element={<AlreadyConfirmedPage />} />
      <Route path={PATHS.AUTH_RESEND_CONFIRMATION} element={<ResendConfirmPage />} />
      <Route path={PATHS.AUTH_RESET_REQUEST} element={<ResetRequestPage />} />
      <Route path={PATHS.AUTH_RESET_CONFIRM} element={<ResetConfirmPage />} />

      {/* ================= PROTEGIDO ================= */}
      <Route element={<ProtectedRoute />}>
        <Route element={<LayoutBase />}>

          {/* HOME POR ROL */}
          <Route index element={<RoleRedirect />} />

          {/* SOCIO / EXTERNO */}
          <Route path={PATHS.SOCIO_ESPACIOS} element={<EspaciosPage />} />
          <Route path={PATHS.SOCIO_MIS_RESERVAS} element={<MisReservasPage />} />

          {/* RESERVAS */}
          <Route element={<ReservaProvider><Outlet /></ReservaProvider>}>
            <Route path={PATHS.RESERVA_ID} element={<ReservaPage />} />
            <Route path={PATHS.RESERVA_PREVIEW} element={<ReservaPreviewPage />} />
            <Route path={PATHS.RESERVA_TRANSFERENCIA} element={<TransferenciaPage />} />
          </Route>

          {/* ADMIN */}
          <Route path={PATHS.ADMIN_RESERVAS} element={<AdminReservasPage />} />
          <Route path={PATHS.ADMIN_RESERVAS_MANUAL} element={<AdminReservaManualPage />} />
          <Route path={PATHS.ADMIN_ESPACIOS} element={<AdminEspaciosPage />} />
          <Route path={PATHS.TESORERIA} element={<TesoreriaPage />} />

        </Route>
      </Route>

      {/* DEFAULT */}
      <Route path="/" element={<Navigate to={PATHS.AUTH_LOGIN} replace />} />
      <Route path="*" element={<Navigate to={PATHS.AUTH_LOGIN} replace />} />
    </Routes>
  );
}
