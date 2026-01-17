// ============================================================
// AdminStep4_Confirmacion.tsx — ENAP 2025
// PREVIEW FINAL · ADMIN (OUTPUT PARSEADO)
// ============================================================

import React from "react";
import { StepHeader } from "./StepHeader";
import type { z } from "zod";
import { reservaManualFormSchema } from "@/modules/admin/gestion/reservas/types/reservaManual.schema";

type ReservaPreview = z.output<typeof reservaManualFormSchema>;

interface Props {
  reservaPreview: ReservaPreview;
  loading: boolean;
  onConfirm: () => void;
}

export const AdminStep4_Confirmacion: React.FC<Props> = ({
  reservaPreview,
  loading,
  onConfirm,
}) => {
  const {
    tipoCliente,
    espacioId,
    fechaInicio,
    fechaFin,
    usoReserva,
    cantidadAdultos,
    cantidadNinos,
    cantidadPiscina,
    invitados,
    socioPresente,
  } = reservaPreview;

  return (
    <div className="space-y-10">
      {/* ================= CONTEXTO GENERAL ================= */}
      <div className="card-enap p-6 rounded-xl">
        <StepHeader title="Confirmación de Reserva" />

        <div className="grid grid-cols-2 gap-4 text-sm mt-4">
          <p>
            <strong>Tipo de cliente:</strong> {tipoCliente}
          </p>
          <p>
            <strong>Espacio:</strong> {espacioId}
          </p>
          <p>
            <strong>Desde:</strong> {fechaInicio}
          </p>
          <p>
            <strong>Hasta:</strong> {fechaFin}
          </p>
          <p>
            <strong>Uso de reserva:</strong> {usoReserva}
          </p>
          <p>
            <strong>Socio presente:</strong>{" "}
            {socioPresente ? "Sí" : "No"}
          </p>
        </div>
      </div>

      {/* ================= CANTIDADES ================= */}
      <div className="card-enap p-6 rounded-xl">
        <StepHeader title="Cantidades declaradas" />

        <ul className="text-sm space-y-1">
          <li>Adultos: {cantidadAdultos}</li>
          <li>Niños: {cantidadNinos}</li>
          <li>Piscina: {cantidadPiscina}</li>
        </ul>
      </div>

      {/* ================= INVITADOS ================= */}
      <div className="card-enap p-6 rounded-xl">
        <StepHeader
          title="Invitados"
          subtitle={`Total: ${invitados?.length ?? 0}`}
        />

        {!invitados?.length ? (
          <p className="text-sm text-gray-500">Sin invitados registrados</p>
        ) : (
          <ul className="text-sm space-y-1">
            {invitados.map((i, idx) => (
              <li key={idx}>
                {i.nombre} ({i.rut}){" "}
                {i.esPiscina && (
                  <span className="text-blue-600">🏊 Piscina</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ================= MENSAJE CLAVE ================= */}
      <div className="card-enap p-6 rounded-xl bg-yellow-50 border border-yellow-200">
        <StepHeader title="Importante" />

        <p className="text-sm text-yellow-800">
          ⚠️ Al confirmar esta reserva:
        </p>

        <ul className="text-sm text-yellow-800 mt-2 list-disc list-inside space-y-1">
          <li>El sistema recalculará el monto final.</li>
          <li>El total quedará congelado.</li>
          <li>La reserva quedará en estado <strong>PENDIENTE DE PAGO</strong>.</li>
        </ul>
      </div>

      {/* ================= ACCIÓN ================= */}
      <div className="flex justify-end">
        <button
          onClick={onConfirm}
          disabled={loading}
          className="btn-primary"
        >
          {loading ? "Confirmando…" : "Confirmar Reserva"}
        </button>
      </div>
    </div>
  );
};
