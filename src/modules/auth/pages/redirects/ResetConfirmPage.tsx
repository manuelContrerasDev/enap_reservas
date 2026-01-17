// src/pages/auth/ResetConfirmPage.tsx
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  resetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/modules/auth/schemas/auth.schema";

import AuthBGLayout from "@/modules/auth/components/AuthBGLayout";
import AuthHeader from "@/modules/auth/components/AuthHeader";
import AuthInput from "@/modules/auth/components/AuthInput";
import AuthButton from "@/modules/auth/components/AuthButton";

import { authApi } from "@/modules/auth/api/auth.api";
import { useNotificacion } from "@/shared/providers/NotificacionProvider";
import { PATHS } from "@/app/router/paths";
import heroCabana from "@/assets/enap-login.png";

type Status = "loading" | "ready";

export default function ResetConfirmPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { agregarNotificacion } = useNotificacion();

  const token = params.get("token") ?? "";
  const [status, setStatus] = useState<Status>("loading");

  const validatedRef = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  /* ============================================================
   * VALIDAR TOKEN (solo una vez)
   * ============================================================ */
  useEffect(() => {
    if (validatedRef.current) return;
    validatedRef.current = true;

    if (!token) {
      navigate(PATHS.AUTH_LINK_EXPIRED, { replace: true });
      return;
    }

    authApi
      .checkReset(token)
      .then(() => setStatus("ready"))
      .catch(() =>
        navigate(`${PATHS.AUTH_LINK_EXPIRED}?type=reset`, { replace: true })
      );
  }, [token, navigate]);

  /* ============================================================
   * SUBMIT NUEVA CONTRASEÑA
   * ============================================================ */
  const onSubmit = async (data: ResetPasswordSchemaType) => {
    try {
      await authApi.resetPassword(data.token, data.newPassword);

      agregarNotificacion(
        "Tu contraseña fue actualizada correctamente.",
        "success"
      );

      navigate(PATHS.AUTH_LOGIN, { replace: true });
    } catch {
      agregarNotificacion(
        "El enlace ya no es válido o ha expirado.",
        "error"
      );

      navigate(`${PATHS.AUTH_LINK_EXPIRED}?type=reset`, { replace: true });
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
          title="Restablecer contraseña"
          subtitle="Crea una nueva contraseña para acceder nuevamente a tu cuenta."
        />

        {/* Estado loading */}
        {status === "loading" && (
          <div className="flex items-center gap-3 text-gray-600 text-sm">
            <motion.div
              className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            />
            Validando enlace de seguridad…
          </div>
        )}

        {/* Formulario */}
        {status === "ready" && (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            aria-busy={isSubmitting}
          >
            <input type="hidden" {...register("token")} />

            <AuthInput
              type="password"
              label="Nueva contraseña"
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />

            <AuthInput
              type="password"
              label="Confirmar nueva contraseña"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />

            <AuthButton type="submit" loading={isSubmitting}>
              Guardar nueva contraseña
            </AuthButton>
          </form>
        )}
      </motion.div>
    </AuthBGLayout>
  );
}
