// src/pages/auth/AlreadyConfirmedPage.tsx

import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthBGLayout from "@/modules/auth/components/AuthBGLayout";
import AuthHeader from "@/modules/auth/components/AuthHeader";
import AuthButton from "@/modules/auth/components/AuthButton";

import heroCabana from "@/assets/enap-login.png";
import { PATHS } from "@/routes/paths";

export default function AlreadyConfirmedPage() {
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
          title="Cuenta ya confirmada"
          subtitle="Tu correo ya fue verificado anteriormente"
        />

        <div className="space-y-6 text-center max-w-md mx-auto">
          <p className="text-green-700 font-semibold text-lg">
            ✔ Tu correo ya está verificado
          </p>

          <p className="text-gray-700 text-sm leading-relaxed">
            Ya no es necesario validar nuevamente. Puedes iniciar sesión con normalidad.
          </p>

          <div className="space-y-3">
            <AuthButton onClick={() => navigate(PATHS.AUTH_LOGIN)}>
              Ir al inicio de sesión
            </AuthButton>

            <button
              onClick={() => navigate(PATHS.AUTH_RESEND_CONFIRMATION)}
              className="w-full py-2.5 border border-gold text-gold rounded-lg text-sm font-semibold 
                         hover:bg-gold hover:text-white transition-all shadow-sm"
            >
              Reenviar confirmación
            </button>
          </div>
        </div>
      </motion.div>
    </AuthBGLayout>
  );
}
