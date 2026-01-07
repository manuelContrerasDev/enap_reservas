import { http } from "@/shared/api/http";
import type { BloqueFecha } from "@/modules/reservas/utils/validarFechas";

export function getDisponibilidadEspacio(espacioId: string) {
  return http<BloqueFecha[]>(`/api/espacios/${espacioId}/disponibilidad`);
}
