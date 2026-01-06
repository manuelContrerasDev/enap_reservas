import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  ReactNode,
} from "react";

import { api } from "@/lib/axios";
import { useAuth } from "@/context/auth";

import type {
  EspacioDTO,
  ActualizarEspacioDTO,
} from "@/types/espacios";

import type { CrearEspacioType } from "@/validators/espacio.schema";

/* ==================================================================================
 * Helpers
 * ================================================================================== */

const resolveImagen = (img: unknown): string | null => {
  if (!img || typeof img !== "string") return null;
  if (/^https?:\/\//i.test(img)) return img;

  try {
    return new URL(`../../assets/${img}`, import.meta.url).href;
  } catch {
    return null;
  }
};

/* ==================================================================================
 * Mapper — Backend → Frontend
 * ================================================================================== */

const toEspacioDTO = (e: any): EspacioDTO => ({
  id: e.id,
  nombre: e.nombre,
  tipo: e.tipo,

  capacidad: e.capacidad,

  descripcion: e.descripcion ?? null,
  imagenUrl: resolveImagen(e.imagenUrl),

  activo: e.activo,
  visible: e.visible,
  orden: e.orden,

  modalidadCobro: e.modalidadCobro,

  precioBaseSocio: e.precioBaseSocio,
  precioBaseExterno: e.precioBaseExterno,

  precioPersonaAdicionalSocio: e.precioPersonaAdicionalSocio,
  precioPersonaAdicionalExterno: e.precioPersonaAdicionalExterno,

  precioPiscinaSocio: e.precioPiscinaSocio,
  precioPiscinaExterno: e.precioPiscinaExterno,

  createdAt: e.createdAt,
  updatedAt: e.updatedAt,
});

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
  obtenerDisponibilidad: (
    id: string
  ) => Promise<{ fechaInicio: string; fechaFin: string }[]>;
}

const EspaciosContext = createContext<EspaciosContextType | undefined>(undefined);

/* ==================================================================================
 * Provider
 * ================================================================================== */

export const EspaciosProvider = ({ children }: { children: ReactNode }) => {
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

        const res = await api.get<{ ok: boolean; data: any[] }>(endpoint, {
          params: isAdmin ? undefined : filters,
        });

        const raw = Array.isArray(res.data?.data) ? res.data.data : [];

        const list = isAdmin
          ? raw.map(toEspacioDTO)
          : raw
              .filter((e) => e.activo && e.visible)
              .map(toEspacioDTO);

        setEspacios(list);
      } catch (error) {
        console.error("❌ Error al cargar espacios:", error);
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
        const res = await api.post<{ ok: boolean; data: any }>("/espacios", data);
        if (!res.data?.ok) return null;

        await cargarEspacios();
        return toEspacioDTO(res.data.data);
      } catch (error) {
        console.error("❌ Error al crear espacio:", error);
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
        const res = await api.put<{ ok: boolean; data: any }>(
          `/espacios/${id}`,
          data
        );

        if (!res.data?.ok) return null;

        await cargarEspacios();
        return toEspacioDTO(res.data.data);
      } catch (error) {
        console.error("❌ Error al editar espacio:", error);
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
        const res = await api.delete<{ ok: boolean }>(`/espacios/${id}`);
        if (!res.data?.ok) return false;

        await cargarEspacios();
        return true;
      } catch (error) {
        console.error("❌ Error al eliminar espacio:", error);
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
        const res = await api.patch<{ ok: boolean; data: any }>(
          `/espacios/${id}/toggle`
        );

        if (!res.data?.ok) return null;

        await cargarEspacios();
        return toEspacioDTO(res.data.data);
      } catch (error) {
        console.error("❌ Error al cambiar estado:", error);
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
      const res = await api.get<{ ok: boolean; data: any }>(`/espacios/${id}`);
      if (!res.data?.ok) return null;

      return toEspacioDTO(res.data.data);
    } catch (error) {
      console.error("❌ Error obteniendo espacio:", error);
      return null;
    }
  }, []);

  /* ------------------------------------------------------------
   * GET — Disponibilidad
   * ------------------------------------------------------------ */
  const obtenerDisponibilidad = useCallback(async (id: string) => {
    try {
      const res = await api.get<{
        ok: boolean;
        fechas: { fechaInicio: string; fechaFin: string }[];
      }>(`/espacios/${id}/disponibilidad`);

      return res.data?.ok ? res.data.fechas ?? [] : [];
    } catch (error) {
      console.error("❌ Error obteniendo disponibilidad:", error);
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
    throw new Error("useEspacios debe usarse dentro de EspaciosProvider");
  }
  return ctx;
};
