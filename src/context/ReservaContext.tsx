// src/context/ReservaContext.tsx

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  ReactNode,
  useEffect,
} from "react";

import { useAuth } from "@/context/auth";
import { api } from "@/lib/axios";

import { normalizarReserva } from "@/utils/normalizarReserva";
import type { ReservaFrontend } from "@/types/ReservaFrontend";
import type { ReservaEstado } from "@/types/enums";

/* ============================================================
 * 🟦 ReservaDraft — Estado temporal durante el formulario
 * ============================================================ */
export type ReservaDraft = Partial<ReservaFrontend> & {
  espacioId?: string;
  espacioNombre?: string;
  fechaInicio?: string;
  fechaFin?: string;
  dias?: number;
  total?: number;
  cantidadPersonas?: number;
};

/* ============================================================
 * Payload creación
 * ============================================================ */
// ============================================================
// Payload creación (SYNC con backend/baseReservaSchema)
// ============================================================
export interface CrearReservaPayload {
  espacioId: string;

  fechaInicio: string;
  fechaFin: string;

  /* -------- DATOS SOCIO -------- */
  nombreSocio: string;
  rutSocio: string;
  telefonoSocio: string;
  correoEnap: string;
  correoPersonal?: string; // 👈 sin null

  /* -------- USO RESERVA -------- */
  usoReserva: "USO_PERSONAL" | "CARGA_DIRECTA" | "TERCEROS";
  socioPresente: boolean;

  /* -------- RESPONSABLE -------- */
  nombreResponsable?: string;
  rutResponsable?: string;
  emailResponsable?: string;

  /* -------- CANTIDADES -------- */
  cantidadPersonas: number;
  cantidadPersonasPiscina?: number;

  /* -------- TÉRMINOS -------- */
  terminosAceptados: boolean;

  /* -------- INVITADOS -------- */
  invitados?: {
    nombre: string;
    rut: string;
    edad?: number;
  }[];
}


/* ============================================================
 * Query params
 * ============================================================ */
export interface ReservasQueryParams {
  estado?: ReservaEstado | "TODOS";
  espacioId?: string;
  socioId?: string;
  fechaInicio?: string;
  fechaFin?: string;
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
}

/* ============================================================
 * Contexto
 * ============================================================ */
interface ReservaContextType {
  reservas: ReservaFrontend[];
  loading: boolean;
  error: string | null;

  meta: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  } | null;

  reservaActual: ReservaDraft | null;
  setReservaActual: (data: ReservaDraft | null) => void;

  cargarReservas: (params?: ReservasQueryParams) => Promise<void>;
  crearReservaEnServidor: (
    payload: CrearReservaPayload
  ) => Promise<string | null>;
  actualizarEstado: (id: string, estado: ReservaEstado) => Promise<void>;
  eliminarReserva: (id: string) => Promise<void>;
}

const ReservaContext = createContext<ReservaContextType | undefined>(undefined);

/* ============================================================
 * Provider
 * ============================================================ */
export const ReservaProvider = ({ children }: { children: ReactNode }) => {
  const { isAdmin, isAuthenticated } = useAuth();

  const [reservas, setReservas] = useState<ReservaFrontend[]>([]);
  const [meta, setMeta] = useState<ReservaContextType["meta"]>(null);

  const [reservaActual, setReservaActualState] = useState<ReservaDraft | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ============================================================
   * Limpieza automática de errores
   * ============================================================ */
  useEffect(() => {
    if (!error) return;
    const id = setTimeout(() => setError(null), 2500);
    return () => clearTimeout(id);
  }, [error]);

  /* ============================================================
   * Setter inteligente para reservaActual (wizard)
   * ============================================================ */
  const setReservaActual = useCallback((partial: ReservaDraft | null) => {
    if (!partial) return setReservaActualState(null);
    setReservaActualState((prev) => ({ ...prev, ...partial }));
  }, []);

  /* ============================================================
   * Cargar reservas (ADMIN paginado / SOCIO-EXTERNO simple)
   * ============================================================ */
  const cargarReservas = useCallback(
    async (params?: ReservasQueryParams) => {
      if (!isAuthenticated) return;

      setLoading(true);
      try {
        /* ---------------- ADMIN ---------------- */
        if (isAdmin) {
          const q: Record<string, any> = {};

          if (params?.estado && params.estado !== "TODOS")
            q.estado = params.estado;

          if (params?.espacioId) q.espacioId = params.espacioId;
          if (params?.socioId) q.socioId = params.socioId;
          if (params?.fechaInicio) q.fechaInicio = params.fechaInicio;
          if (params?.fechaFin) q.fechaFin = params.fechaFin;

          q.page = params?.page ?? 1;
          q.limit = params?.limit ?? 20;
          q.sort = params?.sort ?? "fechaInicio";
          q.order = params?.order ?? "desc";

          const resp = await api.get<{
            ok: boolean;
            data: any[];
            meta: ReservaContextType["meta"];
          }>("/reservas/admin", {
            params: q,
          });

          if (!resp.data.ok) {
            throw new Error("Error cargando reservas");
          }

          setMeta(resp.data.meta ?? null);
          setReservas(resp.data.data.map(normalizarReserva));
        }

        /* ---------------- SOCIO / EXTERNO ---------------- */
        else {
          const resp = await api.get<{ ok: boolean; reservas: any[] }>(
            "/reservas/mias"
          );

          if (!resp.data.ok) {
            throw new Error("Error cargando reservas");
          }

          const normal = resp.data.reservas.map(normalizarReserva);
          setReservas(normal);

          setMeta({
            total: normal.length,
            pages: 1,
            page: 1,
            limit: normal.length,
          });
        }
      } catch (e: any) {
        console.error("❌ cargarReservas:", e);
        setError(e.message ?? "Error cargando reservas");
        setReservas([]);
        setMeta(null);
      } finally {
        setLoading(false);
      }
    },
    [isAdmin, isAuthenticated]
  );

  /* ============================================================
   * Crear Reserva
   * ============================================================ */
  const crearReservaEnServidor = useCallback(
    async (payload: CrearReservaPayload): Promise<string | null> => {
      if (!isAuthenticated) {
        setError("No autenticado.");
        return null;
      }

      setLoading(true);
      try {
        const resp = await api.post<{
          ok: boolean;
          data?: { id?: string };
          error?: string;
        }>("/reservas", payload);

        if (!resp.data.ok) {
          throw new Error(resp.data.error || "Error creando reserva");
        }

        const id: string | undefined = resp.data.data?.id;
        if (!id) throw new Error("Respuesta inválida del servidor");

        // recargamos reservas del usuario (o admin)
        await cargarReservas();
        return id;
      } catch (err: any) {
        console.error("❌ crearReserva:", err);
        setError(err.message ?? "Error al crear la reserva");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, cargarReservas]
  );

  /* ============================================================
   * ADMIN — Actualizar estado
   * ============================================================ */
  const actualizarEstado = useCallback(
    async (id: string, estado: ReservaEstado) => {
      if (!isAuthenticated) {
        setError("No autenticado.");
        return;
      }

      try {
        const resp = await api.patch<{
          ok: boolean;
          reserva?: any;
          error?: string;
        }>(`/reservas/${id}/estado`, { estado });

        if (!resp.data.ok || !resp.data.reserva) {
          throw new Error(resp.data.error || "Error actualizando reserva");
        }

        setReservas((prev) =>
          prev.map((r) =>
            r.id === id ? normalizarReserva(resp.data.reserva) : r
          )
        );
      } catch (err: any) {
        console.error("❌ actualizarEstado:", err);
        setError(err.message ?? "Error al actualizar estado");
        throw err;
      }
    },
    [isAuthenticated]
  );

  /* ============================================================
   * ADMIN — Eliminar
   * ============================================================ */
  const eliminarReserva = useCallback(
    async (id: string) => {
      if (!isAuthenticated) {
        setError("No autenticado.");
        return;
      }

      try {
        const resp = await api.delete<{ ok: boolean; error?: string }>(
          `/reservas/${id}`
        );

        if (!resp.data.ok) {
          throw new Error(resp.data.error || "Error al eliminar reserva");
        }

        setReservas((prev) => prev.filter((r) => r.id !== id));
      } catch (err: any) {
        console.error("❌ eliminarReserva:", err);
        setError(err.message ?? "Error eliminando reserva");
        throw err;
      }
    },
    [isAuthenticated]
  );

  /* ============================================================
   * VALUE
   * ============================================================ */
  const value = useMemo(
    () => ({
      reservas,
      loading,
      error,
      meta,

      reservaActual,
      setReservaActual,

      cargarReservas,
      crearReservaEnServidor,
      actualizarEstado,
      eliminarReserva,
    }),
    [
      reservas,
      loading,
      error,
      meta,
      reservaActual,
      setReservaActual,
      cargarReservas,
      crearReservaEnServidor,
      actualizarEstado,
      eliminarReserva,
    ]
  );

  return (
    <ReservaContext.Provider value={value}>
      {children}
    </ReservaContext.Provider>
  );
};

/* ============================================================
 * Hook
 * ============================================================ */
export const useReserva = () => {
  const ctx = useContext(ReservaContext);
  if (!ctx) throw new Error("useReserva debe usarse dentro de ReservaProvider");
  return ctx;
};
