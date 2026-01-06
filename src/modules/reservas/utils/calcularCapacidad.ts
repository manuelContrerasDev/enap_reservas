// src/modules/reservas/utils/calcularCapacidad.ts
// ============================================================
// Cálculo de capacidad máxima — ENAP 2025
// Fuente de verdad: EspacioDTO
// ============================================================

import type { EspacioDTO } from "@/types/espacios";

/**
 * Retorna la capacidad máxima permitida para el espacio.
 * ❗ NO inventa reglas
 * ❗ NO usa campos inexistentes
 */
export function calcularCapacidad(
  espacio: EspacioDTO | null
): number {
  if (!espacio) return 1;

  return espacio.capacidad;
}
