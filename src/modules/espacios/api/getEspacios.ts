// src/modules/espacios/api/getEspacios.ts
import { http } from "@/shared/api/http";
import type { EspacioDTO } from "@/modules/espacios/types/espacios";

/* ============================================================
 * Tipos de filtros (extensibles)
 * ============================================================ */
export interface GetEspaciosParams {
  tipo?: string;
  activo?: boolean;
  visible?: boolean;
  soloDisponibles?: boolean;
}

/* ============================================================
 * Utilidad para construir query string
 * ============================================================ */
function buildQuery(params?: GetEspaciosParams): string {
  if (!params) return "";

  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  });

  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

/* ============================================================
 * API — Obtener espacios
 * ============================================================ */
export function getEspacios(params?: GetEspaciosParams) {
  const query = buildQuery(params);
  return http<EspacioDTO[]>(`/api/espacios${query}`);
}
