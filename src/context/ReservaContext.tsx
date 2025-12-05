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

import { useAuth } from "@/context/AuthContext";
import { normalizarReserva } from "@/utils/normalizarReserva";
import type { ReservaFrontend } from "@/types/ReservaFrontend";
import type { ReservaEstado } from "@/types/enums";

const API_URL = import.meta.env.VITE_API_URL;

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
export interface CrearReservaPayload {
  espacioId: string;

  fechaInicio: string;
  fechaFin: string;

  nombreSocio: string;
  rutSocio: string;
  telefonoSocio: string;
  correoEnap: string;
  correoPersonal?: string;

  usoReserva: "USO_PERSONAL" | "CARGA_DIRECTA" | "TERCEROS";
  socioPresente: boolean;

  nombreResponsable?: string;
  rutResponsable?: string;
  emailResponsable?: string;

  cantidadPersonas: number;

  terminosAceptados: boolean;
  terminosVersion?: string;

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
  const { role, token } = useAuth();

  const [reservas, setReservas] = useState<ReservaFrontend[]>([]);
  const [meta, setMeta] = useState<ReservaContextType["meta"]>(null);

  const [reservaActual, setReservaActualState] = useState<ReservaDraft | null>(
    null
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ============================================================
   * Limpieza auto errores
   * ============================================================ */
  useEffect(() => {
    if (!error) return;
    const id = setTimeout(() => setError(null), 2500);
    return () => clearTimeout(id);
  }, [error]);

  /* ============================================================
   * Setter inteligente
   * ============================================================ */
  const setReservaActual = useCallback((partial: ReservaDraft | null) => {
    if (!partial) return setReservaActualState(null);

    setReservaActualState((prev) => ({ ...prev, ...partial }));
  }, []);

  /* ============================================================
   * Cargar reservas (ADMIN paginado / SOCIO simple)
   * ============================================================ */
  const cargarReservas = useCallback(
    async (params?: ReservasQueryParams) => {
      if (!token) return;

      setLoading(true);
      try {
        /* ---------------- ADMIN ---------------- */
        if (role === "ADMIN") {
          const q = new URLSearchParams();

          if (params?.estado && params.estado !== "TODOS")
            q.set("estado", params.estado);

          if (params?.espacioId) q.set("espacioId", params.espacioId);
          if (params?.socioId) q.set("socioId", params.socioId);
          if (params?.fechaInicio) q.set("fechaInicio", params.fechaInicio);
          if (params?.fechaFin) q.set("fechaFin", params.fechaFin);

          q.set("page", String(params?.page ?? 1));
          q.set("limit", String(params?.limit ?? 20));
          q.set("sort", params?.sort ?? "fechaInicio");
          q.set("order", params?.order ?? "desc");

          const resp = await fetch(
            `${API_URL}/api/reservas/admin?${q.toString()}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          const data = await resp.json();
          if (!resp.ok) throw new Error(data.error || "Error cargando reservas");

          setMeta(data.meta);
          setReservas(data.data.map(normalizarReserva));
        }

        /* ---------------- SOCIO ---------------- */
        else {
          const resp = await fetch(`${API_URL}/api/reservas/mias`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = await resp.json();
          if (!resp.ok) throw new Error(data.error || "Error cargando reservas");

          const normal = data.reservas.map(normalizarReserva);
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
    [token, role]
  );

  /* ============================================================
   * Crear Reserva
   * ============================================================ */
  const crearReservaEnServidor = useCallback(
    async (payload: CrearReservaPayload): Promise<string | null> => {
      if (!token) {
        setError("No autenticado.");
        return null;
      }

      setLoading(true);
      try {
        const resp = await fetch(`${API_URL}/api/reservas`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await resp.json();

        if (!resp.ok) throw new Error(data.error || "Error creando reserva");

        const id = data.reserva?.id;
        if (!id) throw new Error("Respuesta inválida del servidor");

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
    [token, cargarReservas]
  );

  /* ============================================================
   * ADMIN — Actualizar estado
   * ============================================================ */
  const actualizarEstado = useCallback(
    async (id: string, estado: ReservaEstado) => {
      if (!token) {
        setError("No autenticado.");
        return;
      }

      try {
        const resp = await fetch(`${API_URL}/api/reservas/${id}/estado`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ estado }),
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || "Error actualizando");

        setReservas((prev) =>
          prev.map((r) => (r.id === id ? normalizarReserva(data.reserva) : r))
        );
      } catch (err: any) {
        console.error("❌ actualizarEstado:", err);
        setError(err.message ?? "Error al actualizar estado");
        throw err;
      }
    },
    [token]
  );

  /* ============================================================
   * ADMIN — Eliminar
   * ============================================================ */
  const eliminarReserva = useCallback(
    async (id: string) => {
      if (!token) {
        setError("No autenticado.");
        return;
      }

      try {
        const resp = await fetch(`${API_URL}/api/reservas/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || "Error al eliminar reserva");

        setReservas((prev) => prev.filter((r) => r.id !== id));
      } catch (err: any) {
        console.error("❌ eliminarReserva:", err);
        setError(err.message ?? "Error eliminando reserva");
        throw err;
      }
    },
    [token]
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
