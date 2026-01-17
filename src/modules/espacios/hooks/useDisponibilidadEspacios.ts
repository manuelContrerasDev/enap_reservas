// src/modules/espacios/hooks/useDisponibilidadEspacios.ts
import { useCallback, useEffect, useMemo, useState } from "react";
import { fechaLocal } from "@/shared/lib/date";
import type { EspacioDTO } from "@/modules/espacios/types/espacios";
import type { BloqueFecha } from "../types/disponibilidad2";

/* ============================================================
 * Opciones del hook
 * ============================================================ */
interface UseDisponibilidadOptions {
  espacios: EspacioDTO[];
  loadingEspacios: boolean;
  obtenerDisponibilidad: (espacioId: string) => Promise<BloqueFecha[]>;
}

/* ============================================================
 * Utils
 * ============================================================ */
const normalizarFecha = (iso: string): Date => {
  const d = fechaLocal(iso);
  d.setHours(0, 0, 0, 0);
  return d;
};

/* ============================================================
 * Hook
 * ============================================================ */
export function useDisponibilidadEspacios({
  espacios,
  loadingEspacios,
  obtenerDisponibilidad,
}: UseDisponibilidadOptions) {
  const [fechaFiltro, setFechaFiltro] = useState<string | null>(null);
  const [soloDisponibles, setSoloDisponibles] = useState(false);
  const [loadingDisponibilidad, setLoadingDisponibilidad] = useState(false);

  const [disponibilidadMap, setDisponibilidadMap] = useState<
    Record<string, BloqueFecha[]>
  >({});

  /* ----------------------------------------------------------
   * Fecha normalizada (single source of truth)
   * ---------------------------------------------------------- */
  const fechaTarget = useMemo(
    () => (fechaFiltro ? normalizarFecha(fechaFiltro) : null),
    [fechaFiltro]
  );

  /* ----------------------------------------------------------
   * Reset completo
   * ---------------------------------------------------------- */
  const limpiarDisponibilidad = useCallback(() => {
    setFechaFiltro(null);
    setSoloDisponibles(false);
    setDisponibilidadMap({});
    setLoadingDisponibilidad(false);
  }, []);

  /* ----------------------------------------------------------
   * Cargar disponibilidad de TODOS los espacios
   * ---------------------------------------------------------- */
  const cargarDisponibilidad = useCallback(async () => {
    if (!fechaFiltro || espacios.length === 0) return;

    setLoadingDisponibilidad(true);

    try {
      const resultados = await Promise.all(
        espacios.map(async (esp) => ({
          id: esp.id,
          bloques: await obtenerDisponibilidad(esp.id),
        }))
      );

      const map = resultados.reduce<Record<string, BloqueFecha[]>>(
        (acc, item) => {
          acc[item.id] = item.bloques;
          return acc;
        },
        {}
      );

      setDisponibilidadMap(map);
    } catch (err) {
      console.error("❌ Error al obtener disponibilidad:", err);
    } finally {
      setLoadingDisponibilidad(false);
    }
  }, [fechaFiltro, espacios, obtenerDisponibilidad]);

  /* ----------------------------------------------------------
   * Cambio de fecha
   * ---------------------------------------------------------- */
  const handleFechaChange = useCallback(
    async (fechaISO: string | null) => {
      setFechaFiltro(fechaISO);
      setSoloDisponibles(false);
      setDisponibilidadMap({});

      if (!fechaISO) return;
      await cargarDisponibilidad();
    },
    [cargarDisponibilidad]
  );

  /* ----------------------------------------------------------
   * Re-carga defensiva
   * ---------------------------------------------------------- */
  useEffect(() => {
    if (
      fechaFiltro &&
      !loadingEspacios &&
      espacios.length > 0 &&
      Object.keys(disponibilidadMap).length === 0
    ) {
      void cargarDisponibilidad();
    }
  }, [
    fechaFiltro,
    loadingEspacios,
    espacios,
    disponibilidadMap,
    cargarDisponibilidad,
  ]);

  /* ----------------------------------------------------------
   * ¿Espacio ocupado en fecha?
   * ---------------------------------------------------------- */
  const estaOcupadoEnFecha = useCallback(
    (espacioId: string, _fechaISO?: string | null) => {
      if (!fechaTarget) return false;

      const bloques = disponibilidadMap[espacioId];
      if (!bloques?.length) return false;

      return bloques.some((b) => {
        const inicio = normalizarFecha(b.fechaInicio);
        const fin = normalizarFecha(b.fechaFin);
        return fechaTarget >= inicio && fechaTarget < fin;
      });
    },
    [disponibilidadMap, fechaTarget]
  );

  /* ----------------------------------------------------------
   * Métrica global
   * ---------------------------------------------------------- */
  const contarOcupadosEnFecha = useCallback(
    (fechaISO: string) =>
      espacios.filter((esp) =>
        estaOcupadoEnFecha(esp.id, fechaISO)
      ).length,
    [espacios, estaOcupadoEnFecha]
  );

  return {
    // estado
    fechaFiltro,
    soloDisponibles,
    setSoloDisponibles,
    loadingDisponibilidad,

    // API
    onFechaChange: handleFechaChange,
    estaOcupadoEnFecha,
    limpiarDisponibilidad,

    // métricas
    contarOcupadosEnFecha,
  };
}
