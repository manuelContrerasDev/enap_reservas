import { useMemo } from "react";
import type { ReservaFrontend } from "@/types/ReservaFrontend";

export function useReservasKPIs(reservas: ReservaFrontend[] = []) {
  return useMemo(() => {
    // Contadores seguros
    let confirmadas = 0;
    let pendientes = 0;
    let canceladas = 0;
    let rechazadas = 0;

    for (let i = 0; i < reservas.length; i++) {
      const estado = reservas[i].estado;

      switch (estado) {
        case "CONFIRMADA":
          confirmadas++;
          break;
        case "PENDIENTE":
          pendientes++;
          break;
        case "CANCELADA":
          canceladas++;
          break;
        case "RECHAZADA":
          rechazadas++;
          break;
      }
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
