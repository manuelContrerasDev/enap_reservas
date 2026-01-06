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
        className="space-y-8 max-w-md w-full"
      >
        <AuthHeader
          title="Cuenta ya confirmada"
          subtitle="Tu correo electrónico ya fue verificado"
        />

        <div className="space-y-6 text-center">
          <p className="text-green-700 font-semibold text-lg">
            ✔ Tu cuenta está activa
          </p>

          <p className="text-gray-700 text-sm leading-relaxed">
            Ya puedes iniciar sesión y acceder al sistema con normalidad.
          </p>

          <AuthButton onClick={() => navigate(PATHS.AUTH_LOGIN, { replace: true })}>
            Ir al inicio de sesión
          </AuthButton>
        </div>
      </motion.div>
    </AuthBGLayout>
  );
}
