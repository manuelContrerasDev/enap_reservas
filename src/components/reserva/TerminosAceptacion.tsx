import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { ReservaFrontendType } from "@/validators/reserva.schema";

interface Props {
  register: UseFormRegister<ReservaFrontendType>;
  errors: FieldErrors<ReservaFrontendType>;
}

const TerminosAceptacion: React.FC<Props> = ({ register, errors }) => {
  return (
    <div className="flex items-start gap-3 text-xs text-gray-700">
      <input
        id="terminosAceptados"
        type="checkbox"
        {...register("terminosAceptados")}
        className="mt-0.5 cursor-pointer"
      />

      <label
        htmlFor="terminosAceptados"
        className="cursor-pointer leading-tight"
      >
        Declaro que he leído y acepto las políticas y condiciones de uso del
        Centro Recreacional ENAP Limache.
      </label>

      {errors.terminosAceptados && (
        <p className="text-red-600 text-xs">
          {errors.terminosAceptados.message}
        </p>
      )}
    </div>
  );
};

export default TerminosAceptacion;
