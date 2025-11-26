import React from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";
import { ReservaFrontendType } from "@/validators/reserva.schema";
import { parseYmdLocal } from "@/lib";

interface Props {
  register: UseFormRegister<ReservaFrontendType>;
  watch: UseFormWatch<ReservaFrontendType>;
  setValue: UseFormSetValue<ReservaFrontendType>;
  errors: FieldErrors<ReservaFrontendType>;
  minDate: string;
}

const FechasForm: React.FC<Props> = ({
  register,
  setValue,
  watch,
  errors,
  minDate,
}) => {
  const inicio = watch("fechaInicio") || "";
  const fin = watch("fechaFin") || "";

  /** Maneja fechaInicio evitando ranges inválidos */
  const handleInicio = (value: string) => {
    setValue("fechaInicio", value, { shouldValidate: true });

    if (fin) {
      const f = parseYmdLocal(fin);
      const i = parseYmdLocal(value);

      if (f && i && f < i) {
        setValue("fechaFin", value, { shouldValidate: true });
      }
    }
  };

  return (
    <section className="space-y-3">
      {/* FECHA INICIO */}
      <label className="text-sm font-medium text-gray-700">
        Fecha de inicio
      </label>

      <input
        type="date"
        {...register("fechaInicio")}
        value={inicio}
        min={minDate}
        onChange={(e) => handleInicio(e.target.value)}
        className="w-full rounded-lg border px-4 py-3"
      />

      {errors.fechaInicio && (
        <p className="text-xs text-red-600">
          {errors.fechaInicio.message}
        </p>
      )}

      {/* FECHA FIN */}
      <label className="text-sm font-medium text-gray-700">
        Fecha de fin
      </label>

      <input
        type="date"
        {...register("fechaFin")}
        value={fin}
        min={inicio || minDate}
        onChange={(e) =>
          setValue("fechaFin", e.target.value, { shouldValidate: true })
        }
        className="w-full rounded-lg border px-4 py-3"
      />

      {errors.fechaFin && (
        <p className="text-xs text-red-600">
          {errors.fechaFin.message}
        </p>
      )}
    </section>
  );
};

export default FechasForm;
