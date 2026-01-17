// src/context/EspaciosContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";

import { http } from "@/shared/api/http";
import { useAuth } from "@/modules/auth/hooks";

import type {
  EspacioDTO,
  ActualizarEspacioDTO,
} from "@/modules/espacios/types/espacios";

import type { CrearEspacioType } from "@/modules/espacios/schemas/espacio.schema";
import { mapEspacioFromApi } from "@/modules/espacios/mappers/espacio.mapper";

/* ==================================================================================
 * Tipos
 * ================================================================================== */

interface DisponibilidadDTO {
  fechaInicio: string;
  fechaFin: string;
}

interface ApiListResponse<T> {
  ok: boolean;
  data?: T[];
}

interface ApiItemResponse<T> {
  ok: boolean;
  data?: T;
}

/* ==================================================================================
 * Context
 * ================================================================================== */

interface EspaciosContextType {
  espacios: EspacioDTO[];
  loading: boolean;

  cargarEspacios: (filters?: Record<string, unknown>) => Promise<void>;
  crearEspacio: (data: CrearEspacioType) => Promise<EspacioDTO | null>;
  editarEspacio: (
    id: string,
    data: ActualizarEspacioDTO
  ) => Promise<EspacioDTO | null>;
  eliminarEspacio: (id: string) => Promise<boolean>;
  toggleActivo: (id: string) => Promise<EspacioDTO | null>;
  obtenerEspacio: (id: string) => Promise<EspacioDTO | null>;
  obtenerDisponibilidad: (id: string) => Promise<DisponibilidadDTO[]>;
}

const EspaciosContext = createContext<EspaciosContextType | undefined>(
  undefined
);

/* ==================================================================================
 * Provider
 * ================================================================================== */

export const EspaciosProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { isAdmin } = useAuth();

  const [espacios, setEspacios] = useState<EspacioDTO[]>([]);
  const [loading, setLoading] = useState(false);

  /* ------------------------------------------------------------
   * GET — Cargar espacios
   * ------------------------------------------------------------ */
  const cargarEspacios = useCallback(
    async (filters: Record<string, unknown> = {}) => {
      setLoading(true);

      try {
        const endpoint = isAdmin ? "/espacios/admin" : "/espacios";

        const res = await http.get<ApiListResponse<any>>(endpoint, {
          params: isAdmin ? undefined : filters,
        });

        const raw = Array.isArray(res.data?.data)
          ? res.data.data
          : [];

        const list = isAdmin
          ? raw.map(mapEspacioFromApi)
          : raw
              .filter((e) => e.activo && e.visible)
              .map(mapEspacioFromApi);

        setEspacios(list);
      } catch (error) {
        console.error("❌ [Espacios] Error al cargar espacios:", error);
        setEspacios([]);
      } finally {
        setLoading(false);
      }
    },
    [isAdmin]
  );

  useEffect(() => {
    cargarEspacios();
  }, [cargarEspacios]);

  /* ------------------------------------------------------------
   * CRUD — Crear
   * ------------------------------------------------------------ */
  const crearEspacio = useCallback(
    async (data: CrearEspacioType) => {
      try {
        const res = await http.post<ApiItemResponse<any>>(
          "/espacios",
          data
        );

        if (!res.data?.ok || !res.data.data) return null;

        await cargarEspacios();
        return mapEspacioFromApi(res.data.data);
      } catch (error) {
        console.error("❌ [Espacios] Error al crear espacio:", error);
        return null;
      }
    },
    [cargarEspacios]
  );

  /* ------------------------------------------------------------
   * CRUD — Editar
   * ------------------------------------------------------------ */
  const editarEspacio = useCallback(
    async (id: string, data: ActualizarEspacioDTO) => {
      try {
        const res = await http.put<ApiItemResponse<any>>(
          `/espacios/${id}`,
          data
        );

        if (!res.data?.ok || !res.data.data) return null;

        await cargarEspacios();
        return mapEspacioFromApi(res.data.data);
      } catch (error) {
        console.error("❌ [Espacios] Error al editar espacio:", error);
        return null;
      }
    },
    [cargarEspacios]
  );

  /* ------------------------------------------------------------
   * CRUD — Eliminar (soft delete)
   * ------------------------------------------------------------ */
  const eliminarEspacio = useCallback(
    async (id: string) => {
      try {
        const res = await http.delete<{ ok: boolean }>(
          `/espacios/${id}`
        );

        if (!res.data?.ok) return false;

        await cargarEspacios();
        return true;
      } catch (error) {
        console.error("❌ [Espacios] Error al eliminar espacio:", error);
        return false;
      }
    },
    [cargarEspacios]
  );

  /* ------------------------------------------------------------
   * CRUD — Toggle activo
   * ------------------------------------------------------------ */
  const toggleActivo = useCallback(
    async (id: string) => {
      try {
        const res = await http.patch<ApiItemResponse<any>>(
          `/espacios/${id}/toggle`
        );

        if (!res.data?.ok || !res.data.data) return null;

        await cargarEspacios();
        return mapEspacioFromApi(res.data.data);
      } catch (error) {
        console.error("❌ [Espacios] Error al cambiar estado:", error);
        return null;
      }
    },
    [cargarEspacios]
  );

  /* ------------------------------------------------------------
   * GET — Espacio individual
   * ------------------------------------------------------------ */
  const obtenerEspacio = useCallback(async (id: string) => {
    try {
      const res = await http.get<ApiItemResponse<any>>(
        `/espacios/${id}`
      );

      if (!res.data?.ok || !res.data.data) return null;

      return mapEspacioFromApi(res.data.data);
    } catch (error) {
      console.error("❌ [Espacios] Error obteniendo espacio:", error);
      return null;
    }
  }, []);

  /* ------------------------------------------------------------
   * GET — Disponibilidad
   * ------------------------------------------------------------ */
  const obtenerDisponibilidad = useCallback(async (id: string) => {
    try {
      const res = await http.get<{
        ok: boolean;
        fechas?: DisponibilidadDTO[];
      }>(`/espacios/${id}/disponibilidad`);

      return res.data?.ok && Array.isArray(res.data.fechas)
        ? res.data.fechas
        : [];
    } catch (error) {
      console.error(
        "❌ [Espacios] Error obteniendo disponibilidad:",
        error
      );
      return [];
    }
  }, []);

  const value = useMemo(
    () => ({
      espacios,
      loading,
      cargarEspacios,
      crearEspacio,
      editarEspacio,
      eliminarEspacio,
      toggleActivo,
      obtenerEspacio,
      obtenerDisponibilidad,
    }),
    [
      espacios,
      loading,
      cargarEspacios,
      crearEspacio,
      editarEspacio,
      eliminarEspacio,
      toggleActivo,
      obtenerEspacio,
      obtenerDisponibilidad,
    ]
  );

  return (
    <EspaciosContext.Provider value={value}>
      {children}
    </EspaciosContext.Provider>
  );
};

/* ==================================================================================
 * Hook
 * ================================================================================== */

export const useEspacios = () => {
  const ctx = useContext(EspaciosContext);
  if (!ctx) {
    throw new Error(
      "useEspacios debe usarse dentro de EspaciosProvider"
    );
  }
  return ctx;
};
