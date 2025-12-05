// src/pages/auth/EmailSentPage.tsx

import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthBGLayout from "@/auth/components/AuthBGLayout";
import AuthHeader from "@/auth/components/AuthHeader";
import AuthButton from "@/auth/components/AuthButton";

import { PATHS } from "@/routes/paths";
import heroCabana from "@/assets/enap-login.png";

export default function EmailSentPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const type = params.get("type") || "register";

  const message =
    type === "reset"
      ? "Te enviamos un enlace para restablecer tu contraseña."
      : "Te enviamos un enlace de confirmación a tu correo.";

  const subtitle =
    type === "reset"
      ? "Revisa tu bandeja de entrada para continuar con el proceso de recuperación."
      : "Revisa tu correo para completar la activación de tu cuenta.";

  return (
    <AuthBGLayout backgroundImage={heroCabana}>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-8"
      >
        <AuthHeader title="Correo enviado" subtitle={message} />

        <div className="space-y-6 text-center max-w-md mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700 text-sm leading-relaxed"
          >
            {subtitle}
            <br />
            Si no lo encuentras, revisa también la carpeta de spam.
          </motion.p>

          <div className="space-y-3">
            <AuthButton onClick={() => navigate(PATHS.AUTH_LOGIN)}>
              Volver al inicio de sesión
            </AuthButton>

            <button
              onClick={() => navigate(PATHS.AUTH_RESEND_CONFIRMATION)}
              className="w-full text-azul-700 text-sm underline hover:text-azul-600 transition"
            >
              ¿No recibiste el correo? Reenviar enlace
            </button>
          </div>
        </div>
      </motion.div>
    </AuthBGLayout>
  );
}
