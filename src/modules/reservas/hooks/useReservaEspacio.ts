// ============================================================
// useReservaEspacio.ts — Carga de espacio + disponibilidad
// ============================================================

import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useEspacios } from "@/modules/espacios/context/EspaciosContext";
import { useReserva } from "@/modules/reservas/context/ReservaContext";

import type { EspacioDTO } from "@/modules/espacios/types/espacios";
import type { BloqueFecha } from "@/modules/reservas/utils/validarFechas";

import { getEspacioConDisponibilidad } from "@/modules/reservas/api/getEspacioConDisponibilidad";

export function useReservaEspacio() {
  const { id } = useParams();

  const { obtenerEspacio, obtenerDisponibilidad } = useEspacios();
  const { setReservaActual } = useReserva();

  const [espacio, setEspacio] = useState<EspacioDTO | null>(null);
  const [bloquesOcupados, setBloquesOcupados] = useState<BloqueFecha[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchEspacio = useCallback(async () => {
    if (!id) {
      setError("Espacio no encontrado");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const { espacio, bloquesOcupados } = await getEspacioConDisponibilidad(id, {
        obtenerEspacio,
        obtenerDisponibilidad,
      });

      if (!espacio) {
        setError("Espacio no encontrado");
        setEspacio(null);
        setBloquesOcupados([]);
        return;
      }

      setEspacio(espacio);
      setBloquesOcupados(bloquesOcupados);

      // Sync mínimo con wizard (solo identidad del espacio)
      setReservaActual({
        espacioId: espacio.id,
        espacioNombre: espacio.nombre,
      });
    } catch (e) {
      console.error("❌ useReservaEspacio:", e);
      setError("Error al cargar el espacio");
      setEspacio(null);
      setBloquesOcupados([]);
    } finally {
      setIsLoading(false);
    }
  }, [id, obtenerEspacio, obtenerDisponibilidad, setReservaActual]);

  useEffect(() => {
    fetchEspacio();
  }, [fetchEspacio]);

  return {
    espacio,
    bloquesOcupados,
    error,
    isLoading,
    refetch: fetchEspacio,
  };
}
