// src/pages/auth/ConfirmEmailPage.tsx
import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthBGLayout from "@/modules/auth/components/AuthBGLayout";
import AuthHeader from "@/modules/auth/components/AuthHeader";
import AuthButton from "@/modules/auth/components/AuthButton";

import { useNotificacion } from "@/context/NotificacionContext";
import { PATHS } from "@/routes/paths";

import heroCabana from "@/assets/enap-login.png";

const API_URL = import.meta.env.VITE_API_URL;

type Status = "loading" | "success" | "error";

export default function ConfirmEmailPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { agregarNotificacion } = useNotificacion();

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  const hasRun = useRef(false);

  useEffect(() => {
    const token = params.get("token");

    if (hasRun.current) return;
    hasRun.current = true;

    const confirm = async () => {
      if (!token) {
        const msg = "Token no encontrado.";
        setStatus("error");
        setMessage(msg);
        agregarNotificacion(msg, "error");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/confirm?token=${token}`);
        const json = await res.json().catch(() => ({}));

        if (json.code === "CONFIRMED") {
          const msg = json.message || "Correo confirmado correctamente 🎉";
          setStatus("success");
          setMessage(msg);
          agregarNotificacion(msg, "success");
          return;
        }

        if (json.code === "ALREADY_CONFIRMED") {
          navigate(PATHS.AUTH_ALREADY_CONFIRMED, { replace: true });
          return;
        }

        if (json.code === "INVALID" || json.code === "EXPIRED") {
          navigate(PATHS.AUTH_LINK_EXPIRED, { replace: true });
          return;
        }

        navigate(PATHS.AUTH_LINK_EXPIRED, { replace: true });

      } catch {
        const msg = "Error de conexión con el servidor.";
        setStatus("error");
        setMessage(msg);
        agregarNotificacion(msg, "error");
      }
    };

    confirm();
  }, []);

  return (
    <AuthBGLayout backgroundImage={heroCabana}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-md space-y-10"
      >
        <AuthHeader
          title="Confirmación de Cuenta"
          subtitle={status === "loading" ? "Validando tu información…" : "Resultado"}
        />

        <div className="text-center space-y-6">
          {status === "loading" && (
            <p className="text-gray-700 text-sm">Procesando solicitud…</p>
          )}

          {status === "success" && (
            <div className="space-y-6">
              <p className="text-[#003D52] font-semibold text-lg">✔ {message}</p>

              <AuthButton onClick={() => navigate(PATHS.AUTH_LOGIN, { replace: true })}>
                Iniciar sesión
              </AuthButton>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-6">
              <p className="text-red-600 font-semibold text-lg">✖ {message}</p>

              <AuthButton onClick={() => navigate(PATHS.AUTH_LOGIN, { replace: true })}>
                Volver al inicio
              </AuthButton>
            </div>
          )}
        </div>
      </motion.div>
    </AuthBGLayout>
  );
}
