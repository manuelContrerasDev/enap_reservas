// src/pages/auth/LinkExpiredPage.tsx

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import AuthBGLayout from "@/auth/components/AuthBGLayout";
import AuthHeader from "@/auth/components/AuthHeader";
import AuthButton from "@/auth/components/AuthButton";

import heroCabana from "@/assets/enap-login.png";
import { PATHS } from "@/routes/paths";

export default function LinkExpiredPage() {
  const navigate = useNavigate();

  return (
    <AuthBGLayout backgroundImage={heroCabana}>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-8"
      >
        <AuthHeader
          title="Enlace vencido"
          subtitle="Este enlace ya no es válido o ha expirado"
        />

        <div className="text-center space-y-6 max-w-md mx-auto">
          <p className="text-red-600 font-semibold text-lg">
            ✖ El enlace ha expirado o es inválido.
          </p>

          <p className="text-gray-700 text-sm leading-relaxed">
            Por motivos de seguridad, los enlaces tienen una duración limitada.
            Puedes solicitar uno nuevo para continuar.
          </p>

          <div className="space-y-3">
            <AuthButton onClick={() => navigate(PATHS.AUTH_LOGIN)}>
              Volver al inicio de sesión
            </AuthButton>

            <button
              onClick={() => navigate(PATHS.AUTH_RESEND_CONFIRMATION)}
              className="w-full py-2.5 border border-gold text-gold rounded-lg text-sm font-semibold
                        hover:bg-gold hover:text-white transition-all shadow-sm"
            >
              Reenviar enlace
            </button>
          </div>
        </div>
      </motion.div>
    </AuthBGLayout>
  );
}
