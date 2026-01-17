// src/pages/auth/ConfirmEmailPage.tsx
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthBGLayout from "@/modules/auth/components/AuthBGLayout";
import AuthHeader from "@/modules/auth/components/AuthHeader";
import AuthButton from "@/modules/auth/components/AuthButton";

import { authApi } from "@/modules/auth/api/auth.api";
import { useNotificacion } from "@/shared/providers/NotificacionProvider";
import { PATHS } from "@/app/router/paths";
import heroCabana from "@/assets/enap-login.png";

type Status = "loading" | "success";

export default function ConfirmEmailPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { agregarNotificacion } = useNotificacion();

  const [status, setStatus] = useState<Status>("loading");

  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const token = params.get("token");

    if (!token) {
      navigate(PATHS.AUTH_LINK_EXPIRED, { replace: true });
      return;
    }

    authApi
      .confirmEmail(token)
      .then(() => {
        setStatus("success");
        agregarNotificacion("Correo confirmado correctamente.", "success");
      })
      .catch(() => {
        navigate(PATHS.AUTH_LINK_EXPIRED, { replace: true });
      });
  }, [params, navigate, agregarNotificacion]);

  return (
    <AuthBGLayout backgroundImage={heroCabana}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md space-y-10"
        aria-live="polite"
      >
        <AuthHeader
          title="Confirmación de cuenta"
          subtitle={
            status === "loading"
              ? "Validando la información del enlace…"
              : "Cuenta confirmada correctamente"
          }
        />

        {status === "loading" && (
          <p className="text-gray-700 text-sm text-center">
            Procesando solicitud…
          </p>
        )}

        {status === "success" && (
          <div className="space-y-6 text-center">
            <p className="text-[#003D52] font-semibold text-base">
              Tu cuenta ha sido activada correctamente.
            </p>

            <AuthButton
              onClick={() => navigate(PATHS.AUTH_LOGIN, { replace: true })}
            >
              Iniciar sesión
            </AuthButton>
          </div>
        )}
      </motion.div>
    </AuthBGLayout>
  );
}
