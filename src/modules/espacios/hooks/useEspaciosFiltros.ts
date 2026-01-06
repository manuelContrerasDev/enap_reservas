// src/modules/espacios/hooks/useEspaciosFiltros.ts
import { useMemo, useState, useCallback } from "react";
import type { EspacioDTO, TipoFiltro } from "@/types/espacios";

export type OrdenFiltro =
  | "NOMBRE_ASC"
  | "NOMBRE_DESC"
  | "PRECIO_ASC"
  | "PRECIO_DESC";

interface UseEspaciosFiltrosProps {
  espacios: EspacioDTO[];
  fechaFiltro: string | null;
  soloDisponibles: boolean;
  estaOcupadoEnFecha: (espacioId: string, fechaISO: string | null) => boolean;

  /**
   * Resuelve el precio visible según contexto:
   * role, promociones, reglas futuras, etc.
   */
  resolverPrecio: (espacio: EspacioDTO) => number;
}

export function useEspaciosFiltros({
  espacios,
  fechaFiltro,
  soloDisponibles,
  estaOcupadoEnFecha,
  resolverPrecio,
}: UseEspaciosFiltrosProps) {
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState<TipoFiltro>("TODOS");
  const [orden, setOrden] = useState<OrdenFiltro>("NOMBRE_ASC");

  const resetFiltrosBasicos = useCallback(() => {
    setSearch("");
    setTipo("TODOS");
    setOrden("NOMBRE_ASC");
  }, []);

  const espaciosFiltrados = useMemo(() => {
    let list = [...espacios];
    const texto = search.trim().toLowerCase();

    if (tipo !== "TODOS") {
      list = list.filter((e) => e.tipo === tipo);
    }

    if (texto) {
      list = list.filter(
        (e) =>
          e.nombre.toLowerCase().includes(texto) ||
          (e.descripcion ?? "").toLowerCase().includes(texto)
      );
    }

    if (fechaFiltro) {
      list = list.filter((e) => {
        const ocupado = estaOcupadoEnFecha(e.id, fechaFiltro);
        return soloDisponibles ? !ocupado : true;
      });
    }

    return list.sort((a, b) => {
      switch (orden) {
        case "NOMBRE_ASC":
          return a.nombre.localeCompare(b.nombre);
        case "NOMBRE_DESC":
          return b.nombre.localeCompare(a.nombre);
        case "PRECIO_ASC":
          return resolverPrecio(a) - resolverPrecio(b);
        case "PRECIO_DESC":
          return resolverPrecio(b) - resolverPrecio(a);
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
    resolverPrecio,
  ]);

  return {
    search,
    tipo,
    orden,

    setSearch,
    setTipo,
    setOrden,

    espaciosFiltrados,
    resetFiltrosBasicos,
  };
}
