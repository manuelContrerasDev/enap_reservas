// ============================================================
// PersonasForm.tsx — Sincronizado ENAP + Validación estricta
// ============================================================

import React from "react";
import {
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { ReservaFrontendType } from "@/validators/reserva.schema";

interface Props {
  watch: UseFormWatch<ReservaFrontendType>;
  setValue: UseFormSetValue<ReservaFrontendType>;
  errors: FieldErrors<ReservaFrontendType>;
  maxCap: number;
}

const PersonasForm: React.FC<Props> = ({
  watch,
  setValue,
  errors,
  maxCap,
}) => {
  const personas = Number(watch("cantidadPersonas") ?? 1);

  const handleChange = (raw: string) => {
    const num = parseInt(raw, 10);

    if (isNaN(num)) {
      setValue("cantidadPersonas", 1, { shouldValidate: true });
      return;
    }

    const safe = Math.max(1, Math.min(maxCap, num));
    setValue("cantidadPersonas", safe, { shouldValidate: true });
  };

  return (
    <section className="space-y-3">
      <label className="text-sm font-medium text-gray-700">Cantidad de personas</label>

      <input
        type="number"
        min={1}
        max={maxCap}
        value={personas}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full rounded-lg border px-4 py-3"
      />

      {errors.cantidadPersonas && (
        <p className="text-xs text-red-600">{errors.cantidadPersonas.message}</p>
      )}

      <p className="text-xs text-gray-500">
        Capacidad máxima total: {maxCap} personas.
      </p>
    </section>
  );
};


export default PersonasForm;
