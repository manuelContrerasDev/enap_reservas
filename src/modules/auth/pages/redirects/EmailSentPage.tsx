// src/pages/auth/EmailSentPage.tsx
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthBGLayout from "@/modules/auth/components/AuthBGLayout";
import AuthHeader from "@/modules/auth/components/AuthHeader";
import AuthButton from "@/modules/auth/components/AuthButton";

import { PATHS } from "@/app/router/paths";
import heroCabana from "@/assets/enap-login.png";

type EmailType = "register" | "reset";

export default function EmailSentPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  /* ============================================================
   * PARAM SAFE GUARD
   * ============================================================ */
  const rawType = params.get("type");
  const type: EmailType =
    rawType === "reset" || rawType === "register"
      ? rawType
      : "register";

  /* ============================================================
   * A11Y — limpiar foco previo
   * ============================================================ */
  useEffect(() => {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, []);

  /* ============================================================
   * COPY
   * ============================================================ */
  const title =
    type === "reset"
      ? "Correo de recuperación enviado"
      : "Correo de confirmación enviado";

  const subtitle =
    type === "reset"
      ? "Te enviamos un enlace para restablecer tu contraseña."
      : "Te enviamos un enlace para confirmar tu cuenta.";

  const description =
    type === "reset"
      ? "Revisa tu bandeja de entrada para continuar con el proceso de recuperación."
      : "Revisa tu correo para completar la activación de tu cuenta.";

  return (
    <AuthBGLayout backgroundImage={heroCabana}>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md space-y-8"
        aria-live="polite"
        tabIndex={-1}
      >
        <AuthHeader title={title} subtitle={subtitle} />

        <div className="space-y-6 text-center">
          <p className="text-gray-700 text-sm leading-relaxed">
            {description}
            <br />
            Si no lo encuentras, revisa también la carpeta de spam o correo no deseado.
          </p>

          <div className="space-y-3">
            <AuthButton
              variant="primary"
              onClick={() => navigate(PATHS.AUTH_LOGIN, { replace: true })}
            >
              Volver al inicio de sesión
            </AuthButton>

            {type === "register" && (
              <button
                type="button"
                onClick={() => navigate(PATHS.AUTH_RESEND_CONFIRMATION)}
                className="
                  w-full text-[#003D52] text-sm underline
                  hover:text-[#002a3b]
                  transition-colors
                "
              >
                ¿No recibiste el correo? Reenviar confirmación
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </AuthBGLayout>
  );
}
