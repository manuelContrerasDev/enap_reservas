// ============================================================
// useReservaDraft.ts — Sync con ReservaContext
// ============================================================

import { useEffect } from "react";
import { useReserva } from "@/modules/reservas/context/ReservaContext";
import type { EspacioDTO } from "@/modules/espacios/types/espacios";

export function useReservaDraft(params: {
  espacio: EspacioDTO | null;
  fechaInicio?: string;
  fechaFin?: string;
  dias?: number;
  total?: number;
  cantidadPersonas?: number;
}) {
  const { setReservaActual } = useReserva();

  const {
    espacio,
    fechaInicio,
    fechaFin,
    dias,
    total,
    cantidadPersonas,
  } = params;

  useEffect(() => {
    if (!espacio) return;

    setReservaActual({
      espacioId: espacio.id,
      espacioNombre: espacio.nombre,
      fechaInicio,
      fechaFin,
      dias,
      total,
      cantidadPersonas,
    });
  }, [
    espacio,
    fechaInicio,
    fechaFin,
    dias,
    total,
    cantidadPersonas,
    setReservaActual,
  ]);
}
