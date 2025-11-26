import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetRequestSchema,
  ResetRequestSchemaType,
} from "@/validators/auth.schema";

import { useAuthForm } from "@/hooks/useAuthForm";
import LoginBase from "@/auth/components/LoginBase";
import { useNotificacion } from "@/context/NotificacionContext";
import { useNavigate } from "react-router-dom";

export default function ResetRequestPage() {
  const navigate = useNavigate();
  const { agregarNotificacion } = useNotificacion();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetRequestSchemaType>({
    resolver: zodResolver(resetRequestSchema),
  });

  const { loading, serverError, handleSubmit: send } = useAuthForm(
    resetRequestSchema,
    "/api/auth/reset-request"
  );

  const onSubmit = async (data: ResetRequestSchemaType) => {
    const result = await send(data);

    if (result.ok) {
      agregarNotificacion(
        "Si el correo existe, recibirás un enlace de recuperación.",
        "info"
      );
    }
  };

  return (
    <LoginBase
      title="Recuperar contraseña"
      description="Ingresa tu correo para recibir instrucciones"
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
          {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#00796B] text-white font-semibold py-3 rounded-lg shadow-md hover:bg-[#00695C] transition-all"
        >
          {loading ? "Enviando..." : "Enviar instrucciones"}
        </button>
      </form>
    </LoginBase>
  );
}
