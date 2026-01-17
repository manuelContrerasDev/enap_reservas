import { useEffect, useState, useCallback, useMemo } from "react";
import { http } from "@/shared/api/http";
import type { TesoreriaFiltros } from "../filters/TesoreriaFilters";

export interface MovimientoTesoreriaFrontend {
  id: string;
  createdAt: string;
  montoClp: number;
  referencia?: string | null;
  nota?: string | null;

  reserva: {
    id: string;
    nombreSocio: string;
    espacio: { nombre: string };
  };

  creadoPor: {
    id: string;
    name: string | null;
    email: string;
  };
}

interface MovimientosResponse {
  data: MovimientoTesoreriaFrontend[];
}

interface ResumenTesoreriaResponse {
  data: {
    totalIngresos: number;
    totalMovimientos: number;
  };
}

export function useTesoreriaAdmin() {
  /* ==============================
   * STATE
   * ============================== */
  const [movimientos, setMovimientos] =
    useState<MovimientoTesoreriaFrontend[]>([]);

  const [kpis, setKpis] = useState({
    totalIngresos: 0,
    totalMovimientos: 0,
  });

  const [filtros, setFiltros] = useState<TesoreriaFiltros>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ==============================
   * QUERY STRING (memo)
   * ============================== */
  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (filtros.desde) params.set("desde", filtros.desde);
    if (filtros.hasta) params.set("hasta", filtros.hasta);
    return params.toString();
  }, [filtros]);

  /* ==============================
   * FETCH PRINCIPAL
   * ============================== */
  const fetchTesoreria = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const suffix = queryString ? `?${queryString}` : "";

      const [
        { data: movRes },
        { data: resumenRes },
      ] = await Promise.all([
        http.get<MovimientosResponse>(
          `/admin/tesoreria/movimientos${suffix}`
        ),
        http.get<ResumenTesoreriaResponse>(
          `/admin/tesoreria/resumen${suffix}`
        ),
      ]);

      // movRes.data === MovimientoTesoreriaFrontend[]
      setMovimientos(movRes.data);

      // resumenRes.data === { totalIngresos, totalMovimientos }
      setKpis(resumenRes.data);
    } catch (e: any) {
      setError(e?.message ?? "ERROR_CARGANDO_TESORERIA");
    } finally {
      setLoading(false);
    }
  }, [queryString]);

  useEffect(() => {
    fetchTesoreria();
  }, [fetchTesoreria]);

  /* ==============================
   * EXPORT EXCEL (BINARIO)
   * ============================== */
  const exportarExcel = useCallback(() => {
    const suffix = queryString ? `?${queryString}` : "";
    const baseUrl = import.meta.env.VITE_API_URL;

    // descarga directa (correcto dejarlo así)
    window.location.href = `${baseUrl}/admin/tesoreria/movimientos/export${suffix}`;
  }, [queryString]);

  /* ==============================
   * API DEL HOOK
   * ============================== */
  return {
    // data
    movimientos,
    kpis,

    // ui
    loading,
    error,

    // filtros
    filtros,
    setFiltros,

    // acciones
    refetch: fetchTesoreria,
    exportarExcel,
  };
}
