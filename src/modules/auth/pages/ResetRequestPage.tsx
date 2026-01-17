// src/pages/auth/ResetRequestPage.tsx
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import {
  resetRequestSchema,
  ResetRequestSchemaType,
} from "@/modules/auth/schemas/auth.schema";

import AuthBGLayout from "@/modules/auth/components/AuthBGLayout";
import AuthHeader from "@/modules/auth/components/AuthHeader";
import AuthInput from "@/modules/auth/components/AuthInput";
import AuthButton from "@/modules/auth/components/AuthButton";

import { authApi } from "@/modules/auth/api/auth.api";
import { useNotificacion } from "@/shared/providers/NotificacionProvider";
import { PATHS } from "@/app/router/paths";

import heroCabana from "@/assets/enap-login.png";

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
    try {
      await authApi.resetRequest(data.email);

      agregarNotificacion(
        "Si el correo está registrado, te enviaremos un enlace para restablecer tu contraseña.",
        "success"
      );

      navigate(`${PATHS.AUTH_EMAIL_SENT}?type=reset`, {
        replace: true,
      });
    } catch {
      agregarNotificacion(
        "No fue posible conectar con el servidor. Intenta nuevamente.",
        "error"
      );
    }
  };

  return (
    <AuthBGLayout backgroundImage={heroCabana}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md space-y-8"
        aria-live="polite"
      >
        <AuthHeader
          title="Recuperar contraseña"
          subtitle="Ingresa tu correo y te enviaremos las instrucciones para crear una nueva contraseña."
        />

        <button
          type="button"
          onClick={() => navigate(PATHS.AUTH_LOGIN)}
          className="text-sm font-medium text-[#003D52] hover:underline self-start"
        >
          ← Volver al inicio de sesión
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AuthInput
            label="Correo electrónico"
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
