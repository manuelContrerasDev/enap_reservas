// src/modules/auth/forms/RegisterForm.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { registerSchema, RegisterSchemaType } from "../schemas/auth.schema";
import { mapAuthError } from "../helpers/auth.error-mapper";
import { AuthErrorCode } from "../types/auth.errors";

import AuthInput from "../components/AuthInput";
import AuthButton from "../components/AuthButton";

interface RegisterFormProps {
  onSubmitRegister: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ ok: boolean; error?: AuthErrorCode }>;
  onSuccess?: () => void;
}

const formSchema = registerSchema
  .extend({
    password2: z.string().min(8, "Repite la contraseña"),
  })
  .refine((d) => d.password === d.password2, {
    message: "Las contraseñas no coinciden",
    path: ["password2"],
  });

type FormValues = RegisterSchemaType & { password2: string };

export default function RegisterForm({
  onSubmitRegister,
  onSuccess,
}: RegisterFormProps) {
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormValues) => {
    setServerError(null);

    const result = await onSubmitRegister(
      data.name ?? "",
      data.email,
      data.password
    );

    if (!result.ok) {
      setServerError(mapAuthError(result.error));
      return;
    }

    onSuccess?.();
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
      aria-live="polite"
    >
      {serverError && (
        <p
          role="alert"
          className="text-red-600 text-sm text-center font-medium"
        >
          {serverError}
        </p>
      )}

      <AuthInput
        label="Nombre"
        error={errors.name?.message}
        {...register("name")}
      />

      <AuthInput
        label="Correo electrónico"
        type="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <AuthInput
        label="Contraseña"
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />

      <AuthInput
        label="Repetir contraseña"
        type="password"
        error={errors.password2?.message}
        {...register("password2")}
      />

      <AuthButton loading={isSubmitting}>
        Crear cuenta
      </AuthButton>
    </form>
  );
}
