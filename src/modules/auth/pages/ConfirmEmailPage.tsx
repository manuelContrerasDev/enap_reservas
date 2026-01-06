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

type Status = "loading" | "success";

export default function ConfirmEmailPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { agregarNotificacion } = useNotificacion();

  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState("");

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const token = params.get("token");

    if (!token) {
      navigate(PATHS.AUTH_LINK_EXPIRED, { replace: true });
      return;
    }

    const confirm = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/confirm?token=${token}`);
        const json = await res.json().catch(() => ({}));

        // ✅ Confirmado correctamente
        if (json.ok) {
          const msg = json.message || "Correo confirmado correctamente 🎉";
          setStatus("success");
          setMessage(msg);
          agregarNotificacion(msg, "success");
          return;
        }

        // 🔁 Ya confirmado
        if (json.code === "ALREADY_CONFIRMED") {
          navigate(PATHS.AUTH_ALREADY_CONFIRMED, { replace: true });
          return;
        }

        // ⛔ Token inválido / expirado
        navigate(PATHS.AUTH_LINK_EXPIRED, { replace: true });

      } catch {
        agregarNotificacion(
          "Error de conexión con el servidor.",
          "error"
        );
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
          subtitle={
            status === "loading"
              ? "Validando tu información…"
              : "Cuenta confirmada"
          }
        />

        {status === "loading" && (
          <p className="text-gray-700 text-sm text-center">
            Procesando solicitud…
          </p>
        )}

        {status === "success" && (
          <div className="space-y-6 text-center">
            <p className="text-[#003D52] font-semibold text-lg">
              ✔ {message}
            </p>

            <AuthButton
              onClick={() =>
                navigate(PATHS.AUTH_LOGIN, { replace: true })
              }
            >
              Iniciar sesión
            </AuthButton>
          </div>
        )}
      </motion.div>
    </AuthBGLayout>
  );
}
