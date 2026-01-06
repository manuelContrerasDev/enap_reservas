import { useMemo } from "react";
import type { ReservaFrontend } from "@/types/ReservaFrontend";
import { ReservaEstado } from "@/types/enums";


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
        case ReservaEstado.CONFIRMADA:
        case ReservaEstado.PENDIENTE_PAGO:
        case ReservaEstado.CANCELADA:
        case ReservaEstado.RECHAZADA:
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
