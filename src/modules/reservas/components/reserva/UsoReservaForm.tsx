// ============================================================
// UsoReservaForm.tsx — ENAP 2025 (FINAL SYNC)
// ============================================================

import React from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";

import { ReservaFrontendType } from "@/modules/reservas/schemas/reserva.schema";
import ResponsableForm from "./ResponsableForm";

interface Props {
  register: UseFormRegister<ReservaFrontendType>;
  watch: UseFormWatch<ReservaFrontendType>;
  setValue: UseFormSetValue<ReservaFrontendType>;
  errors: FieldErrors<ReservaFrontendType>;
}

export const UsoReservaForm: React.FC<Props> = ({
  register,
  watch,
  setValue,
  errors,
}) => {
  const socioPresente = watch("socioPresente");

  const toggleSocioPresente = (checked: boolean) => {
    setValue("socioPresente", checked, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (checked) {
      setValue("nombreResponsable", null);
      setValue("rutResponsable", null);
      setValue("emailResponsable", null);
    }
  };

  return (
    <section className="space-y-5 border-t pt-6">
      <h4 className="text-base font-semibold text-enap-azul">
        Uso de la reserva
      </h4>

      {/* Tipo de uso */}
      <div>
        <label className="text-sm font-medium text-gray-800">
          Tipo de uso
        </label>
        <select
          {...register("usoReserva")}
          className="mt-1 w-full rounded-lg border px-4 py-3 text-sm
            focus:ring-2 focus:ring-enap-cyan focus:border-enap-cyan"
        >
          <option value="USO_PERSONAL">Uso personal</option>
          <option value="CARGA_DIRECTA">Carga directa</option>
          <option value="TERCEROS">Terceros (uso externo)</option>
        </select>

        {errors.usoReserva && (
          <p className="text-xs text-red-600">
            {errors.usoReserva.message}
          </p>
        )}
      </div>

      {/* Socio presente */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={socioPresente}
          onChange={(e) => toggleSocioPresente(e.target.checked)}
          className="h-4 w-4 text-enap-cyan"
        />
        <label className="text-sm text-gray-700 cursor-pointer">
          El socio estará presente
        </label>
      </div>

      {/* Responsable */}
      {!socioPresente && (
        <ResponsableForm register={register} errors={errors} />
      )}
    </section>
  );
};

export default UsoReservaForm;
