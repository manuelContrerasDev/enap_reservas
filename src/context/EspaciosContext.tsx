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

import { api } from "@/lib/axios";
import { useAuth } from "@/context/auth";

import {
  CrearEspacioType,
  EditarEspacioType,
} from "@/validators/espacio.schema";

import type { TarifaPerfil } from "@/context/auth/types/auth.types";

/* ==================================================================================
 * TIPOS
 * ================================================================================== */

export interface Espacio {
  id: string;
  nombre: string;
  tipo: string;

  capacidad: number;
  capacidadExtra: number | null;

  tarifaClp: number;           // socio
  tarifaExterno: number | null; // externo

  tarifaFinal: number;         // 🔥 tarifa asignada según perfil (SOCIO / EXTERNO)

  extraSocioPorPersona: number | null;
  extraTerceroPorPersona: number | null;

  descripcion: string | null;
  imagenUrl: string | null;

  modalidadCobro: "POR_NOCHE" | "POR_DIA" | "POR_PERSONA";

  activo: boolean;

  createdAt: string;
  updatedAt: string;
}

/* ==================================================================================
 * HELPERS → Resolver imágenes
 * ================================================================================== */
const resolveImagen = (img: any): string | null => {
  if (!img) return null;

  if (/^https?:\/\//i.test(img)) return img;

  try {
    return new URL(`../../assets/${img}`, import.meta.url).href;
  } catch {
    return null;
  }
};

/* ==================================================================================
 * MAPPER → Normaliza según tarifaPerfil
 * ================================================================================== */
const toEspacioDTO = (e: any, tarifaPerfil: TarifaPerfil): Espacio => ({
  id: e.id,
  nombre: e.nombre,
  tipo: e.tipo,

  capacidad: e.capacidad,
  capacidadExtra: e.capacidadExtra,

  tarifaClp: Number(e.tarifaClp) ?? 0,
  tarifaExterno: e.tarifaExterno != null ? Number(e.tarifaExterno) : null,

  // 🔥 TARIFA DINÁMICA
  tarifaFinal:
    tarifaPerfil === "EXTERNO"
      ? Number(e.tarifaExterno ?? e.tarifaClp)
      : Number(e.tarifaClp),

  extraSocioPorPersona: e.extraSocioPorPersona,
  extraTerceroPorPersona: e.extraTerceroPorPersona,

  descripcion: e.descripcion,
  modalidadCobro: e.modalidadCobro,

  activo: e.activo,
  createdAt: e.createdAt,
  updatedAt: e.updatedAt,

  imagenUrl: resolveImagen(e.imagenUrl),
});

/* ==================================================================================
 * CONTEXT
 * ================================================================================== */
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

/* ==================================================================================
 * PROVIDER
 * ================================================================================== */
export const EspaciosProvider = ({ children }: { children: ReactNode }) => {
  const { role, isAdmin, tarifaPerfil } = useAuth();

  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [loading, setLoading] = useState(false);

  /* ============================================================
   * GET — Cargar catálogo
   * ============================================================ */
  const cargarEspacios = useCallback(
    async (filters: Record<string, any> = {}) => {
      try {
        setLoading(true);

        const endpoint = isAdmin ? "/espacios/admin" : "/espacios";

        const res = await api.get<{ ok: boolean; data: any[] }>(endpoint, {
          params: isAdmin ? undefined : filters,
        });

        const raw = Array.isArray(res.data?.data) ? res.data.data : [];

        const list = isAdmin
          ? raw.map((x) => toEspacioDTO(x, tarifaPerfil))
          : raw.filter((x) => x.activo).map((x) => toEspacioDTO(x, tarifaPerfil));

        setEspacios(list);
      } catch (err) {
        console.error("❌ Error al cargar espacios:", err);
        setEspacios([]);
      } finally {
        setLoading(false);
      }
    },
    [isAdmin, tarifaPerfil]
  );

  // Carga inicial + cambio de rol
  useEffect(() => {
    cargarEspacios();
  }, [cargarEspacios]);

  /* ============================================================
   * CRUD — Crear
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
        return toEspacioDTO(res.data.data, tarifaPerfil);
      } catch (error) {
        console.error("❌ Error al crear espacio:", error);
        return null;
      }
    },
    [cargarEspacios, tarifaPerfil]
  );

  /* ============================================================
   * CRUD — Editar
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
        return toEspacioDTO(res.data.data, tarifaPerfil);
      } catch (error) {
        console.error("❌ Error al editar espacio:", error);
        return null;
      }
    },
    [cargarEspacios, tarifaPerfil]
  );

  /* ============================================================
   * CRUD — Eliminar
   * ============================================================ */
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

  /* ============================================================
   * CRUD — Toggle activo
   * ============================================================ */
  const toggleActivo = useCallback(
    async (id: string) => {
      try {
        const res = await api.patch<{ ok: boolean; data: any }>(
          `/espacios/${id}/toggle`
        );

        if (!res.data?.ok) return null;

        await cargarEspacios();
        return toEspacioDTO(res.data.data, tarifaPerfil);
      } catch (error) {
        console.error("❌ Error al cambiar estado:", error);
        return null;
      }
    },
    [cargarEspacios, tarifaPerfil]
  );

  /* ============================================================
   * GET — Espacio individual
   * ============================================================ */
  const obtenerEspacio = useCallback(
    async (id: string) => {
      try {
        const res = await api.get<{ ok: boolean; data: any }>(
          `/espacios/${id}`
        );

        if (!res.data?.ok) return null;

        return toEspacioDTO(res.data.data, tarifaPerfil);
      } catch (error) {
        console.error("❌ Error obteniendo espacio:", error);
        return null;
      }
    },
    [tarifaPerfil]
  );

  /* ============================================================
   * GET — Disponibilidad
   * ============================================================ */
  const obtenerDisponibilidad = useCallback(async (id: string) => {
    try {
      const res = await api.get<{
        ok: boolean;
        fechas: { fechaInicio: string; fechaFin: string }[];
      }>(`/espacios/${id}/disponibilidad`);

      if (!res.data?.ok) return [];

      return res.data.fechas ?? [];
    } catch (error) {
      console.error("❌ Error obteniendo disponibilidad:", error);
      return [];
    }
  }, []);

  /* ============================================================
   * VALUE MEMO
   * ============================================================ */
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
 * HOOK
 * ================================================================================== */
export const useEspacios = () => {
  const ctx = useContext(EspaciosContext);
  if (!ctx)
    throw new Error("useEspacios debe usarse dentro de EspaciosProvider");
  return ctx;
};
