// ============================================================
// AdminStep2_CantidadesResumen.tsx — ENAP 2025 (PRO · RHF INPUT)
// ============================================================

import React, { useMemo } from "react";
import { StepHeader } from "./StepHeader";
import { CLP } from "@/shared/utils/formatters";

import type {
  UseFormRegister,
  UseFormWatch,
  FieldErrors,
} from "react-hook-form";

import type { ReservaManualFormValues } from "../schemas/ReservaManualFormValues";
import { useEspacios } from "@/modules/espacios/context/EspaciosContext";

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
  const tipoCliente = watch("tipoCliente");

  const fechaInicio = watch("fechaInicio");
  const fechaFin = watch("fechaFin");

  const cantidadAdultos = Number(watch("cantidadAdultos") ?? 0);
  const cantidadNinos = Number(watch("cantidadNinos") ?? 0);
  const cantidadPiscina = Number(watch("cantidadPiscina") ?? 0);

  const espacio = espacios.find((e) => e.id === espacioId);

  const preview = useMemo(() => {
    if (!espacio || !fechaInicio || !fechaFin || !tipoCliente) return null;

    const precioBase =
      tipoCliente === "SOCIO"
        ? espacio.precioBaseSocio
        : espacio.precioBaseExterno;

    const precioPersona =
      tipoCliente === "SOCIO"
        ? espacio.precioPersonaAdicionalSocio
        : espacio.precioPersonaAdicionalExterno;

    const precioPiscina =
      tipoCliente === "SOCIO"
        ? espacio.precioPiscinaSocio
        : espacio.precioPiscinaExterno;

    const personasAdicionales = Math.max(
      0,
      cantidadAdultos + cantidadNinos - 1
    );

    const totalPersonas = personasAdicionales * precioPersona;

    const totalPiscina =
      espacio.tipo === "PISCINA"
        ? cantidadPiscina * precioPiscina
        : 0;

    const total = precioBase + totalPersonas + totalPiscina;

    return {
      precioBase,
      totalPersonas,
      totalPiscina,
      total,
    };
  }, [
    espacio,
    tipoCliente,
    fechaInicio,
    fechaFin,
    cantidadAdultos,
    cantidadNinos,
    cantidadPiscina,
  ]);

  return (
    <div className="space-y-10">
      <div className="card-enap p-6 rounded-xl">
        <StepHeader title="Cantidades y Asistentes" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label>Adultos</label>
            <input type="number" min={1} {...register("cantidadAdultos")} />
            {errors.cantidadAdultos && (
              <p className="err">{errors.cantidadAdultos.message}</p>
            )}
          </div>

          <div>
            <label>Niños</label>
            <input type="number" min={0} {...register("cantidadNinos")} />
            {errors.cantidadNinos && (
              <p className="err">{errors.cantidadNinos.message}</p>
            )}
          </div>

          <div>
            <label>Piscina</label>
            <input
              type="number"
              min={0}
              max={cantidadAdultos + cantidadNinos}
              disabled={espacio?.tipo !== "PISCINA"}
              {...register("cantidadPiscina")}
            />
            {errors.cantidadPiscina && (
              <p className="err">{errors.cantidadPiscina.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="card-enap p-6 rounded-xl">
        <StepHeader title="Resumen estimado" />

        {!preview ? (
          <p className="text-sm text-gray-500">
            Complete tipo de cliente, espacio, fechas y cantidades.
          </p>
        ) : (
          <div className="space-y-1 text-sm">
            <p>
              Precio base ({tipoCliente.toLowerCase()}):{" "}
              <strong>{CLP(preview.precioBase)}</strong>
            </p>

            {preview.totalPersonas > 0 && (
              <p>
                Personas adicionales:{" "}
                <strong>{CLP(preview.totalPersonas)}</strong>
              </p>
            )}

            {preview.totalPiscina > 0 && (
              <p>
                Piscina: <strong>{CLP(preview.totalPiscina)}</strong>
              </p>
            )}

            <p className="font-semibold text-lg mt-3">
              Total estimado: {CLP(preview.total)}
            </p>

            <p className="text-xs text-gray-500 mt-2">
              * El monto final será calculado y validado por el sistema al
              confirmar la reserva.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
