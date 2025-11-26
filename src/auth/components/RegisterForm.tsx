import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterSchemaType } from "@/validators/auth.schema";
import { useAuthForm } from "@/hooks/useAuthForm";
import { z } from "zod";
import { useNotificacion } from "@/context/NotificacionContext";
import { useNavigate } from "react-router-dom";

// Schema extendido con password2
const registerFormSchema = registerSchema
  .extend({
    password2: z.string().min(6, "Repite la contraseña"),
  })
  .refine((d) => d.password === d.password2, {
    message: "Las contraseñas no coinciden",
    path: ["password2"],
  });

export const RegisterForm = () => {
  const navigate = useNavigate();
  const { agregarNotificacion } = useNotificacion();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType & { password2: string }>({
    resolver: zodResolver(registerFormSchema),
  });

  const { loading, serverError, handleSubmit: send } = useAuthForm(
    registerSchema,
    "/api/auth/register"
  );

  const onSubmit = async (data: RegisterSchemaType & { password2: string }) => {
    const result = await send({
      name: data.name,
      email: data.email,
      password: data.password,
    });

    if (result.ok) {
      agregarNotificacion(
        "Cuenta creada correctamente 🎉 Revisa tu correo para confirmarla.",
        "success"
      );
      navigate("/auth/login", { replace: true });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {serverError && <p className="text-red-600 text-sm">{serverError}</p>}

      {/* Nombre */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">Nombre</label>
        <input
          {...register("name")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-[#00796B] focus:border-[#00796B] outline-none"
          placeholder="Tu nombre completo"
        />
        {errors.name && (
          <p className="text-red-600 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Correo */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Correo electrónico
        </label>
        <input
          {...register("email")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-[#00796B] focus:border-[#00796B] outline-none"
          placeholder="correo@ejemplo.com"
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}
      </div>

      {/* Contraseña */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">Contraseña</label>
        <input
          type="password"
          {...register("password")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-[#00796B] focus:border-[#00796B] outline-none"
          placeholder="••••••••"
        />
        {errors.password && (
          <p className="text-red-600 text-sm">{errors.password.message}</p>
        )}
      </div>

      {/* Repetir contraseña */}
      <div className="flex flex-col space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Repetir contraseña
        </label>
        <input
          type="password"
          {...register("password2")}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-[#00796B] focus:border-[#00796B] outline-none"
          placeholder="••••••••"
        />
        {errors.password2 && (
          <p className="text-red-600 text-sm">{errors.password2.message}</p>
        )}
      </div>

      {/* Botón */}
      <button
        disabled={loading}
        className="w-full bg-[#00796B] text-white font-semibold py-3 rounded-lg shadow-md hover:bg-[#00695C] transition-all disabled:bg-gray-400"
      >
        {loading ? "Creando cuenta..." : "Registrarme"}
      </button>
    </form>
  );
};
