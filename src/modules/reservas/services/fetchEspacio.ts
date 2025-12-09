// src/modules/reservas/services/fetchEspacio.ts
import type { Espacio } from "@/context/EspaciosContext";
import type { BloqueFecha } from "../utils/validarFechas";

interface FetchDeps {
  obtenerEspacio: (id: string) => Promise<Espacio | null>;
  obtenerDisponibilidad: (id: string) => Promise<BloqueFecha[] | null>;
}

export async function fetchEspacioCompleto(
  id: string,
  { obtenerEspacio, obtenerDisponibilidad }: FetchDeps
): Promise<{
  espacio: Espacio | null;
  bloquesOcupados: BloqueFecha[];
}> {
  const [esp, disp] = await Promise.all([
    obtenerEspacio(id),
    obtenerDisponibilidad(id),
  ]);

  return {
    espacio: esp ?? null,
    bloquesOcupados: disp ?? [],
  };
}
