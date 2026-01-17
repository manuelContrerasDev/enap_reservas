// src/pages/auth/ResendConfirmationPage.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import AuthBGLayout from "@/modules/auth/components/AuthBGLayout";
import AuthHeader from "@/modules/auth/components/AuthHeader";
import AuthInput from "@/modules/auth/components/AuthInput";
import AuthButton from "@/modules/auth/components/AuthButton";

import { authApi } from "@/modules/auth/api/auth.api";
import heroCabana from "@/assets/enap-login.png";
import { PATHS } from "@/app/router/paths";
import { useNotificacion } from "@/shared/providers/NotificacionProvider";
import { AuthErrorCode } from "@/modules/auth/types/auth.errors";

const resendSchema = z.object({
  email: z.string().email().transform((v) => v.trim().toLowerCase()),
});

type ResendValues = z.infer<typeof resendSchema>;

export default function ResendConfirmationPage() {
  const navigate = useNavigate();
  const { agregarNotificacion } = useNotificacion();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResendValues>({
    resolver: zodResolver(resendSchema),
  });

  const onSubmit = async (data: ResendValues) => {
    try {
      const res = await authApi.resendConfirmation(data.email);

      if (res.data?.ok === false) {
        if (res.data.error === AuthErrorCode.EMAIL_ALREADY_CONFIRMED) {
          navigate(PATHS.AUTH_ALREADY_CONFIRMED, { replace: true });
          return;
        }
      }

      agregarNotificacion(
        "Si la cuenta existe, enviaremos un nuevo enlace de confirmación.",
        "success"
      );

      navigate(`${PATHS.AUTH_EMAIL_SENT}?type=register`, { replace: true });
    } catch {
      agregarNotificacion("Error de conexión con el servidor.", "error");
    }
  };

  return (
    <AuthBGLayout backgroundImage={heroCabana}>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md space-y-8"
        aria-live="polite"
      >
        <AuthHeader
          title="Reenviar confirmación"
          subtitle="Ingresa tu correo para generar un nuevo enlace de activación."
        />

        <button
          onClick={() => navigate(PATHS.AUTH_LOGIN)}
          className="text-sm text-gray-600 hover:text-gray-900 transition"
        >
          ← Volver al inicio de sesión
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AuthInput
            label="Correo electrónico"
            error={errors.email?.message}
            {...register("email")}
          />

          <AuthButton type="submit" loading={isSubmitting}>
            Reenviar enlace
          </AuthButton>
        </form>
      </motion.div>
    </AuthBGLayout>
  );
}
