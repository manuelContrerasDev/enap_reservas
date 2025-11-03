import { useMemo } from "react";
import type { Reserva } from "@/lib/supabase";

/** KPIs por estado */
export function useReservasKPIs(reservas: Reserva[]) {
  return useMemo(() => {
    let confirmadas = 0, pendientes = 0, canceladas = 0;
    for (const r of reservas) {
      if (r.estado === "confirmada") confirmadas++;
      else if (r.estado === "pendiente") pendientes++;
      else if (r.estado === "cancelada") canceladas++;
    }
    return { total: reservas.length, confirmadas, pendientes, canceladas };
  }, [reservas]);
}
