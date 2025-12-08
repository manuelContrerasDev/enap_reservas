// =====================================================================
//  FechasForm.tsx — Versión UX/UI Premium ENAP (SINCRONIZADA 100%)
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

  const inicio = watch("fechaInicio") || "";
  const fin = watch("fechaFin") || "";

  // ============================================================
  // VALIDAR SOLAPAMIENTOS
  // ============================================================
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

  // ============================================================
  // FECHA INICIO CAMBIO
  // ============================================================
  const handleInicio = (value: string) => {
    if (!value) return;

    const i = parseYmdLocal(value);
    if (!i) return;

    // ❌ Regla: NO iniciar lunes (solo cab/quincho)
    if (espacioTipo !== "PISCINA" && isMonday(i)) {
      agregarNotificacion("No puedes iniciar una reserva un día lunes.", "info");
      setValue("fechaInicio", "");
      return;
    }

    // Autocolocar fechaInicio
    setValue("fechaInicio", value, { shouldValidate: true });

    // =====================================================================
    // Piscina → fechaInicio === fechaFin (reserva por día)
    // =====================================================================
    if (espacioTipo === "PISCINA") {
      setValue("fechaFin", value, { shouldValidate: true });
      return;
    }

    // =====================================================================
    // CABANA / QUINCHO — autoajustar fin si queda inválido
    // =====================================================================

    if (fin) {
      const f = parseYmdLocal(fin);
      if (!f || f <= i) {
        // Autoajustar a 3 días
        const newFin = new Date(i);
        newFin.setDate(i.getDate() + 3);

        const iso = newFin.toISOString().slice(0, 10);
        setValue("fechaFin", iso, { shouldValidate: true });

        agregarNotificacion(
          "Ajustamos la fecha de término para cumplir mínimo 3 días.",
          "info"
        );
      }
    }
  };

  // ============================================================
  // FECHA FIN CAMBIO
  // ============================================================
  const handleFin = (value: string) => {
    if (!value) return;

    const f = parseYmdLocal(value);
    const i = parseYmdLocal(inicio);

    if (!f || !i) return;

    // Piscina → NO editar fechaFin
    if (espacioTipo === "PISCINA") {
      agregarNotificacion(
        "Piscina solo se reserva por 1 día. No puedes cambiar la fecha de término.",
        "info"
      );
      setValue("fechaFin", inicio, { shouldValidate: true });
      return;
    }

    // Terminar en lunes sí se permite → no validar
    // ❌ pero sí validar reglas de días
    const dias = diffDias(i, f);

    if (dias < 3) {
      agregarNotificacion("La reserva debe tener al menos 3 días.", "error");
      return;
    }

    if (dias > 6) {
      agregarNotificacion("La reserva no puede exceder 6 días.", "error");
      return;
    }

    // Validar solape
    if (haySolape(inicio, value)) {
      agregarNotificacion(
        "El espacio ya está reservado en ese rango de fechas.",
        "error"
      );
      return;
    }

    // Todo OK
    setValue("fechaFin", value, { shouldValidate: true });
  };

  return (
    <fieldset className="space-y-4">
      <legend className="text-lg font-semibold text-enap-azul">
        Fechas de tu reserva
      </legend>

      {/* -------------------------------------------------------- */}
      {/* FECHA INICIO */}
      {/* -------------------------------------------------------- */}
      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">
          Fecha de inicio
        </label>

        <input
          type="date"
          {...register("fechaInicio")}
          value={inicio}
          min={minDate}
          onChange={(e) => handleInicio(e.target.value)}
          className="
            w-full rounded-lg border px-4 py-3 shadow-sm
            focus:ring-2 focus:ring-enap-cyan focus:border-enap-cyan
          "
        />

        {errors.fechaInicio && (
          <p className="text-xs text-red-600">{errors.fechaInicio.message}</p>
        )}
      </div>

      {/* -------------------------------------------------------- */}
      {/* FECHA FIN */}
      {/* -------------------------------------------------------- */}
      {espacioTipo !== "PISCINA" && (
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Fecha de término
          </label>

          <input
            type="date"
            {...register("fechaFin")}
            value={fin}
            min={inicio || minDate}
            onChange={(e) => handleFin(e.target.value)}
            className="
              w-full rounded-lg border px-4 py-3 shadow-sm
              focus:ring-2 focus:ring-enap-cyan focus:border-enap-cyan
            "
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
