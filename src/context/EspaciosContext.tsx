// src/context/EspaciosContext.tsx
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  ReactNode,
} from "react";

import { api } from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

import {
  CrearEspacioType,
  EditarEspacioType,
} from "@/validators/espacio.schema";

/* ===============================================
 * INTERFACE PRINCIPAL — Espacio
 * =============================================== */
export interface Espacio {
  id: string;
  nombre: string;
  tipo: string;

  capacidad: number;
  capacidadExtra: number | null;

  tarifaClp: number;
  tarifaExterno: number | null;

  extraSocioPorPersona: number | null;
  extraTerceroPorPersona: number | null;

  descripcion: string | null;
  imagenUrl: string | null;

  modalidadCobro: "POR_NOCHE" | "POR_DIA" | "POR_PERSONA";

  activo: boolean;

  createdAt: string;
  updatedAt: string;
}

interface EspaciosContextType {
  espacios: Espacio[];
  loading: boolean;

  cargarEspacios: (filters?: Record<string, any>) => Promise<void>;
  crearEspacio: (data: CrearEspacioType) => Promise<Espacio | null>;
  editarEspacio: (id: string, data: EditarEspacioType) => Promise<Espacio | null>;
  eliminarEspacio: (id: string) => Promise<boolean>;
  toggleActivo: (id: string) => Promise<Espacio | null>;
  obtenerEspacio: (id: string) => Promise<Espacio | null>;
  obtenerDisponibilidad: (
    id: string
  ) => Promise<{ fechaInicio: string; fechaFin: string }[]>;
}

const EspaciosContext = createContext<EspaciosContextType | undefined>(
  undefined
);

/* ===============================================
 * MAPPER DTO
 * =============================================== */
const toEspacioDTO = (e: any): Espacio => ({
  id: e.id,
  nombre: e.nombre,
  tipo: e.tipo,

  capacidad: e.capacidad,
  capacidadExtra: e.capacidadExtra,

  tarifaClp: e.tarifaClp,
  tarifaExterno: e.tarifaExterno,

  extraSocioPorPersona: e.extraSocioPorPersona,
  extraTerceroPorPersona: e.extraTerceroPorPersona,

  descripcion: e.descripcion,
  imagenUrl: e.imagenUrl,

  modalidadCobro: e.modalidadCobro,
  activo: e.activo,

  createdAt: e.createdAt,
  updatedAt: e.updatedAt,
});

/* ===============================================
 * PROVIDER
 * =============================================== */
export const EspaciosProvider = ({ children }: { children: ReactNode }) => {
  const { role } = useAuth();

  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [loading, setLoading] = useState(false);

  /* ============================================================
   * GET — Cargar catálogo dinámico según rol
   * ============================================================ */
  const cargarEspacios = useCallback(
    async (filters: Record<string, any> = {}) => {
      try {
        setLoading(true);

        const endpoint = role === "ADMIN" ? "/espacios/admin" : "/espacios";

        const res = await api.get<{ ok: boolean; data: any[] }>(endpoint, {
          params: filters,
        });

        const data = res.data?.data ?? [];

        setEspacios(
          role === "ADMIN"
            ? data.map(toEspacioDTO)
            : data.filter((e) => e.activo).map(toEspacioDTO)
        );
      } catch (err) {
        console.error("❌ Error al cargar espacios:", err);
        setEspacios([]);
      } finally {
        setLoading(false);
      }
    },
    [role]
  );

  useEffect(() => {
    cargarEspacios();
  }, [cargarEspacios]);

  /* ============================================================
   * POST — Crear espacio
   * ============================================================ */
  const crearEspacio = useCallback(
    async (data: CrearEspacioType) => {
      try {
        const res = await api.post<{ ok: boolean; data: any }>(
          "/espacios",
          data
        );

        if (!res.data?.ok) return null;

        await cargarEspacios();
        return toEspacioDTO(res.data.data);
      } catch (err) {
        console.error("❌ Error al crear espacio:", err);
        return null;
      }
    },
    [cargarEspacios]
  );

  /* ============================================================
   * PUT — Editar espacio
   * ============================================================ */
  const editarEspacio = useCallback(
    async (id: string, data: EditarEspacioType) => {
      try {
        const res = await api.put<{ ok: boolean; data: any }>(
          `/espacios/${id}`,
          data
        );

        if (!res.data?.ok) return null;

        await cargarEspacios();
        return toEspacioDTO(res.data.data);
      } catch (err) {
        console.error("❌ Error al editar espacio:", err);
        return null;
      }
    },
    [cargarEspacios]
  );

  /* ============================================================
   * DELETE — Soft delete
   * ============================================================ */
  const eliminarEspacio = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        const res = await api.delete<{ ok: boolean }>(`/espacios/${id}`);
        await cargarEspacios();
        return !!res.data?.ok;
      } catch (err) {
        console.error("❌ Error al eliminar espacio:", err);
        return false;
      }
    },
    [cargarEspacios]
  );

  /* ============================================================
   * TOGGLE — Activar / Inactivar
   * ============================================================ */
  const toggleActivo = useCallback(
    async (id: string): Promise<Espacio | null> => {
      try {
        const res = await api.patch<{ ok: boolean; data: any }>(
          `/espacios/${id}/toggle`
        );

        if (!res.data?.ok || !res.data.data) return null;

        await cargarEspacios();
        return toEspacioDTO(res.data.data);
      } catch (err) {
        console.error("❌ Error al cambiar estado:", err);
        return null;
      }
    },
    [cargarEspacios]
  );

  /* ============================================================
   * DETALLE
   * ============================================================ */
  const obtenerEspacio = useCallback(async (id: string) => {
    try {
      const res = await api.get<{ ok: boolean; data: any }>(
        `/espacios/${id}`
      );
      return toEspacioDTO(res.data.data);
    } catch (err) {
      console.error("❌ Error al obtener espacio:", err);
      return null;
    }
  }, []);

  /* ============================================================
   * DISPONIBILIDAD
   * ============================================================ */
  const obtenerDisponibilidad = useCallback(async (id: string) => {
    try {
      const res = await api.get<{
        ok: boolean;
        id: string;
        fechas: { fechaInicio: string; fechaFin: string }[];
      }>(`/espacios/${id}/disponibilidad`);

      return res.data.fechas ?? [];
    } catch (err) {
      console.error("❌ Error al obtener disponibilidad:", err);
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

export const useEspacios = () => {
  const ctx = useContext(EspaciosContext);
  if (!ctx)
    throw new Error("useEspacios debe usarse dentro de EspaciosProvider");
  return ctx;
};
