// ============================================================
// PersonasForm.tsx — UX/UI Premium ENAP + Validación estricta
// ============================================================

import React from "react";
import {
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

import { ReservaFrontendType } from "@/validators/reserva.schema";

interface Props {
  register: UseFormRegister<ReservaFrontendType>;
  watch: UseFormWatch<ReservaFrontendType>;
  setValue: UseFormSetValue<ReservaFrontendType>;
  errors: FieldErrors<ReservaFrontendType>;
  maxCap: number;
}

const PersonasForm: React.FC<Props> = ({
  register,
  watch,
  setValue,
  errors,
  maxCap,
}) => {
  const personas = Number(watch("cantidadPersonas") ?? 1);

  const clamp = (num: number) => {
    return Math.max(1, Math.min(maxCap, num));
  };

  const updatePersonas = (newValue: number) => {
    const safe = clamp(newValue);
    setValue("cantidadPersonas", safe, { shouldValidate: true });
  };

  const handleChange = (raw: string) => {
    const num = parseInt(raw, 10);
    if (isNaN(num)) return updatePersonas(1);
    updatePersonas(num);
  };

  const increment = () => updatePersonas(personas + 1);
  const decrement = () => updatePersonas(personas - 1);

  return (
    <fieldset className="space-y-2">
      <legend className="text-lg font-semibold text-[#002E3E]">
        Cantidad de personas
      </legend>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrement}
          disabled={personas <= 1}
          className={`
            w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200
            text-gray-700 text-xl font-bold transition
            ${personas <= 1 ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-300"}
          `}
        >
          −
        </button>

        <input
          type="number"
          min={1}
          max={maxCap}
          {...register("cantidadPersonas", { valueAsNumber: true })}
          value={personas}
          onChange={(e) => handleChange(e.target.value)}
          className="
            w-full rounded-lg border px-4 py-3 text-center font-semibold
            shadow-sm focus:ring-2 focus:ring-[#005D73] focus:border-[#005D73]
          "
        />

        <button
          type="button"
          onClick={increment}
          disabled={personas >= maxCap}
          className={`
            w-10 h-10 flex items-center justify-center rounded-lg bg-gray-200
            text-gray-700 text-xl font-bold transition
            ${personas >= maxCap ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-300"}
          `}
        >
          +
        </button>
      </div>

      {errors.cantidadPersonas && (
        <p className="text-xs text-red-600">{errors.cantidadPersonas.message}</p>
      )}

      <p className="text-xs text-gray-500">
        Capacidad máxima: <strong>{maxCap}</strong> personas.
      </p>
    </fieldset>
  );
};

export default PersonasForm;
