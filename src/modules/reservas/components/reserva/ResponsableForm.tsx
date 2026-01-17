// ============================================================
// ResponsableForm.tsx — ENAP 2025 (FINAL SYNC)
// ============================================================

import React from "react";
import {
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";

import { ReservaFrontendType } from "@/modules/reservas/schemas/reserva.schema";

interface Props {
  register: UseFormRegister<ReservaFrontendType>;
  errors: FieldErrors<ReservaFrontendType>;
}

const ResponsableForm: React.FC<Props> = ({ register, errors }) => {
  return (
    <div className="space-y-4 rounded-lg border border-amber-300 bg-amber-50 p-4">
      <p className="text-xs font-semibold text-amber-800">
        Datos del responsable (obligatorio si el socio no asiste)
      </p>

      {/* Nombre */}
      <div>
        <label className="text-xs font-medium text-gray-700">
          Nombre del responsable
        </label>
        <input
          type="text"
          {...register("nombreResponsable")}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
        {errors.nombreResponsable && (
          <p className="text-xs text-red-600">
            {errors.nombreResponsable.message}
          </p>
        )}
      </div>

      {/* RUT */}
      <div>
        <label className="text-xs font-medium text-gray-700">
          RUT del responsable
        </label>
        <input
          type="text"
          {...register("rutResponsable")}
          className="w-full rounded-lg border px-3 py-2 text-sm"
        />
        {errors.rutResponsable && (
          <p className="text-xs text-red-600">
            {errors.rutResponsable.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="text-xs font-medium text-gray-700">
          Email del responsable
        </label>
        <input
          type="email"
          {...register("emailResponsable")}
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
