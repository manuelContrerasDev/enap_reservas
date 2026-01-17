// src/modules/espacios/components/EspacioDetalleCTA.tsx
import React from "react";

interface Props {
  activo: boolean;
  visible: boolean;
  ocupadoEnFecha?: boolean;
  onReservar: () => void;
}

export default function EspacioDetalleCTA({
  activo,
  visible,
  ocupadoEnFecha = false,
  onReservar,
}: Props) {
  const puedeReservar = activo && visible && !ocupadoEnFecha;

  return (
    <button
      disabled={!puedeReservar}
      onClick={onReservar}
      className={`w-full py-2 rounded-lg font-semibold transition-colors ${
        puedeReservar
          ? "bg-[#01546B] text-white hover:bg-[#016A85]"
          : "bg-gray-200 text-gray-500 cursor-not-allowed"
      }`}
    >
      {activo && visible
        ? ocupadoEnFecha
          ? "Ocupado en la fecha"
          : "Reservar"
        : "No disponible"}
    </button>
  );
}
