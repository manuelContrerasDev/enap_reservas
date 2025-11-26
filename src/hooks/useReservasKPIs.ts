import { useMemo } from "react";
import type { Reserva } from "@/context/ReservaContext";

/** KPIs por estado */
export function useReservasKPIs(reservas: Reserva[]) {
  return useMemo(() => {
    let confirmadas = 0, pendientes = 0, canceladas = 0, rechazadas = 0;

    for (const r of reservas) {
      if (r.estado === "CONFIRMADA") confirmadas++;
      else if (r.estado === "PENDIENTE") pendientes++;
      else if (r.estado === "CANCELADA") canceladas++;
      else if (r.estado === "RECHAZADA") rechazadas++;
    }

    return {
      total: reservas.length,
      confirmadas,
      pendientes,
      canceladas,
      rechazadas,
    };
  }, [reservas]);
}
