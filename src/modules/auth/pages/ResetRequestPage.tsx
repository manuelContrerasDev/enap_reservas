// src/pages/auth/ResetRequestPage.tsx

import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import {
  resetRequestSchema,
  ResetRequestSchemaType,
} from "@/validators/auth.schema";

import AuthBGLayout from "@/modules/auth/components/AuthBGLayout";
import AuthHeader from "@/modules/auth/components/AuthHeader";
import AuthInput from "@/modules/auth/components/AuthInput";
import AuthButton from "@/modules/auth/components/AuthButton";

import { useNotificacion } from "@/context/NotificacionContext";
import { PATHS } from "@/routes/paths";

import heroCabana from "@/assets/enap-login.png";

const API_URL = import.meta.env.VITE_API_URL;

export default function ResetRequestPage() {
  const navigate = useNavigate();
  const { agregarNotificacion } = useNotificacion();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetRequestSchemaType>({
    resolver: zodResolver(resetRequestSchema),
  });

  const onSubmit = async (data: ResetRequestSchemaType) => {
    if (!API_URL) {
      agregarNotificacion("Error interno: API no configurada.", "error");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/reset-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        agregarNotificacion("No se pudo enviar el correo.", "error");
        return;
      }

      // ✅ Mensaje neutro SIEMPRE
      agregarNotificacion(
        "Si el correo existe, enviaremos un enlace para restablecer tu contraseña.",
        "success"
      );

      navigate(`${PATHS.AUTH_EMAIL_SENT}?type=reset`, {
        replace: true,
      });

    } catch (error) {
      console.error("❌ ResetRequest error:", error);
      agregarNotificacion("Error de conexión con el servidor.", "error");
    }
  };

  return (
    <AuthBGLayout backgroundImage={heroCabana}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md space-y-8"
      >
        <AuthHeader
          title="Recuperar Contraseña"
          subtitle="Ingresa tu correo para recibir las instrucciones."
        />

        <button
          onClick={() => navigate(PATHS.AUTH_LOGIN)}
          className="text-sm font-medium text-[#003D52] hover:text-[#002a3b]"
        >
          ← Volver al inicio de sesión
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AuthInput
            label="Correo electrónico"
            placeholder="usuario@sindicatoenap.cl"
            type="email"
            error={errors.email?.message}
            {...register("email")}
          />

          <AuthButton type="submit" loading={isSubmitting}>
            Enviar instrucciones
          </AuthButton>
        </form>
      </motion.div>
    </AuthBGLayout>
  );
}
