// src/modules/espacios/api/getDisponibilidadEspacio.ts
import { http } from "@/shared/api/http";
import type { BloqueFecha } from "../types/disponibilidad2";

/* ============================================================
 * Tipos de parámetros (extensibles)
 * ============================================================ */
export interface GetDisponibilidadParams {
  desde?: string; // ISO
  hasta?: string; // ISO
}

/* ============================================================
 * Utilidad para query params
 * ============================================================ */
function buildQuery(params?: GetDisponibilidadParams): string {
  if (!params) return "";

  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value) query.append(key, value);
  });

  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

/* ============================================================
 * API — Disponibilidad de un espacio
 * ============================================================ */
export function getDisponibilidadEspacio(
  espacioId: string,
  params?: GetDisponibilidadParams
) {
  const query = buildQuery(params);
  return http<BloqueFecha[]>(
    `/api/espacios/${espacioId}/disponibilidad${query}`
  );
}
