// utils/disponibilidad.ts
/**
 * Determina si un espacio está disponible EXACTAMENTE en una fecha dada.
 * Normaliza las fechas ignorando horas para evitar errores.
 */

import { fechaLocal } from "./fechaLocal";

export function espacioDisponibleEnFecha(
  fecha: string,
  ocupado: { fechaInicio: string; fechaFin: string }[] | undefined
): boolean {
  if (!fecha || !ocupado || ocupado.length === 0) return true;

  const target = fechaLocal(fecha);
  target.setHours(0, 0, 0, 0);

  return !ocupado.some((r) => {
    const inicio = fechaLocal(r.fechaInicio);
    const fin = fechaLocal(r.fechaFin);

    inicio.setHours(0, 0, 0, 0);
    fin.setHours(23, 59, 59, 999);

    return target >= inicio && target <= fin;
  });
}
