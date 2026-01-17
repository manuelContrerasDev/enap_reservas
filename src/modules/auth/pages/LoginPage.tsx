// src/pages/auth/LoginPage.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { loginSchema, LoginSchemaType } from "@/modules/auth/schemas/auth.schema";
import { useAuth } from "@/modules/auth/hooks";
import { PATHS } from "@/app/router/paths";

import AuthCardLayout from "@/modules/auth/components/AuthCardLayout";
import AuthInput from "@/modules/auth/components/AuthInput";
import AuthButton from "@/modules/auth/components/AuthButton";

import { mapAuthError } from "@/modules/auth/helpers/auth.error-mapper";
import { AuthErrorCode } from "@/modules/auth/types/auth.errors";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  /* ============================================================
   * 🔁 Sesión activa → redirect
   * ============================================================ */
  useEffect(() => {
    if (!user) return;

    navigate(
      user.role === "ADMIN"
        ? PATHS.ADMIN_HOME
        : PATHS.SOCIO_HOME,
      { replace: true }
    );
  }, [user, navigate]);

  /* ============================================================
   * 🚪 SUBMIT LOGIN
   * ============================================================ */
  const onSubmit = async (data: LoginSchemaType) => {
    setServerError(null);

    const result = await login(data.email, data.password);

    if (!result.ok) {
      // Limpia password por seguridad UX
      setValue("password", "");

      setServerError(
        mapAuthError(result.error as AuthErrorCode)
      );

      return;
    }

    // Redirect final lo maneja el useEffect
  };

  return (
    <AuthCardLayout
      title="Centro Vacacional Sindicato ENAP"
      description="Ingresa con tu correo y contraseña para continuar"
    >
      <form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6"
        aria-live="polite"
      >
        <AuthInput
          label="Correo electrónico"
          type="email"
          placeholder="usuario@sindicatoenap.cl"
          {...register("email")}
          error={errors.email?.message}
        />

        <AuthInput
          type="password"
          label="Contraseña"
          placeholder="••••••••"
          {...register("password")}
          error={errors.password?.message}
        />

        {serverError && (
          <p
            role="alert"
            className="text-red-600 text-sm text-center font-medium"
          >
            {serverError}
          </p>
        )}

        <AuthButton type="submit" loading={isSubmitting}>
          Ingresar
        </AuthButton>
      </form>

      <div className="text-center text-sm space-y-2 mt-6">
        <button
          type="button"
          onClick={() => navigate(PATHS.AUTH_RESET_REQUEST)}
          className="text-[#003D52] font-medium hover:underline"
        >
          ¿Olvidaste tu contraseña?
        </button>

        <button
          type="button"
          onClick={() => navigate(PATHS.AUTH_REGISTER)}
          className="block mx-auto text-[#252015] font-semibold hover:text-[#b09058]"
        >
          Crear cuenta →
        </button>
      </div>
    </AuthCardLayout>
  );
}
