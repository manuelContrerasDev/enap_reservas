// ============================================================
// TerminosAceptacion.tsx — Checkbox ENAP
// ============================================================

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ReservaFrontendType } from "@/validators/reserva.schema";

interface Props {
  register: UseFormRegister<ReservaFrontendType>;
  errors: FieldErrors<ReservaFrontendType>;
}

const TerminosAceptacion: React.FC<Props> = ({ register, errors }) => {
  return (
    <div className="space-y-1">
      <label className="flex items-center gap-3 text-sm text-gray-700">
        <input
          type="checkbox"
          {...register("terminosAceptados")}
          className="h-4 w-4 text-[#005D73] focus:ring-[#005D73]"
        />
        <span>Acepto los términos y condiciones de uso del recinto.</span>
      </label>

      {errors.terminosAceptados && (
        <span className="text-xs text-red-600">
          {errors.terminosAceptados.message}
        </span>
      )}
    </div>
  );
};

export default TerminosAceptacion;
