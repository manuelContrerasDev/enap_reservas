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

import heroCabana from "@/assets/enap-login.png";
import { PATHS } from "@/routes/paths";
import { useNotificacion } from "@/context/NotificacionContext";

const API_URL = import.meta.env.VITE_API_URL;

const resendSchema = z.object({
  email: z.string().email("Correo inválido"),
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
      const res = await fetch(`${API_URL}/api/auth/resend-confirmation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json().catch(() => ({}));

      // ================================
      // ⚠ Caso 3: Correo ya confirmado
      // ================================
      if (json.code === "EMAIL_ALREADY_CONFIRMED") {
        agregarNotificacion("Este correo ya está confirmado.", "info");
        navigate(PATHS.AUTH_ALREADY_CONFIRMED, { replace: true });
        return;
      }

      // ================================
      // ⚠ Caso error inesperado
      // ================================
      if (!res.ok || json.ok === false) {
        agregarNotificacion(
          json.message || "No se pudo reenviar el correo.",
          "error"
        );
        return;
      }

      // ================================
      // ✔ Caso 1 y 2 → mostrar éxito SIEMPRE
      // ================================
      agregarNotificacion(
        "Si la cuenta existe, se enviará un nuevo enlace.",
        "success"
      );

      navigate(PATHS.AUTH_EMAIL_SENT, { replace: true });

    } catch (error) {
      console.error("❌ Error reenviando:", error);
      agregarNotificacion("Error de conexión", "error");
    }
  };

  return (
    <AuthBGLayout backgroundImage={heroCabana}>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="space-y-8"
      >
        <AuthHeader
          title="Reenviar confirmación"
          subtitle="Ingresa tu correo para generar un nuevo enlace"
        />

        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:text-gray-900 mb-2"
        >
          ← Volver
        </button>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AuthInput
            label="Correo electrónico"
            placeholder="usuario@sindicatoenap.cl"
            error={errors.email?.message}
            type="email"
            {...register("email")}
          />

          <AuthButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Reenviar enlace"}
          </AuthButton>
        </form>
      </motion.div>
    </AuthBGLayout>
  );
}
