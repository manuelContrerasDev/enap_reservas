// src/modules/espacios/hooks/useDisponibilidadEspacios.ts
import { useCallback, useEffect, useState } from "react";
import { fechaLocal } from "@/utils/fechaLocal";
import type { Espacio } from "@/context/EspaciosContext";

export type BloqueFecha = { fechaInicio: string; fechaFin: string };

interface UseDisponibilidadOptions {
  espacios: Espacio[];
  loadingEspacios: boolean;
  obtenerDisponibilidad: (espacioId: string) => Promise<BloqueFecha[]>;
}

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

  const limpiarDisponibilidad = useCallback(() => {
    setFechaFiltro(null);
    setSoloDisponibles(false);
    setDisponibilidadMap({});
    setLoadingDisponibilidad(false);
  }, []);

  const cargarDisponibilidad = useCallback(
    async (fechaISO: string | null) => {
      if (!fechaISO || espacios.length === 0) return;

      setLoadingDisponibilidad(true);
      try {
        const resultados = await Promise.all(
          espacios.map(async (e) => {
            const bloques = await obtenerDisponibilidad(e.id);
            return { id: e.id, bloques };
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

  // Si cambia la lista de espacios mientras hay fecha seleccionada, recargamos
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

  const estaOcupadoEnFecha = useCallback(
    (espacioId: string, fechaISO: string | null) => {
      if (!fechaISO) return false;
      const bloques = disponibilidadMap[espacioId];
      if (!bloques) return false;

      const target = fechaLocal(fechaISO);
      target.setHours(0, 0, 0, 0);

      return bloques.some((b) => {
        const inicio = fechaLocal(b.fechaInicio);
        const fin = fechaLocal(b.fechaFin);
        inicio.setHours(0, 0, 0, 0);
        fin.setHours(23, 59, 59, 999);
        return target >= inicio && target <= fin;
      });
    },
    [disponibilidadMap]
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
  };
}
