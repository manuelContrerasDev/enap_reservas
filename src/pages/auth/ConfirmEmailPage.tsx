// src/pages/auth/ConfirmEmailPage.tsx

import React, { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthBGLayout from "@/auth/components/AuthBGLayout";
import AuthHeader from "@/auth/components/AuthHeader";
import AuthButton from "@/auth/components/AuthButton";

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
  const [message, setMessage] = useState<string>("");

  // 🔥 FIX StrictMode: evitar 2° ejecución
  const hasRun = useRef(false);

  useEffect(() => {
    const token = params.get("token");

    // 🔥 No ejecutar confirmación más de una vez
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

      if (!API_URL) {
        const msg = "Error interno: servidor no disponible.";
        setStatus("error");
        setMessage(msg);
        agregarNotificacion(msg, "error");
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/confirm?token=${token}`);
        const json = await res.json().catch(() => ({}));

        // ✔️ Confirmado → MOSTRAR ÉXITO y NO redirigir
        if (json.code === "CONFIRMED") {
          const msg = json.message || "Correo confirmado correctamente 🎉";
          setStatus("success");
          setMessage(msg);
          agregarNotificacion(msg, "success");
          return;
        }

        // ✔️ Ya confirmado → pantalla dedicada
        if (json.code === "ALREADY_CONFIRMED" || json.alreadyVerified) {
          navigate(PATHS.AUTH_ALREADY_CONFIRMED, { replace: true });
          return;
        }

        // ❌ Token inválido o expirado
        if (json.code === "INVALID" || json.code === "EXPIRED") {
          navigate(PATHS.AUTH_LINK_EXPIRED, { replace: true });
          return;
        }

        // ❓ Cualquier otro caso
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

  const goLogin = () => navigate(PATHS.AUTH_LOGIN, { replace: true });

  return (
    <AuthBGLayout backgroundImage={heroCabana}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md space-y-10"
      >
        <AuthHeader
          title="Confirmación de Cuenta"
          subtitle={
            status === "loading"
              ? "Validando tu información…"
              : "Estado de tu verificación"
          }
        />

        <div className="text-center space-y-6">
          {status === "loading" && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-700 text-sm"
            >
              Procesando solicitud…
            </motion.p>
          )}

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <p className="text-[#003D52] font-semibold text-lg">
                ✔ {message}
              </p>

              <AuthButton onClick={goLogin}>
                Iniciar sesión
              </AuthButton>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <p className="text-red-600 font-semibold text-lg">
                ✖ {message}
              </p>

              <AuthButton onClick={goLogin}>
                Volver al inicio
              </AuthButton>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AuthBGLayout>
  );
}
