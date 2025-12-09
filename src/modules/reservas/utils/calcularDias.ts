// src/modules/reservas/utils/calcularDias.ts
import { parseYmdLocal } from "@/lib";

export function calcularDias(
  fechaInicio?: string | null,
  fechaFin?: string | null
): number {
  if (!fechaInicio || !fechaFin) return 0;

  const ini = parseYmdLocal(fechaInicio);
  const fin = parseYmdLocal(fechaFin);

  if (!ini || !fin || !(ini instanceof Date) || !(fin instanceof Date)) {
    return 0;
  }

  if (fin <= ini) return 0;

  const diffMs = fin.getTime() - ini.getTime();
  const d = Math.ceil(diffMs / 86400000);

  return d > 0 ? d : 0;
}
