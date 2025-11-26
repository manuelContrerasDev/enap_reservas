// src/pages/auth/LoginPage.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginSchemaType } from "@/validators/auth.schema";
import LoginBase from "@/auth/components/LoginBase";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useNotificacion } from "@/context/NotificacionContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { agregarNotificacion } = useNotificacion();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchemaType) => {
    setLoading(true);
    setServerError(null);

    const result = await login(data.email, data.password);

    if (!result.ok) {
      setServerError(result.error ?? "Credenciales incorrectas");
      agregarNotificacion("Correo o contraseña incorrectos", "error");
      setLoading(false);
      return;
    }

    agregarNotificacion("Bienvenido nuevamente", "success");

    const user = result.user!;
    setLoading(false);

    if (user.role === "ADMIN") navigate("/admin", { replace: true });
    else navigate("/espacios", { replace: true });
  };

  return (
    <LoginBase
      title="Acceder"
      description="Ingresa tus credenciales para continuar"
      gradientFrom="#00796B"
      gradientTo="#004D40"
      accentColor="#00796B"
      loading={loading}
      errorMessage={serverError ?? undefined}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* Email */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            {...register("email")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white 
            focus:ring-2 focus:ring-[#00796B] focus:border-[#00796B] outline-none"
            placeholder="correo@ejemplo.com"
          />
          {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
        </div>

        {/* Password */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            {...register("password")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white 
            focus:ring-2 focus:ring-[#00796B] focus:border-[#00796B] outline-none"
            placeholder="••••••••"
          />
          {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full text-white font-semibold py-3 rounded-lg shadow-md transition-all 
            ${loading ? "bg-gray-400" : "bg-[#00796B] hover:bg-[#00695C]"}`}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>

      {/* Links inferiores */}
      <div className="text-center mt-4">
        <button
          onClick={() => navigate("/auth/reset-request")}
          className="text-sm text-[#00796B] hover:text-[#004D40]"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <div className="text-center mt-6">
        <button
          onClick={() => navigate("/auth/registro")}
          className="text-[#00796B] hover:text-[#004D40] font-medium transition-colors"
        >
          ¿No tienes cuenta? Regístrate →
        </button>
      </div>
    </LoginBase>
  );
}
