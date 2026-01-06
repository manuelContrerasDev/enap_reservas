// src/pages/auth/EmailSentPage.tsx

import { useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthBGLayout from "@/modules/auth/components/AuthBGLayout";
import AuthHeader from "@/modules/auth/components/AuthHeader";
import AuthButton from "@/modules/auth/components/AuthButton";

import { PATHS } from "@/routes/paths";
import heroCabana from "@/assets/enap-login.png";

type EmailType = "register" | "reset";

export default function EmailSentPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const rawType = params.get("type");
  const type: EmailType = rawType === "reset" ? "reset" : "register";

  const title =
    type === "reset" ? "Correo de recuperación enviado" : "Correo de confirmación enviado";

  const message =
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
        transition={{ duration: 0.45 }}
        className="space-y-8"
      >
        <AuthHeader title={title} subtitle={message} />

        <div className="space-y-6 text-center max-w-md mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-gray-700 text-sm leading-relaxed"
          >
            {description}
            <br />
            Si no lo encuentras, revisa también la carpeta de spam o correo no deseado.
          </motion.p>

          <div className="space-y-3">
            <AuthButton onClick={() => navigate(PATHS.AUTH_LOGIN, { replace: true })}>
              Volver al inicio de sesión
            </AuthButton>

            {type === "register" && (
              <button
                onClick={() => navigate(PATHS.AUTH_RESEND_CONFIRMATION)}
                className="w-full text-[#003D52] text-sm underline hover:text-[#002a3b] transition"
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
