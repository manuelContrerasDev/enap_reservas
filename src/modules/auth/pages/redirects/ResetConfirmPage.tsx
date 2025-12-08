/* ============================================================
 * 🔐 RESET CONFIRM PAGE — FIX StrictMode + ENAP UI PRO
 * ============================================================ */

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  resetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/validators/auth.schema";

import AuthBGLayout from "@/modules/auth/components/AuthBGLayout";
import AuthHeader from "@/modules/auth/components/AuthHeader";
import AuthInput from "@/modules/auth/components/AuthInput";
import AuthButton from "@/modules/auth/components/AuthButton";

import { useNotificacion } from "@/context/NotificacionContext";
import { PATHS } from "@/routes/paths";

import heroCabana from "@/assets/enap-login.png";

const API_URL = import.meta.env.VITE_API_URL;

type Status = "loading" | "ready" | "expired" | "invalid";

export default function ResetConfirmPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { agregarNotificacion } = useNotificacion();

  const token = params.get("token") ?? "";
  const [status, setStatus] = useState<Status>("loading");

  // FIX StrictMode (evita doble ejecución)
  const hasRun = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  /* ============================================================
   * 1) Validación de TOKEN (solo una vez)
   * ============================================================ */
  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    if (!token) {
      setStatus("invalid");
      return;
    }

    const validate = async () => {
      try {
        const res = await fetch(`${API_URL}/api/auth/check-reset?token=${token}`);
        const json = await res.json().catch(() => ({}));

        if (json.code === "VALID") return setStatus("ready");
        if (json.code === "EXPIRED") return setStatus("expired");

        setStatus("invalid");
      } catch {
        setStatus("invalid");
      }
    };

    validate();
  }, []);

  /* ============================================================
   * 2) Redirección (EXCEPTO cuando loading/ready)
   * ============================================================ */
  useEffect(() => {
    if (status === "loading" || status === "ready") return;

    navigate(PATHS.AUTH_LINK_EXPIRED, { replace: true });
  }, [status]);

  /* ============================================================
   * 3) SUBMIT
   * ============================================================ */
  const onSubmit = async (data: ResetPasswordSchemaType) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => ({}));

      if (json.ok) {
        agregarNotificacion("Contraseña actualizada correctamente.", "success");
        navigate(PATHS.AUTH_LOGIN, { replace: true });
        return;
      }

      agregarNotificacion(
        json.message || "No se pudo actualizar la contraseña.",
        "error"
      );
    } catch {
      agregarNotificacion("Error de conexión con el servidor.", "error");
    }
  };

  /* ============================================================
   * 4) UI ENAP
   * ============================================================ */
  return (
    <AuthBGLayout backgroundImage={heroCabana}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md space-y-10"
      >
        <AuthHeader
          title="Restablecer Contraseña"
          subtitle="Ingresa tu nueva contraseña para continuar."
        />

        {status === "loading" && (
          <p className="text-gray-700 text-sm">Validando enlace…</p>
        )}

        {status === "ready" && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <input type="hidden" {...register("token")} />

            <AuthInput
              type="password"
              label="Nueva contraseña"
              placeholder="••••••••"
              error={errors.newPassword?.message}
              {...register("newPassword")}
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
