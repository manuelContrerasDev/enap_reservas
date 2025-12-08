// src/App.tsx
import React from "react";
import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth/useAuth";

import LoginPage from "@/modules/auth/pages/LoginPage";
import RegisterPage from "@/modules/auth/pages/RegisterPage";

import LayoutBase from "@/components/layout/LayoutBase";

// SOCIO / EXTERNO
import EspaciosPage from "@/modules/espacios/pages/SocioEspaciosPage";
import MisReservasPage from "@/modules/reservas/pages/SocioMisReservasPage";

// RESERVAS
import ReservaPage from "@/modules/reservas/pages/SocioReservaPage";
import ReservaPreviewPage from "@/modules/reservas/pages/SocioReservaPreviewPage";

// PAGOS
import PagoPage from "@/modules/pagos/pages/PagoPage";
import PagoResultadoPage from "@/modules/pagos/pages/PagoResultadoPage";

// ADMIN
import AdminEspaciosPage from "@/modules/espacios/pages/AdminEspaciosPage";
import TesoreriaPage from "@/modules/admin/pages/AdminTesoreriaPage";
import AdminReservasPage from "@/modules/admin/pages/AdminReservasPage";

// AUTH extra
import {
  SuccessRegisterPage,
  LinkExpiredPage,
  EmailSentPage,
  AlreadyConfirmedPage,
  ResendConfirmPage,
  ResetRequestPage,
  ResetConfirmPage,
  ConfirmEmailPage,
} from "@/modules/auth/pages";

import { PATHS } from "@/routes/paths";
import { ReservaProvider } from "@/context/ReservaContext";
import LoaderScreen from "@/components/ui/LoaderScreen";


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
// 👤 REDIRECT POR ROL
// ============================================================
const RoleRedirect: React.FC = () => {
  const { user } = useAuth();

  if (!user) return <Navigate to={PATHS.AUTH_LOGIN} replace />;

  switch (user.role) {
    case "ADMIN":
      return <Navigate to={PATHS.ADMIN_HOME} replace />;
    case "SOCIO":
      return <Navigate to={PATHS.SOCIO_HOME} replace />;
    case "EXTERNO":
      return <Navigate to={PATHS.EXTERNO_HOME} replace />;
    default:
      return <Navigate to={PATHS.AUTH_LOGIN} replace />;
  }
};


// ============================================================
// 🚀 APP ROUTER
// ============================================================
export default function App() {
  return (
    <Routes>

      {/* AUTH */}
      <Route path={PATHS.AUTH_LOGIN} element={<LoginPage />} />
      <Route path={PATHS.AUTH_REGISTER} element={<RegisterPage />} />
      <Route path={PATHS.AUTH_CONFIRM} element={<ConfirmEmailPage />} />
      <Route path={PATHS.AUTH_EMAIL_SENT} element={<EmailSentPage />} />
      <Route path={PATHS.AUTH_LINK_EXPIRED} element={<LinkExpiredPage />} />
      <Route path={PATHS.AUTH_ALREADY_CONFIRMED} element={<AlreadyConfirmedPage />} />
      <Route path={PATHS.AUTH_RESEND_CONFIRMATION} element={<ResendConfirmPage />} />
      <Route path={PATHS.AUTH_RESET_REQUEST} element={<ResetRequestPage />} />
      <Route path={PATHS.AUTH_RESET_CONFIRM} element={<ResetConfirmPage />} />


      {/* ZONA PROTEGIDA */}
      <Route path="/app" element={<ProtectedRoute />}>
        <Route element={<LayoutBase />}>

          {/* HOME dinámico (index) */}
          <Route index element={<RoleRedirect />} />

          {/* ❌ Eliminado: AppShell */}
          {/* <Route path="home" element={<AppShell />} /> */}

          {/* SOCIO / EXTERNO */}
          <Route path="espacios" element={<EspaciosPage />} />
          <Route path="mis-reservas" element={<MisReservasPage />} />

          {/* RESERVAS (con provider) */}
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

          {/* PAGOS */}
          <Route path="pago" element={<PagoPage />} />
          <Route path="pago/webpay/retorno" element={<PagoResultadoPage />} />
          <Route path="pago/webpay/final" element={<PagoResultadoPage />} />

          {/* ADMIN */}
          <Route path="admin/reservas" element={<AdminReservasPage />} />
          <Route path="admin/espacios" element={<AdminEspaciosPage />} />
          <Route path="admin/tesoreria" element={<TesoreriaPage />} />

          {/* TEST */}
          <Route path="test" element={<div>TEST OK ✔</div>} />

        </Route>
      </Route>


      {/* ROOT */}
      <Route path="/" element={<Navigate to={PATHS.AUTH_LOGIN} replace />} />
      <Route path="*" element={<Navigate to={PATHS.AUTH_LOGIN} replace />} />
    </Routes>
  );
}
