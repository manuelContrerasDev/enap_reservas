// src/modules/espacios/hooks/useEspaciosFiltros.ts
import { useMemo, useState, useCallback } from "react";
import type { Espacio } from "@/context/EspaciosContext";

interface UseEspaciosFiltrosProps {
  espacios: Espacio[];
  fechaFiltro: string | null;
  soloDisponibles: boolean;
  estaOcupadoEnFecha: (espacioId: string, fechaISO: string | null) => boolean;
}

export type TipoFiltro = "TODOS" | "CABANA" | "QUINCHO" | "PISCINA";
export type OrdenFiltro =
  | "NOMBRE_ASC"
  | "NOMBRE_DESC"
  | "PRECIO_ASC"
  | "PRECIO_DESC";

export function useEspaciosFiltros({
  espacios,
  fechaFiltro,
  soloDisponibles,
  estaOcupadoEnFecha,
}: UseEspaciosFiltrosProps) {
  // Estado local de filtros
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState<TipoFiltro>("TODOS");
  const [orden, setOrden] = useState<OrdenFiltro>("NOMBRE_ASC");

  // Reset completo de filtros de texto y tipo/orden
  const resetFiltrosBasicos = useCallback(() => {
    setSearch("");
    setTipo("TODOS");
    setOrden("NOMBRE_ASC");
  }, []);

  /**
   * ============================
   *  LISTA FILTRADA Y ORDENADA
   * ============================
   */
  const espaciosFiltrados = useMemo(() => {
    let list = [...espacios];
    const texto = search.trim().toLowerCase();

    // Filtrar por tipo
    if (tipo !== "TODOS") {
      list = list.filter((e) => e.tipo === tipo);
    }

    // Búsqueda por texto
    if (texto) {
      list = list.filter(
        (e) =>
          e.nombre.toLowerCase().includes(texto) ||
          (e.descripcion ?? "").toLowerCase().includes(texto)
      );
    }

    // Filtrar por disponibilidad en fecha
    if (fechaFiltro) {
      list = list.filter((e) => {
        const ocupado = estaOcupadoEnFecha(e.id, fechaFiltro);
        return soloDisponibles ? !ocupado : true;
      });
    }

    // Ordenamiento
    return list.sort((a, b) => {
      switch (orden) {
        case "NOMBRE_ASC":
          return a.nombre.localeCompare(b.nombre);
        case "NOMBRE_DESC":
          return b.nombre.localeCompare(a.nombre);
        case "PRECIO_ASC":
          return a.tarifaClp - b.tarifaClp;
        case "PRECIO_DESC":
          return b.tarifaClp - a.tarifaClp;
        default:
          return 0;
      }
    });
  }, [
    espacios,
    search,
    tipo,
    orden,
    fechaFiltro,
    soloDisponibles,
    estaOcupadoEnFecha,
  ]);

  return {
    // Estados
    search,
    tipo,
    orden,

    // Setters
    setSearch,
    setTipo,
    setOrden,

    // Lista final
    espaciosFiltrados,

    // Reset de filtros básicos
    resetFiltrosBasicos,
  };
}
