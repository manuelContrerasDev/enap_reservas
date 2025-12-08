// ============================================================
// UsoReservaForm.tsx — Sincronizado ENAP + Validación PRO
// ============================================================

import React from "react";
import {
  UseFormRegister,
  UseFormSetValue,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";

import { ReservaFrontendType } from "@/validators/reserva.schema";
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
  const usoReserva = watch("usoReserva");
  const socioPresente = watch("socioPresente");

  const handleUso = (value: string) => {
    setValue("usoReserva", value as ReservaFrontendType["usoReserva"], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <section className="space-y-5 border-t pt-6">
      <h4 className="text-base font-semibold text-enap-azul">
        Uso de la reserva
      </h4>

      {/* ============================
          TIPO DE USO
      ============================ */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-800">
          Tipo de uso
        </label>

        <select
          value={usoReserva}
          onChange={(e) => handleUso(e.target.value)}
          className="
            mt-1 w-full rounded-lg border px-4 py-3 text-sm
            focus:ring-2 focus:ring-enap-cyan focus:border-enap-cyan
          "
        >
          <option value="USO_PERSONAL">Uso personal</option>
          <option value="CARGA_DIRECTA">Carga directa</option>
          <option value="TERCEROS">Terceros (uso externo)</option>
        </select>

        {errors.usoReserva && (
          <p className="text-xs text-red-600">{errors.usoReserva.message}</p>
        )}
      </div>

      {/* ============================
          SOCIO PRESENTE
      ============================ */}
      <div className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          checked={socioPresente}
          onChange={(e) =>
            setValue("socioPresente", e.target.checked, {
              shouldValidate: true,
              shouldDirty: true,
            })
          }
          className="h-4 w-4 text-enap-cyan"
        />

        <label className="text-sm text-gray-700 cursor-pointer">
          El socio estará presente
        </label>
      </div>

      {/* ============================
          RESPONSABLE (SI NO VIENE EL SOCIO)
      ============================ */}
      {!socioPresente && (
        <div className="mt-4 bg-gray-50 border rounded-xl p-4 shadow-inner">
          <ResponsableForm
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />
        </div>
      )}
    </section>
  );
};

export default UsoReservaForm;
