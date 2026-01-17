// ============================================================
// useReservaCalculo.ts — Totales de reserva (PRO · FINAL)
// ============================================================

import { useMemo } from "react";
import type { EspacioDTO } from "@/modules/espacios/types/espacios";
import {
  calcularTotalesReserva,
  type ReservaCalculoInput,
} from "@/modules/reservas/utils/calcularPrecio";

export function useReservaCalculo(
  espacio: EspacioDTO | null,
  fechaInicio?: string,
  fechaFin?: string,
  data?: ReservaCalculoInput
) {
  return useMemo(() => {
    if (!espacio || !fechaInicio || !fechaFin || !data) {
      return {
        dias: 0,
        valorEspacio: 0,
        pagoPersonas: 0,
        pagoPiscina: 0,
        total: 0,
      };
    }

    // ============================================================
    // FUENTE ÚNICA: invitados.esPiscina
    // ============================================================
    const invitados = data.invitados ?? [];
    const personasPiscina = invitados.filter(
      (i) => i.esPiscina === true
    ).length;

    const resultado = calcularTotalesReserva({
      espacio,
      fechaInicio,
      fechaFin,
      data,
    });

    return {
      ...resultado,

      // Blindaje absoluto: jamás cobrar piscina sin uso real
      pagoPiscina: personasPiscina > 0 ? resultado.pagoPiscina : 0,
    };
  }, [espacio, fechaInicio, fechaFin, data]);
}
