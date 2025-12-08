// src/auth/components/RegisterForm.tsx

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { api } from "@/lib/axios";
import { registerSchema, RegisterSchemaType } from "@/validators/auth.schema";

import AuthInput from "@/modules/auth/components/AuthInput";
import AuthButton from "@/modules/auth/components/AuthButton";

// ✅ Respuesta REAL del backend
interface RegisterResponse {
  ok: boolean;
  code?: string;     // <-- AGREGADO
  message?: string;  // <-- AGREGADO
}

const registerFormSchema = registerSchema
  .extend({
    password2: z.string().min(6, "Repite la contraseña"),
  })
  .refine((d) => d.password === d.password2, {
    message: "Las contraseñas no coinciden",
    path: ["password2"],
  });

type RegisterFormValues = RegisterSchemaType & { password2: string };

interface RegisterFormProps {
  loading?: boolean;
  onStartLoading?: () => void;
  onFinishLoading?: () => void;
  onError?: (msg: string) => void;
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  loading,
  onStartLoading,
  onFinishLoading,
  onError,
  onSuccess,
}) => {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerFormSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    onStartLoading?.();

    try {
      const res = await api.post<RegisterResponse>("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      // ===============================
      // ❌ Caso error de backend
      // ===============================
      if (!res.data.ok) {
        let msg = res.data.message ?? "No se pudo crear la cuenta.";

        // Interpretar codes del backend
        switch (res.data.code) {
          case "EMAIL_ALREADY_EXISTS":
            msg = "Este correo ya está registrado. ¿Deseas reenviar el correo de confirmación?";
            break;

          case "INVALID_EMAIL":
            msg = "El correo no es válido.";
            break;

          case "WEAK_PASSWORD":
            msg = "La contraseña es demasiado débil.";
            break;

          case "EMAIL_SEND_ERROR":
            msg =
              "Cuenta creada pero NO se pudo enviar el correo de confirmación. Intenta reenviarlo.";
            break;
        }

        setServerError(msg);
        onError?.(msg);
        return;
      }

      // ===============================
      // 🟩 Caso éxito
      // ===============================
      onSuccess?.();

    } catch (err: any) {
      console.error("❌ Error registrando usuario:", err);

      const msg =
        err?.response?.data?.message ||
        "Error inesperado al registrar. Inténtalo nuevamente.";

      setServerError(msg);
      onError?.(msg);
    } finally {
      onFinishLoading?.();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {serverError && (
        <p className="text-red-600 text-sm text-center font-medium">
          {serverError}
        </p>
      )}

      <AuthInput
        label="Nombre"
        error={errors.name?.message}
        placeholder="Ingresa tu nombre"
        {...register("name")}
      />

      <AuthInput
        label="Correo electrónico"
        error={errors.email?.message}
        placeholder="usuario@sindicatoenap.cl"
        {...register("email")}
      />

      <AuthInput
        type="password"
        label="Contraseña"
        error={errors.password?.message}
        placeholder="••••••••"
        {...register("password")}
      />

      <AuthInput
        type="password"
        label="Repetir contraseña"
        error={errors.password2?.message}
        placeholder="••••••••"
        {...register("password2")}
      />

      <AuthButton type="submit" disabled={isSubmitting || loading}>
        {isSubmitting || loading ? "Creando cuenta..." : "Crear cuenta"}
      </AuthButton>
    </form>
  );
};
