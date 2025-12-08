// src/modules/pagos/resultado/ResultadoDetalle.tsx

import React from "react";

interface ResultadoDetalleProps {
  id: string;
  amountClp: number;
  reservaId: string;
  status: string;
}

export default function ResultadoDetalle({
  id,
  amountClp,
  reservaId,
  status,
}: ResultadoDetalleProps) {
  return (
    <div className="text-sm bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 text-left space-y-1">
      <p>
        <strong>ID Pago:</strong> {id}
      </p>

      <p>
        <strong>Monto:</strong>{" "}
        ${amountClp.toLocaleString("es-CL")}
      </p>

      <p>
        <strong>Reserva:</strong> {reservaId}
      </p>

      <p>
        <strong>Estado:</strong> {status}
      </p>
    </div>
  );
}
