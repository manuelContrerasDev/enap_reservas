// src/pages/auth/LoginPage.tsx
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import AuthBGLayout from "@/auth/components/AuthBGLayout";
import AuthHeader from "@/auth/components/AuthHeader";
import AuthInput from "@/auth/components/AuthInput";
import AuthButton from "@/auth/components/AuthButton";

import { loginSchema, LoginSchemaType } from "@/validators/auth.schema";
import { useAuth } from "@/context/AuthContext";
import { PATHS } from "@/routes/paths";

import heroCabana from "@/assets/enap-login.png";
import logoEnap from "@/assets/logo-enap.png";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, user } = useAuth();

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) navigate("/app", { replace: true });
  }, [user]);

  const onSubmit = async (data: LoginSchemaType) => {
    setServerError(null);

    const result = await login(data.email, data.password);
    console.log("LOGIN_RESULT:", result);

    if (!result.ok) {
      const email = data.email;

      setValue("email", email, { shouldDirty: true });
      setValue("password", "");

      switch (result.error) {
        case "USER_NOT_FOUND":
          return setServerError("El correo ingresado no está registrado.");
        case "INVALID_PASSWORD":
          return setServerError("La contraseña es incorrecta.");
        case "EMAIL_NOT_CONFIRMED":
          return setServerError(
            "Tu correo aún no está confirmado. Revisa tu bandeja de entrada."
          );
        default:
          return setServerError(
            "No se pudo iniciar sesión. Inténtalo nuevamente."
          );
      }
    }

    navigate("/app");
  };

  return (
    <AuthBGLayout backgroundImage={heroCabana}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="space-y-10 w-full max-w-md"
      >
        {/* LOGO + HEADER */}
        <div className="flex flex-col items-center text-center space-y-3">
          <img
            src={logoEnap}
            className="w-20 mb-1 drop-shadow-md"
            alt="ENAP Logo"
          />

          <AuthHeader
            title="Reservas ENAP"
            subtitle="Ingresa con tu correo y contraseña para continuar"
          />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <AuthInput
            label="Correo"
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

          {/* SERVER ERROR */}
          {serverError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 text-sm text-center font-medium"
            >
              {serverError}
            </motion.p>
          )}

          <AuthButton type="submit" loading={isLoading}>
            Ingresar
          </AuthButton>
        </form>

        {/* LINKS */}
        <div className="text-center text-sm space-y-1">
          <button
            onClick={() => navigate(PATHS.AUTH_RESET_REQUEST)}
            className="text-[#003D52] font-medium hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>

          <br />

          <button
            onClick={() => navigate(PATHS.AUTH_REGISTER)}
            className="text-[#C7A96A] font-semibold hover:text-[#b09058]"
          >
            Crear cuenta →
          </button>
        </div>
      </motion.div>
    </AuthBGLayout>
  );
}
