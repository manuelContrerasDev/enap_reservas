// src/context/EspaciosContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";

import { api } from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";

import {
  CrearEspacioType,
  EditarEspacioType,
} from "@/validators/espacio.schema";

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
 * MAPPER SEGURO
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
  const { user } = useAuth();
  const userRole = user?.role ?? "SOCIO";

  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [loading, setLoading] = useState(false);

  /* ============================================================
   * GET — Cargar catálogo
   * ============================================================ */
  const cargarEspacios = async (filters: Record<string, any> = {}) => {
    try {
      setLoading(true);

      const endpoint =
        userRole === "ADMIN" ? "/espacios/admin" : "/espacios";

      const res = await api.get<{ ok: boolean; data: any[] }>(endpoint, {
        params: filters,
      });

      const raw = Array.isArray(res.data?.data) ? res.data.data : [];

      let list: Espacio[] = [];

      if (userRole === "ADMIN") {
        list = raw.map(toEspacioDTO);
      } else {
        list = raw.filter((x) => x.activo).map(toEspacioDTO);
      }

      setEspacios(list);
    } catch (err) {
      console.error("❌ Error al cargar espacios:", err);
      setEspacios([]);
    } finally {
      setLoading(false);
    }
  };

  // Carga inicial + cada cambio de rol
  useEffect(() => {
    cargarEspacios();
  }, [userRole]);

  /* ============================================================
   * CRUD
   * ============================================================ */

  const crearEspacio = async (data: CrearEspacioType) => {
    try {
      const res = await api.post<{ ok: boolean; data: any }>(
        "/espacios",
        data
      );
      if (!res.data?.ok) return null;
      await cargarEspacios();
      return toEspacioDTO(res.data.data);
    } catch {
      return null;
    }
  };

  const editarEspacio = async (id: string, data: EditarEspacioType) => {
    try {
      const res = await api.put<{ ok: boolean; data: any }>(
        `/espacios/${id}`,
        data
      );
      if (!res.data?.ok) return null;
      await cargarEspacios();
      return toEspacioDTO(res.data.data);
    } catch {
      return null;
    }
  };

  const eliminarEspacio = async (id: string) => {
    try {
      const res = await api.delete<{ ok: boolean }>(`/espacios/${id}`);
      await cargarEspacios();
      return !!res.data?.ok;
    } catch {
      return false;
    }
  };

  const toggleActivo = async (id: string) => {
    try {
      const res = await api.patch<{ ok: boolean; data: any }>(
        `/espacios/${id}/toggle`
      );
      if (!res.data?.ok) return null;
      await cargarEspacios();
      return toEspacioDTO(res.data.data);
    } catch {
      return null;
    }
  };

  /* ============================================================
   * GET — Espacio individual
   * ============================================================ */
  const obtenerEspacio = async (id: string) => {
    try {
      const res = await api.get<{ ok: boolean; data: any }>(
        `/espacios/${id}`
      );

      if (!res.data?.data) return null;

      return toEspacioDTO(res.data.data);
    } catch {
      return null;
    }
  };

  /* ============================================================
   * GET — Disponibilidad
   * ============================================================ */
  const obtenerDisponibilidad = async (id: string) => {
    try {
      const res = await api.get<{
        ok: boolean;
        fechas: { fechaInicio: string; fechaFin: string }[];
      }>(`/espacios/${id}/disponibilidad`);

      return res.data.fechas ?? [];
    } catch {
      return [];
    }
  };

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
    [espacios, loading]
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
