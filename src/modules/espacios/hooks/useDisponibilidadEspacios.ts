// src/modules/espacios/hooks/useDisponibilidadEspacios.ts
import { useCallback, useEffect, useState } from "react";
import { fechaLocal } from "@/shared/lib/date";
import type { EspacioDTO } from "@/types/espacios";

/* ============================================================
 * Tipos
 * ============================================================ */
export type BloqueFecha = {
  fechaInicio: string;
  fechaFin: string;
};

interface UseDisponibilidadOptions {
  espacios: EspacioDTO[];
  loadingEspacios: boolean;
  obtenerDisponibilidad: (espacioId: string) => Promise<BloqueFecha[]>;
}

/* ============================================================
 * Normalización segura de fechas (LOCAL MIDNIGHT)
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
  const cargarDisponibilidad = useCallback(
    async (fechaISO: string | null) => {
      if (!fechaISO || espacios.length === 0) return;

      setLoadingDisponibilidad(true);

      try {
        const resultados = await Promise.all(
          espacios.map(async (esp) => {
            const bloques = await obtenerDisponibilidad(esp.id);
            return { id: esp.id, bloques };
          })
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
    },
    [espacios, obtenerDisponibilidad]
  );

  /* ----------------------------------------------------------
   * Cambio de fecha
   * ---------------------------------------------------------- */
  const handleFechaChange = useCallback(
    async (fechaISO: string | null) => {
      setFechaFiltro(fechaISO);
      setSoloDisponibles(false);
      setDisponibilidadMap({});

      if (!fechaISO) return;
      await cargarDisponibilidad(fechaISO);
    },
    [cargarDisponibilidad]
  );

  /* ----------------------------------------------------------
   * Re-cargar si cambian los espacios
   * ---------------------------------------------------------- */
  useEffect(() => {
    if (fechaFiltro && !loadingEspacios && espacios.length > 0) {
      if (Object.keys(disponibilidadMap).length === 0) {
        void cargarDisponibilidad(fechaFiltro);
      }
    }
  }, [
    fechaFiltro,
    loadingEspacios,
    espacios,
    disponibilidadMap,
    cargarDisponibilidad,
  ]);

  /* ----------------------------------------------------------
   * ¿Espacio ocupado en esa fecha?
   * ---------------------------------------------------------- */
  const estaOcupadoEnFecha = useCallback(
    (espacioId: string, fechaISO: string | null) => {
      if (!fechaISO) return false;

      const bloques = disponibilidadMap[espacioId];
      if (!bloques || bloques.length === 0) return false;

      const target = normalizarFecha(fechaISO);

      return bloques.some((b) => {
        const inicio = normalizarFecha(b.fechaInicio);
        const fin = normalizarFecha(b.fechaFin);
        return target >= inicio && target < fin;
      });
    },
    [disponibilidadMap]
  );

  /* ----------------------------------------------------------
   * Contador global por fecha (calendario)
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
