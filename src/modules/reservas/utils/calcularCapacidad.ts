// src/modules/reservas/utils/calcularCapacidad.ts
import type { Espacio } from "@/context/EspaciosContext";

export function calcularCapacidad(espacio: Espacio | null): number {
  if (!espacio) return 1;

  if (espacio.tipo === "PISCINA") {
    return espacio.capacidad ?? 100;
  }

  return (espacio.capacidad ?? 1) + (espacio.capacidadExtra ?? 0);
}
