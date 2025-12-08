// src/modules/pagos/resultado/ResultadoAcciones.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import { PATHS } from "@/routes/paths";

interface ResultadoAccionesProps {
  estado: "approved" | "rejected" | "cancelled" | "error";
  reservaId?: string;
}

export default function ResultadoAcciones({
  estado,
  reservaId,
}: ResultadoAccionesProps) {
  const navigate = useNavigate();

  const goReserva = () =>
    navigate(`${PATHS.RESERVA_PREVIEW}?reservaId=${reservaId}`);

  const goPago = () =>
    navigate(`${PATHS.PAGO}?reservaId=${reservaId}`);

  const goMisReservas = () => navigate(PATHS.SOCIO_MIS_RESERVAS);

  const goEspacios = () => navigate(PATHS.SOCIO_ESPACIOS);

  /* ============================================================
   * 🟢 APROBADO
   * ============================================================ */
  if (estado === "approved") {
    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={goReserva}
          className="bg-[#DEC01F] hover:bg-[#E5D14A] text-[#003449] px-6 py-3 rounded-lg w-full"
        >
          Ver mi reserva
        </button>

        <button
          onClick={goMisReservas}
          className="bg-[#002E3E] hover:bg-[#013B50] text-white px-6 py-3 rounded-lg w-full"
        >
          Ir a mis reservas
        </button>

        <button
          onClick={goEspacios}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg w-full"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  /* ============================================================
   * 🟥 RECHAZADO
   * ============================================================ */
  if (estado === "rejected") {
    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={goPago}
          className="bg-[#002E3E] text-white px-6 py-3 rounded-lg hover:bg-[#003B4D]"
        >
          Reintentar pago
        </button>

        <button
          onClick={goEspacios}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg w-full"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  /* ============================================================
   * 🟡 CANCELADO
   * ============================================================ */
  if (estado === "cancelled") {
    return (
      <div className="flex flex-col gap-3">
        <button
          onClick={goPago}
          className="bg-[#002E3E] text-white px-6 py-3 rounded-lg hover:bg-[#003B4D]"
        >
          Intentar nuevamente
        </button>

        <button
          onClick={goEspacios}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg w-full"
        >
          Volver al inicio
        </button>
      </div>
    );
  }

  /* ============================================================
   * ❗ FALLO GENERAL
   * ============================================================ */
  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={goEspacios}
        className="bg-[#002E3E] text-white px-6 py-3 rounded-lg hover:bg-[#003A50]"
      >
        Volver al inicio
      </button>
    </div>
  );
}
