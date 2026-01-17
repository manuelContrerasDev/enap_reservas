// ============================================================
// PersonasPiscinaForm.tsx — ENAP 2025 (FINAL SYNC)
// ============================================================

import React from "react";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";

import { ReservaFrontendType } from "@/modules/reservas/schemas/reserva.schema";

interface Props {
  register: UseFormRegister<ReservaFrontendType>;
  watch: UseFormWatch<ReservaFrontendType>;
  setValue: UseFormSetValue<ReservaFrontendType>;
  errors: FieldErrors<ReservaFrontendType>;
  max: number;
}

const PersonasPiscinaForm: React.FC<Props> = ({
  register,
  watch,
  setValue,
  errors,
  max,
}) => {
  const personasPiscina = watch("cantidadPersonasPiscina") ?? 0;
  const invitados = watch("invitados") ?? [];

  const clamp = (n: number) => Math.max(0, Math.min(max, n));

  const syncInvitadosPiscina = (limite: number) => {
    const marcados = invitados.filter((i) => i.esPiscina);

    if (marcados.length > limite) {
      let restantes = limite;

      const normalizados = invitados.map((i) => {
        if (!i.esPiscina) return i;

        if (restantes > 0) {
          restantes--;
          return i;
        }

        return { ...i, esPiscina: false };
      });

      setValue("invitados", normalizados, {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  const update = (n: number) => {
    const safe = clamp(n);

    setValue("cantidadPersonasPiscina", safe, {
      shouldDirty: true,
      shouldValidate: true,
    });

    syncInvitadosPiscina(safe);
  };

  const increment = () => update(personasPiscina + 1);
  const decrement = () => update(personasPiscina - 1);

  const handleManual = (val: string) => {
    const n = parseInt(val, 10);
    update(isNaN(n) ? 0 : n);
  };

  return (
    <fieldset className="space-y-2">
      <legend className="text-lg font-semibold text-[#002E3E]">
        Personas en Piscina
      </legend>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={decrement}
          disabled={personasPiscina <= 0}
          aria-label="Disminuir personas piscina"
          className={`w-10 h-10 flex items-center justify-center rounded-lg
            bg-gray-200 text-gray-700 text-xl font-bold transition
            ${
              personasPiscina <= 0
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
        >
          −
        </button>

        <input
          type="number"
          min={0}
          max={max}
          {...register("cantidadPersonasPiscina", {
            valueAsNumber: true,
            onChange: (e) => handleManual(e.target.value),
          })}
          className="w-full rounded-lg border px-4 py-3 text-center font-semibold
            shadow-sm focus:ring-2 focus:ring-[#005D73] focus:border-[#005D73]"
        />

        <button
          type="button"
          onClick={increment}
          disabled={personasPiscina >= max}
          aria-label="Aumentar personas piscina"
          className={`w-10 h-10 flex items-center justify-center rounded-lg
            bg-gray-200 text-gray-700 text-xl font-bold transition
            ${
              personasPiscina >= max
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-gray-300"
            }`}
        >
          +
        </button>
      </div>

      {errors.cantidadPersonasPiscina && (
        <p className="text-xs text-red-600">
          {errors.cantidadPersonasPiscina.message}
        </p>
      )}

      <p className="text-xs text-gray-600">
        Máximo permitido: <strong>{max}</strong> personas.
      </p>
    </fieldset>
  );
};

export default PersonasPiscinaForm;
