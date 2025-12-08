// src/pages/auth/RegisterPage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthBGLayout from "@/modules/auth/components/AuthBGLayout";
import AuthHeader from "@/modules/auth/components/AuthHeader";
import AuthButton from "@/modules/auth/components/AuthButton"; // (si el form lo usa internamente)
import { RegisterForm } from "@/modules/auth/components/AuthRegisterForm";

import { useNotificacion } from "@/context/NotificacionContext";
import { PATHS } from "@/routes/paths";

import heroCabana from "@/assets/enap-login.png";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { agregarNotificacion } = useNotificacion();

  const [loading, setLoading] = useState(false);
  const [errorGlobal, setErrorGlobal] = useState<string | null>(null);

  return (
    <AuthBGLayout backgroundImage={heroCabana}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md space-y-10"
      >
        {/* HEADER */}
        <AuthHeader
          title="Crear Cuenta ENAP"
          subtitle="Regístrate para poder reservar cabañas, quinchos y espacios."
        />

        {/* FORMULARIO */}
        <div className="space-y-6">
          <RegisterForm
            onStartLoading={() => {
              setLoading(true);
              setErrorGlobal(null);
            }}
            onFinishLoading={() => setLoading(false)}
            onError={(msg) => {
              setErrorGlobal(msg);
              agregarNotificacion(msg, "error");
            }}
            onSuccess={() => {
              agregarNotificacion(
                "Cuenta creada correctamente 🎉 Revisa tu correo para confirmarla.",
                "success"
              );

              navigate(`${PATHS.AUTH_EMAIL_SENT}?type=register`, {
                replace: true,
              });
            }}
          />

          {/* ERROR GLOBAL */}
          {errorGlobal && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 text-center text-sm font-medium"
            >
              {errorGlobal}
            </motion.p>
          )}

          {/* LINKS */}
          <div className="text-center text-sm space-y-1">
            <button
              onClick={() => navigate(PATHS.AUTH_LOGIN)}
              className="text-[#C7A96A] font-semibold hover:text-[#b09058]"
            >
              ¿Ya tienes cuenta? Iniciar sesión →
            </button>

            <br />

            <button
              onClick={() => navigate(PATHS.AUTH_RESEND_CONFIRMATION)}
              className="text-[#003D52] font-medium hover:underline"
            >
              ¿No recibiste el correo de confirmación?
            </button>
          </div>
        </div>
      </motion.div>
    </AuthBGLayout>
  );
}
