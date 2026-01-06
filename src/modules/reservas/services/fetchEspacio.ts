// src/modules/reservas/services/fetchEspacio.ts
import type { EspacioDTO } from "@/types/espacios";
import type { BloqueFecha } from "../utils/validarFechas";

interface FetchDeps {
  obtenerEspacio: (id: string) => Promise<EspacioDTO | null>;
  obtenerDisponibilidad: (id: string) => Promise<BloqueFecha[] | null>;
}

export async function fetchEspacioCompleto(
  id: string,
  { obtenerEspacio, obtenerDisponibilidad }: FetchDeps
): Promise<{
  espacio: EspacioDTO | null;
  bloquesOcupados: BloqueFecha[];
}> {
  const [espacio, bloques] = await Promise.all([
    obtenerEspacio(id),
    obtenerDisponibilidad(id),
  ]);

  return {
    espacio: espacio ?? null,
    bloquesOcupados: bloques ?? [],
  };
}
