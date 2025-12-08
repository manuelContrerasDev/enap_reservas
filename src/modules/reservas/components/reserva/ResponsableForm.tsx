// src/components/reserva/ResponsableForm.tsx
import React from "react";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { ReservaFrontendType } from "@/validators/reserva.schema";

interface Props {
  register: UseFormRegister<ReservaFrontendType>;
  watch: UseFormWatch<ReservaFrontendType>;
  setValue: UseFormSetValue<ReservaFrontendType>;
  errors: FieldErrors<ReservaFrontendType>;
}

const ResponsableForm: React.FC<Props> = ({
  register,
  watch,
  setValue,
  errors,
}) => {
  const nombre = watch("nombreResponsable") || "";
  const rut = watch("rutResponsable") || "";
  const email = watch("emailResponsable") || "";

  return (
    <div className="mt-3 space-y-3 rounded-lg border border-amber-300 bg-amber-50 p-4">
      <p className="text-xs font-semibold text-amber-800">
        Datos del responsable (obligatorio si el socio no asiste)
      </p>

      {/* Nombre */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700">
          Nombre del responsable
        </label>

        <input
          type="text"
          placeholder="Nombre del responsable"
          value={nombre}
          onChange={(e) =>
            setValue("nombreResponsable", e.target.value, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />

        {errors.nombreResponsable && (
          <p className="text-xs text-red-600">
            {errors.nombreResponsable.message}
          </p>
        )}
      </div>

      {/* RUT */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700">
          RUT del responsable
        </label>

        <input
          type="text"
          placeholder="RUT del responsable"
          {...register("rutResponsable")}
          value={rut}
          onChange={(e) =>
            setValue("rutResponsable", e.target.value, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />

        {errors.rutResponsable && (
          <p className="text-xs text-red-600">
            {errors.rutResponsable.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700">
          Email del responsable
        </label>

        <input
          type="email"
          placeholder="Correo de contacto"
          {...register("emailResponsable")}
          value={email}
          onChange={(e) =>
            setValue("emailResponsable", e.target.value, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />

        {errors.emailResponsable && (
          <p className="text-xs text-red-600">
            {errors.emailResponsable.message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResponsableForm;
