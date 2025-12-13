// AdminStep2_CantidadesResumen.tsx — UX/UI Premium ENAP 2025

import React, { useMemo } from "react";
import { StepHeader } from "./StepHeader";

import type {
  UseFormRegister,
  FieldErrors,
  UseFormWatch,
} from "react-hook-form";

import type { ReservaManualPayload } from "@/validators/reservaManual.schema";
import { CLP } from "@/utils/formatters";
import { differenceInCalendarDays } from "date-fns";

interface Props {
  register: UseFormRegister<ReservaManualPayload>;
  watch: UseFormWatch<ReservaManualPayload>;
  errors: FieldErrors<ReservaManualPayload>;
}

export const AdminStep2_CantidadesResumen: React.FC<Props> = ({
  register,
  watch,
  errors,
}) => {
  // ============================================================
  // Valores reactivos

  const fechaInicio = watch("fechaInicio");
  const fechaFin = watch("fechaFin");
  const adultos = Number(watch("cantidadAdultos") ?? 0);
  const ninos = Number(watch("cantidadNinos") ?? 0);
  const piscina = Number(watch("cantidadPiscina") ?? 0);

  // ============================================================
  // Cálculo de días

  const dias = useMemo(() => {
    if (!fechaInicio || !fechaFin) return 0;
    const d = differenceInCalendarDays(new Date(fechaFin), new Date(fechaInicio));
    return d > 0 ? d : 0;
  }, [fechaInicio, fechaFin]);

  // ============================================================
  // Total estimado (placeholder)

  const totalEstimado = useMemo(() => {
    const base = adultos * 3000 + ninos * 1500 + piscina * 2000;
    return base * (dias || 1);
  }, [adultos, ninos, piscina, dias]);

  // ============================================================
  // RENDER

  return (
    <div className="space-y-10">

      {/* ============================================================ */}
      {/* CANTIDADES */}

      <div className="card-enap p-6 rounded-xl">
        <StepHeader
          title="Cantidades y Asistentes"
          subtitle="Ingrese el número de personas que utilizarán el espacio"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

          {/* Adultos */}
          <div className="form-group">
            <label className="label-enap">Cantidad de Adultos</label>
            <input
              {...register("cantidadAdultos")}
              type="number"
              min={0}
              className="input-enap"
            />
            {errors.cantidadAdultos && (
              <p className="err">{errors.cantidadAdultos.message}</p>
            )}
          </div>

          {/* Niños */}
          <div className="form-group">
            <label className="label-enap">Cantidad de Niños</label>
            <input
              {...register("cantidadNinos")}
              type="number"
              min={0}
              className="input-enap"
            />
            {errors.cantidadNinos && (
              <p className="err">{errors.cantidadNinos.message}</p>
            )}
          </div>

          {/* Piscina */}
          <div className="form-group">
            <label className="label-enap">Uso Piscina</label>
            <input
              {...register("cantidadPiscina")}
              type="number"
              min={0}
              className="input-enap"
            />
            {errors.cantidadPiscina && (
              <p className="err">{errors.cantidadPiscina.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RESUMEN PREMIUM */}
      
      <div className="card-enap p-6 rounded-xl">
        <StepHeader
          title="Resumen de la Reserva"
          subtitle="Información consolidada para confirmar"
        />

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* DETALLES */}
          <div className="resume-box">
            <h4 className="resume-title">Detalles</h4>

            <div className="resume-list">
              <p><strong>Fecha inicio:</strong> {fechaInicio || "-"}</p>
              <p><strong>Fecha fin:</strong> {fechaFin || "-"}</p>
              <p><strong>Total de días:</strong> {dias}</p>
            </div>
          </div>

          {/* ASISTENTES */}
          <div className="resume-box">
            <h4 className="resume-title">Asistentes</h4>

            <div className="resume-list">
              <p><strong>Adultos:</strong> {adultos}</p>
              <p><strong>Niños:</strong> {ninos}</p>
              <p><strong>Uso Piscina:</strong> {piscina}</p>
            </div>
          </div>
        </div>

        {/* TOTAL FINAL */}
        <div className="mt-8 bg-white rounded-xl border p-6 shadow-sm flex justify-between items-center">
          <span className="text-lg font-medium text-gray-700">Total estimado</span>

          <span className="text-3xl font-bold text-emerald-600 tracking-tight">
            {CLP(totalEstimado)}
          </span>
        </div>
      </div>
    </div>
  );
};
