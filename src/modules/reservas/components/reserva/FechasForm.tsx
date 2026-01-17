// =====================================================================
// FechasForm.tsx — ENAP 2025 (UX ONLY · FINAL SYNC)
// =====================================================================

import React from "react";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";

import { ReservaFrontendType } from "@/modules/reservas/schemas/reserva.schema";
import { useNotificacion } from "@/shared/providers/NotificacionProvider";
import { parseYmdLocal } from "@/shared/lib";

interface Props {
  register: UseFormRegister<ReservaFrontendType>;
  watch: UseFormWatch<ReservaFrontendType>;
  setValue: UseFormSetValue<ReservaFrontendType>;
  errors: FieldErrors<ReservaFrontendType>;

  minDate: string;
  espacioTipo: "CABANA" | "QUINCHO" | "PISCINA";
}

const isMonday = (d: Date) => d.getDay() === 1;

const FechasForm: React.FC<Props> = ({
  register,
  watch,
  setValue,
  errors,
  minDate,
  espacioTipo,
}) => {
  const { agregarNotificacion } = useNotificacion();

  const inicio = watch("fechaInicio");
  const fin = watch("fechaFin");

  /* ============================================================
   * INICIO — UX
   * ============================================================ */
  const onInicioChange = (value: string) => {
    const i = parseYmdLocal(value);
    if (!i) return;

    // Aviso UX (NO bloqueo)
    if (espacioTipo !== "PISCINA" && isMonday(i)) {
      agregarNotificacion(
        "Los lunes el recinto se encuentra en mantención.",
        "info"
      );
    }

    setValue("fechaInicio", value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    // Piscina = mismo día
    if (espacioTipo === "PISCINA") {
      setValue("fechaFin", value, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    // Autocompletar fin si no existe
    if (!fin) {
      const autoFin = new Date(i);
      autoFin.setDate(i.getDate() + 3);

      setValue("fechaFin", autoFin.toISOString().slice(0, 10), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  };

  /* ============================================================
   * FIN — UX
   * ============================================================ */
  const onFinChange = (value: string) => {
    setValue("fechaFin", value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold text-enap-azul">
        Fechas de tu reserva
      </legend>

      {/* FECHA INICIO */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Fecha de inicio
        </label>

        <input
          type="date"
          min={minDate}
          {...register("fechaInicio", {
            onChange: (e) => onInicioChange(e.target.value),
          })}
          className="w-full rounded-lg border px-4 py-3 shadow-sm
                     focus:ring-2 focus:ring-enap-cyan"
        />

        {errors.fechaInicio && (
          <p className="text-xs text-red-600">
            {errors.fechaInicio.message}
          </p>
        )}
      </div>

      {/* FECHA FIN */}
      {espacioTipo !== "PISCINA" && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-gray-700">
            Fecha de término
          </label>

          <input
            type="date"
            min={inicio || minDate}
            {...register("fechaFin", {
              onChange: (e) => onFinChange(e.target.value),
            })}
            className="w-full rounded-lg border px-4 py-3 shadow-sm
                       focus:ring-2 focus:ring-enap-cyan"
          />

          {errors.fechaFin && (
            <p className="text-xs text-red-600">
              {errors.fechaFin.message}
            </p>
          )}
        </div>
      )}
    </fieldset>
  );
};

export default FechasForm;
