// ============================================================
// AdminStep3_Invitados.tsx — ENAP 2025
// ============================================================

import React from "react";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { StepHeader } from "./StepHeader";

interface Props {
  register: UseFormRegister<any>;
  watch: UseFormWatch<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
}

export const AdminStep3_Invitados: React.FC<Props> = ({
  register,
  watch,
  setValue,
  errors,
}) => {
  const invitados = watch("invitados") ?? [];

  return (
    <div className="card-enap p-6 rounded-xl space-y-6">
      <StepHeader title="Invitados" />

      {invitados.map((_: any, index: number) => (
        <div
          key={index}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 border p-4 rounded-lg"
        >
          <input
            placeholder="Nombre"
            {...register(`invitados.${index}.nombre`)}
          />

          <input
            placeholder="RUT"
            {...register(`invitados.${index}.rut`)}
          />

          <input
            type="number"
            placeholder="Edad"
            {...register(`invitados.${index}.edad`, {
              valueAsNumber: true,
            })}
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              {...register(`invitados.${index}.esPiscina`)}
            />
            Piscina
          </label>
        </div>
      ))}

      <button
        type="button"
        onClick={() =>
          setValue("invitados", [
            ...invitados,
            { nombre: "", rut: "", edad: undefined, esPiscina: false },
          ])
        }
      >
        + Agregar invitado
      </button>

      {errors.invitados && (
        <p className="err">Revise los datos de invitados</p>
      )}
    </div>
  );
};
