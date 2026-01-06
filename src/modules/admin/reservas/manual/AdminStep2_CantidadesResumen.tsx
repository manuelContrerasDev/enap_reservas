import React, { useMemo } from "react";
import { StepHeader } from "./StepHeader";
import { differenceInCalendarDays } from "date-fns";
import { CLP } from "@/utils/formatters";

import type {
  UseFormRegister,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";

import type { ReservaManualFormValues } from "@/validators/reservaManual.schema";
import { useEspacios } from "@/context/EspaciosContext";

import { calcularTotalReservaPreview } from "@/utils/calcularTotalReservaPreview";
import { mapEspacioToCalculo } from "@/utils/mapEspacioToCalculo";
import { UsoReserva } from "@/types/enums";

interface Props {
  register: UseFormRegister<ReservaManualFormValues>;
  watch: UseFormWatch<ReservaManualFormValues>;
  errors: FieldErrors<ReservaManualFormValues>;
}

export const AdminStep2_CantidadesResumen: React.FC<Props> = ({
  register,
  watch,
  errors,
}) => {
  const { espacios } = useEspacios();

  const espacioId = watch("espacioId");
  const usoReservaRaw = watch("usoReserva");

  const fechaInicio = watch("fechaInicio");
  const fechaFin = watch("fechaFin");

  const cantidadAdultos = Number(watch("cantidadAdultos") ?? 0);
  const cantidadNinos = Number(watch("cantidadNinos") ?? 0);
  const cantidadPiscina = Number(watch("cantidadPiscina") ?? 0);

  const espacio = espacios.find((e) => e.id === espacioId);

  // ============================================================
  // usoReserva → normalizado (NO asumir enum)
  // ============================================================
  const usoReserva: UsoReserva =
    usoReservaRaw === "CARGA_DIRECTA"
      ? UsoReserva.CARGA_DIRECTA
      : usoReservaRaw === "TERCEROS"
      ? UsoReserva.TERCEROS
      : UsoReserva.USO_PERSONAL;

  // ============================================================
  // Días (alineado backend → inclusivo)
  // ============================================================
  const dias = useMemo(() => {
    if (!fechaInicio || !fechaFin) return 0;

    const diff = differenceInCalendarDays(
      new Date(fechaFin),
      new Date(fechaInicio)
    );

    return diff >= 0 ? diff + 1 : 0;
  }, [fechaInicio, fechaFin]);

  // ============================================================
  // Preview financiero (UI ONLY)
  // ============================================================
  const preview = useMemo(() => {
    if (!espacio || dias === 0) return null;

    return calcularTotalReservaPreview({
      espacio: mapEspacioToCalculo(espacio),
      dias,
      cantidadAdultos,
      cantidadNinos,
      cantidadPiscina,
      usoReserva,
    });
  }, [
    espacio,
    dias,
    cantidadAdultos,
    cantidadNinos,
    cantidadPiscina,
    usoReserva,
  ]);

  return (
    <div className="space-y-10">
      {/* ================= CANTIDADES ================= */}
      <div className="card-enap p-6 rounded-xl">
        <StepHeader title="Cantidades y Asistentes" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <input
              type="number"
              min={1}
              {...register("cantidadAdultos")}
              placeholder="Adultos"
            />
            {errors.cantidadAdultos && (
              <p className="text-sm text-red-500">
                {errors.cantidadAdultos.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="number"
              min={0}
              {...register("cantidadNinos")}
              placeholder="Niños"
            />
            {errors.cantidadNinos && (
              <p className="text-sm text-red-500">
                {errors.cantidadNinos.message}
              </p>
            )}
          </div>

          <div>
            <input
              type="number"
              min={0}
              {...register("cantidadPiscina")}
              placeholder="Piscina"
            />
            {errors.cantidadPiscina && (
              <p className="text-sm text-red-500">
                {errors.cantidadPiscina.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ================= RESUMEN ================= */}
      <div className="card-enap p-6 rounded-xl">
        <StepHeader title="Resumen de la Reserva" />

        {!preview ? (
          <p className="text-sm text-gray-500">
            Seleccione espacio y fechas para ver el resumen
          </p>
        ) : (
          <>
            <p>Días: {dias}</p>
            <p className="font-semibold text-lg mt-2">
              Total estimado: {CLP(preview.totalClp)}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
