import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import LayoutBase from "@/components/layout/LayoutBase";
import { PATHS } from "./paths";
import { ProtectedRoute, RoleRedirect } from "./guards";

import { ReservaProvider } from "@/context/ReservaContext";

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

export function AppRouter() {
  return (
    <Routes>
      {/* ================= AUTH ================= */}
      <Route path={PATHS.AUTH_LOGIN} element={<LoginPage />} />
      <Route path={PATHS.AUTH_REGISTER} element={<RegisterPage />} />
      <Route path={PATHS.AUTH_CONFIRM} element={<ConfirmEmailPage />} />
      <Route path={PATHS.AUTH_EMAIL_SENT} element={<EmailSentPage />} />
      <Route path={PATHS.AUTH_LINK_EXPIRED} element={<LinkExpiredPage />} />
      <Route
        path={PATHS.AUTH_ALREADY_CONFIRMED}
        element={<AlreadyConfirmedPage />}
      />
      <Route
        path={PATHS.AUTH_RESEND_CONFIRMATION}
        element={<ResendConfirmPage />}
      />
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
          <Route
            element={
              <ReservaProvider>
                <Outlet />
              </ReservaProvider>
            }
          >
            <Route path={PATHS.RESERVA_ID} element={<ReservaPage />} />
            <Route
              path={PATHS.RESERVA_PREVIEW}
              element={<ReservaPreviewPage />}
            />
            <Route
              path={PATHS.RESERVA_TRANSFERENCIA}
              element={<TransferenciaPage />}
            />
          </Route>

          {/* ADMIN */}
          <Route path={PATHS.ADMIN_RESERVAS} element={<AdminReservasPage />} />
          <Route
            path={PATHS.ADMIN_RESERVAS_MANUAL}
            element={<AdminReservaManualPage />}
          />
          <Route path={PATHS.ADMIN_ESPACIOS} element={<AdminEspaciosPage />} />
          <Route path={PATHS.TESORERIA} element={<TesoreriaPage />} />
        </Route>
      </Route>

      {/* DEFAULT */}
      <Route path="/" element={<Navigate to={PATHS.AUTH_LOGIN} replace />} />
      <Route
        path={PATHS.NOT_FOUND}
        element={<Navigate to={PATHS.AUTH_LOGIN} replace />}
      />
    </Routes>
  );
}
