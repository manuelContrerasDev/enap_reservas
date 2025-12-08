// src/pages/auth/ResetRequestPage.tsx

import React from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  resetRequestSchema,
  ResetRequestSchemaType,
} from "@/validators/auth.schema";

import AuthBGLayout from "@/modules/auth/components/AuthBGLayout";
import AuthHeader from "@/modules/auth/components/AuthHeader";
import AuthInput from "@/modules/auth/components/AuthInput";
import AuthButton from "@/modules/auth/components/AuthButton";

import { useNotificacion } from "@/context/NotificacionContext";
import { useNavigate } from "react-router-dom";
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

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.ok) {
        agregarNotificacion(
          json.message || "No se pudo enviar el correo.",
          "error"
        );
        return;
      }

      // Mensaje consistente
      agregarNotificacion(
        "Si el correo existe, enviaremos un enlace.",
        "success"
      );

      navigate(`${PATHS.AUTH_EMAIL_SENT}?type=reset`, {
        replace: true,
      });
    } catch (err) {
      console.error("❌ ResetRequest error:", err);
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
        {/* HEADER */}
        <AuthHeader
          title="Recuperar Contraseña"
          subtitle="Ingresa tu correo para recibir las instrucciones."
        />

        {/* VOLVER */}
        <button
          onClick={() => navigate(PATHS.AUTH_LOGIN)}
          className="
            text-sm font-medium
            text-[#003D52] hover:text-[#002a3b]
            transition-colors
          "
        >
          ← Volver al inicio de sesión
        </button>

        {/* FORM */}
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
