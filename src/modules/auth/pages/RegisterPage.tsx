// src/pages/auth/RegisterPage.tsx
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthBGLayout from "@/modules/auth/components/AuthBGLayout";
import AuthHeader from "@/modules/auth/components/AuthHeader";
import { RegisterForm } from "@/modules/auth/components/AuthRegisterForm";

import { useNotificacion } from "@/context/NotificacionContext";
import { PATHS } from "@/routes/paths";

import heroCabana from "@/assets/enap-login.png";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { agregarNotificacion } = useNotificacion();

  return (
    <AuthBGLayout backgroundImage={heroCabana}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md space-y-10"
      >
        <AuthHeader
          title="Crear Cuenta ENAP"
          subtitle="Regístrate para poder reservar cabañas, quinchos y espacios."
        />

        <div className="space-y-6">
          <RegisterForm
            onStartLoading={() => {}}
            onFinishLoading={() => {}}
            onError={(msg) => {
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
