import type { EspacioDTO } from "@/types/espacios";
import type { BloqueFecha } from "../utils/validarFechas";

interface Deps {
  obtenerEspacio: (id: string) => Promise<EspacioDTO | null>;
  obtenerDisponibilidad: (id: string) => Promise<BloqueFecha[] | null>;
}

export async function getEspacioConDisponibilidad(
  id: string,
  deps: Deps
): Promise<{
  espacio: EspacioDTO | null;
  bloquesOcupados: BloqueFecha[];
}> {
  const [espacio, bloques] = await Promise.all([
    deps.obtenerEspacio(id),
    deps.obtenerDisponibilidad(id),
  ]);

  return {
    espacio,
    bloquesOcupados: bloques ?? [],
  };
}
