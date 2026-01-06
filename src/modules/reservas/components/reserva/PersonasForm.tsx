// ============================================================
// PersonasForm.tsx — ENAP 2025 (Auditado y sincronizado)
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
  const personas = watch("cantidadPersonas") ?? 1;

  const clamp = (num: number) => Math.max(1, Math.min(maxCap, num));

  const updatePersonas = (value: number) => {
    const safe = clamp(value);
    setValue("cantidadPersonas", safe, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const increment = () => updatePersonas((personas ?? 1) + 1);
  const decrement = () => updatePersonas((personas ?? 1) - 1);

  const handleInputChange = (val: string) => {
    const n = parseInt(val, 10);
    if (isNaN(n)) {
      updatePersonas(1);
      return;
    }
    updatePersonas(n);
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-lg font-semibold text-[#002E3E]">
        Cantidad de personas
      </legend>

      <div className="flex items-center gap-3">
        {/* BTN - */}
        <button
          type="button"
          onClick={decrement}
          disabled={personas <= 1}
          aria-label="Disminuir cantidad"
          className={`
            w-10 h-10 flex items-center justify-center rounded-lg
            bg-gray-200 text-gray-700 text-xl font-bold transition
            ${
              personas <= 1
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-gray-300"
            }
          `}
        >
          −
        </button>

        {/* INPUT */}
        <input
          type="number"
          min={1}
          max={maxCap}
          {...register("cantidadPersonas", {
            valueAsNumber: true,
            onChange: (e) => handleInputChange(e.target.value),
          })}
          className="
            w-full rounded-lg border px-4 py-3 text-center font-semibold
            shadow-sm focus:ring-2 focus:ring-[#005D73] focus:border-[#005D73]
          "
        />

        {/* BTN + */}
        <button
          type="button"
          onClick={increment}
          disabled={personas >= maxCap}
          aria-label="Aumentar cantidad"
          className={`
            w-10 h-10 flex items-center justify-center rounded-lg
            bg-gray-200 text-gray-700 text-xl font-bold transition
            ${
              personas >= maxCap
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-gray-300"
            }
          `}
        >
          +
        </button>
      </div>

      {errors.cantidadPersonas && (
        <p className="text-xs text-red-600">
          {errors.cantidadPersonas.message}
        </p>
      )}

      <p className="text-xs text-gray-600">
        Capacidad máxima permitida: <strong>{maxCap}</strong> personas.
      </p>
    </fieldset>
  );
};

export default PersonasForm;
