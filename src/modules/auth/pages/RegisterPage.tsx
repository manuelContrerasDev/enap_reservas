// src/modules/auth/pages/RegisterPage.tsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthBGLayout from "@/modules/auth/components/AuthBGLayout";
import AuthHeader from "@/modules/auth/components/AuthHeader";
import AuthRegisterForm from "@/modules/auth/forms/RegisterForm";

import { useAuth } from "@/modules/auth/hooks";
import { useNotificacion } from "@/shared/providers/NotificacionProvider";
import { PATHS } from "@/app/router/paths";

import heroCabana from "@/assets/enap-login.png";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { agregarNotificacion } = useNotificacion();

  return (
    <AuthBGLayout backgroundImage={heroCabana}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md space-y-10"
        aria-live="polite"
      >
        <AuthHeader
          title="Crear cuenta"
          subtitle="Regístrate para poder reservar cabañas, quinchos y espacios del Centro Vacacional ENAP."
        />

        <AuthRegisterForm
          onSubmitRegister={register}
          onSuccess={() => {
            agregarNotificacion(
              "Cuenta creada correctamente. Revisa tu correo para confirmar tu registro.",
              "success"
            );

            navigate(`${PATHS.AUTH_EMAIL_SENT}?type=register`, {
              replace: true,
            });
          }}
        />

        <div className="text-center text-sm space-y-1">
          <button
            type="button"
            onClick={() => navigate(PATHS.AUTH_LOGIN)}
            className="text-[#C7A96A] font-semibold hover:text-[#b09058]"
          >
            ¿Ya tienes cuenta? Inicia sesión →
          </button>
        </div>
      </motion.div>
    </AuthBGLayout>
  );
}
