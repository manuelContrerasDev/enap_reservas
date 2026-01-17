// src/pages/auth/LinkExpiredPage.tsx
import { motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";

import AuthBGLayout from "@/modules/auth/components/AuthBGLayout";
import AuthHeader from "@/modules/auth/components/AuthHeader";
import AuthButton from "@/modules/auth/components/AuthButton";

import heroCabana from "@/assets/enap-login.png";
import { PATHS } from "@/app/router/paths";

export default function LinkExpiredPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const rawType = params.get("type")?.toLowerCase();
  const isReset = rawType === "reset";

  const title = isReset
    ? "Enlace de recuperación vencido"
    : "Enlace vencido";

  const subtitle = isReset
    ? "El enlace para restablecer tu contraseña ya no es válido."
    : "El enlace de confirmación ya no es válido.";

  const helpText = isReset
    ? "Puedes solicitar un nuevo enlace para recuperar tu contraseña."
    : "Puedes solicitar un nuevo enlace de confirmación de cuenta.";

  const resendPath = isReset
    ? PATHS.AUTH_RESET_REQUEST
    : PATHS.AUTH_RESEND_CONFIRMATION;

  return (
    <AuthBGLayout backgroundImage={heroCabana}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="space-y-8 max-w-md w-full"
        aria-live="polite"
      >
        <AuthHeader title={title} subtitle={subtitle} />

        <div className="text-center space-y-6">
          <p className="text-red-600 font-semibold text-base">
            El enlace ha expirado o no es válido.
          </p>

          <p className="text-gray-700 text-sm leading-relaxed">
            Por motivos de seguridad, los enlaces tienen una duración limitada.
            <br />
            {helpText}
          </p>

          <div className="space-y-3">
            <AuthButton
              onClick={() =>
                navigate(PATHS.AUTH_LOGIN, { replace: true })
              }
            >
              Volver al inicio de sesión
            </AuthButton>

            <button
              onClick={() => navigate(resendPath)}
              className="
                w-full py-2.5
                border border-[#C7A96A] text-[#C7A96A]
                rounded-lg text-sm font-semibold
                hover:bg-[#C7A96A] hover:text-white
                transition-all shadow-sm
              "
            >
              {isReset
                ? "Solicitar nuevo correo de recuperación"
                : "Reenviar correo de confirmación"}
            </button>
          </div>
        </div>
      </motion.div>
    </AuthBGLayout>
  );
}
