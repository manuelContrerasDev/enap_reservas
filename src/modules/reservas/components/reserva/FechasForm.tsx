// =====================================================================
//  FechasForm.tsx — ENAP 2025 (Auditado y sincronizado)
// =====================================================================

import React from "react";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";

import { ReservaFrontendType } from "@/validators/reserva.schema";
import { useNotificacion } from "@/context/NotificacionContext";
import { parseYmdLocal } from "@/lib";

// -------------------------------------------
// Helpers
// -------------------------------------------
const isMonday = (date: Date) => date.getDay() === 1;

const diffDias = (ini: Date, fin: Date) =>
  Math.ceil((fin.getTime() - ini.getTime()) / 86400000);

interface BloqueOcupado {
  fechaInicio: string;
  fechaFin: string;
}

interface Props {
  register: UseFormRegister<ReservaFrontendType>;
  watch: UseFormWatch<ReservaFrontendType>;
  setValue: UseFormSetValue<ReservaFrontendType>;
  errors: FieldErrors<ReservaFrontendType>;

  minDate: string;
  espacioTipo: "CABANA" | "QUINCHO" | "PISCINA";
  bloquesOcupados?: BloqueOcupado[];
}

const FechasForm: React.FC<Props> = ({
  register,
  watch,
  setValue,
  errors,
  minDate,
  espacioTipo,
  bloquesOcupados = [],
}) => {
  const { agregarNotificacion } = useNotificacion();

  const inicio = watch("fechaInicio");
  const fin = watch("fechaFin");

  // ------------------------------------------------------------
  // Validar solapamiento
  // ------------------------------------------------------------
  const haySolape = (iniStr: string, finStr: string) => {
    const i = parseYmdLocal(iniStr);
    const f = parseYmdLocal(finStr);
    if (!i || !f) return false;

    return bloquesOcupados.some((b) => {
      const bi = new Date(b.fechaInicio);
      const bf = new Date(b.fechaFin);
      return i <= bf && f >= bi;
    });
  };

  // ------------------------------------------------------------
  // Cambio inicio
  // ------------------------------------------------------------
  const onInicioChange = (value: string) => {
    const i = parseYmdLocal(value);
    if (!i) return;

    if (espacioTipo !== "PISCINA" && isMonday(i)) {
      agregarNotificacion(
        "No puedes iniciar una reserva un día lunes.",
        "info"
      );
      setValue("fechaInicio", "", { shouldDirty: true, shouldValidate: true });
      return;
    }

    setValue("fechaInicio", value, {
      shouldDirty: true,
      shouldValidate: true,
    });

    if (espacioTipo === "PISCINA") {
      setValue("fechaFin", value, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }

    if (fin) {
      const f = parseYmdLocal(fin);
      if (!f || f <= i) {
        const autoFin = new Date(i);
        autoFin.setDate(i.getDate() + 3);

        const iso = autoFin.toISOString().slice(0, 10);

        setValue("fechaFin", iso, {
          shouldDirty: true,
          shouldValidate: true,
        });

        agregarNotificacion(
          "Ajustamos la fecha de término para cumplir el mínimo de días.",
          "info"
        );
      }
    }
  };

  // ------------------------------------------------------------
  // Cambio fin
  // ------------------------------------------------------------
  const onFinChange = (value: string) => {
    if (!inicio) return;

    const i = parseYmdLocal(inicio);
    const f = parseYmdLocal(value);
    if (!i || !f) return;

    const dias = diffDias(i, f);

    if (dias < 3 || dias > 6) {
      agregarNotificacion(
        "La reserva debe ser entre 3 y 6 días.",
        "error"
      );
      setValue("fechaFin", "", { shouldDirty: true, shouldValidate: true });
      return;
    }

    if (haySolape(inicio, value)) {
      agregarNotificacion(
        "El espacio ya está reservado en ese rango de fechas.",
        "error"
      );
      setValue("fechaFin", "", { shouldDirty: true, shouldValidate: true });
      return;
    }

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
        <label className="block text-sm font-medium text-gray-700">
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
          <p className="text-xs text-red-600">{errors.fechaInicio.message}</p>
        )}
      </div>

      {/* FECHA FIN */}
      {espacioTipo !== "PISCINA" && (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
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
            <p className="text-xs text-red-600">{errors.fechaFin.message}</p>
          )}
        </div>
      )}
    </fieldset>
  );
};

export default FechasForm;
