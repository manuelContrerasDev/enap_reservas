import { useSearchParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  resetPasswordSchema,
  ResetPasswordSchemaType,
} from "@/validators/auth.schema";

import { useAuthForm } from "@/hooks/useAuthForm";
import LoginBase from "@/auth/components/LoginBase";
import { useNotificacion } from "@/context/NotificacionContext";

export default function ResetConfirmPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { agregarNotificacion } = useNotificacion();

  const token = params.get("token") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const { loading, serverError, handleSubmit: send } = useAuthForm(
    resetPasswordSchema,
    "/api/auth/reset-password"
  );

  const onSubmit = async (data: ResetPasswordSchemaType) => {
    const result = await send(data);

    if (result.ok) {
      agregarNotificacion("Contraseña actualizada correctamente", "success");
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <LoginBase
      title="Restablecer contraseña"
      description="Ingresa tu nueva contraseña"
      gradientFrom="#4DB6AC"
      gradientTo="#00796B"
      accentColor="#00796B"
      loading={loading}
      errorMessage={serverError ?? undefined}
    >
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-600 hover:text-gray-900 mb-4"
      >
        ← Volver
      </button>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...register("token")} />

        {/* Nueva contraseña */}
        <div className="flex flex-col space-y-1">
          <label className="text-sm font-medium text-gray-700">Nueva contraseña</label>
          <input
            type="password"
            {...register("newPassword")}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white 
            focus:ring-2 focus:ring-[#00796B] focus:border-[#00796B] outline-none"
            placeholder="••••••••"
          />
          {errors.newPassword && (
            <p className="text-red-600 text-sm">{errors.newPassword.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00796B] text-white font-semibold py-3 rounded-lg shadow-md hover:bg-[#00695C] transition-all"
        >
          {loading ? "Actualizando..." : "Guardar nueva contraseña"}
        </button>
      </form>
    </LoginBase>
  );
}
