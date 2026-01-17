// src/modules/espacios/hooks/useEspaciosFiltros.ts
import { useMemo, useState, useCallback } from "react";
import type { EspacioDTO, TipoFiltro } from "@/modules/espacios/types/espacios";

export type OrdenFiltro =
  | "NOMBRE_ASC"
  | "NOMBRE_DESC"
  | "PRECIO_ASC"
  | "PRECIO_DESC";

interface UseEspaciosFiltrosProps {
  espacios: EspacioDTO[];
  fechaFiltro: string | null;
  soloDisponibles: boolean;

  /**
   * Determina si un espacio está ocupado en una fecha dada
   */
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

  /* ----------------------------------------------------------
   * Reset rápido (UX)
   * ---------------------------------------------------------- */
  const resetFiltrosBasicos = useCallback(() => {
    setSearch("");
    setTipo("TODOS");
    setOrden("NOMBRE_ASC");
  }, []);

  /* ----------------------------------------------------------
   * Pipeline de filtros
   * ---------------------------------------------------------- */
  const espaciosFiltrados = useMemo(() => {
    let resultado = [...espacios];
    const texto = search.trim().toLowerCase();

    // 1️⃣ Filtro por tipo
    if (tipo !== "TODOS") {
      resultado = resultado.filter((e) => e.tipo === tipo);
    }

    // 2️⃣ Filtro por texto
    if (texto) {
      resultado = resultado.filter(
        (e) =>
          e.nombre.toLowerCase().includes(texto) ||
          (e.descripcion ?? "").toLowerCase().includes(texto)
      );
    }

    // 3️⃣ Filtro por disponibilidad
    if (fechaFiltro && soloDisponibles) {
      resultado = resultado.filter(
        (e) => !estaOcupadoEnFecha(e.id, fechaFiltro)
      );
    }

    // 4️⃣ Ordenamiento
    resultado.sort((a, b) => {
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

    return resultado;
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
    // estado
    search,
    tipo,
    orden,

    // setters
    setSearch,
    setTipo,
    setOrden,

    // resultado
    espaciosFiltrados,

    // helpers
    resetFiltrosBasicos,
  };
}
