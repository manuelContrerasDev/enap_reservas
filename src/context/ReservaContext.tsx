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

const API_URL = import.meta.env.VITE_API_URL;

/* ============================================================
 * Tipos de dominio
 * ============================================================ */
export type EstadoReserva =
  | "PENDIENTE"
  | "CONFIRMADA"
  | "CANCELADA"
  | "RECHAZADA";

export interface Reserva {
  usuario: {
    nombre: string;
    email: string;
  };

  id: string;
  espacioId: string;
  espacioNombre: string;

  fechaInicio: string; // ISO
  fechaFin: string; // ISO
  dias: number;

  personas: number;
  estado: EstadoReserva;
  total: number;
}

/**
 * Payload EXACTO que espera el backend ENAP
 * (sin guests por ahora)
 */
export interface CrearReservaPayload {
  espacioId: string;

  fechaInicio: string; // yyyy-mm-dd
  fechaFin: string; // yyyy-mm-dd

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

  terminosAceptados: boolean; // siempre true al enviar
  terminosVersion?: string;

  invitados?:
    | {
        nombre: string;
        rut: string;
        edad?: number;
      }[]
    | undefined;
}

/**
 * Estado interno para el formulario (cliente)
 * usado por ReservaForm para cálculos y UI
 */
export interface ReservaFormData {
  id?: string;
  espacioId: string;
  espacioNombre: string;
  tarifa: number;
  fechaInicio: string;
  fechaFin: string;
  personas: number;
  dias: number;
  total: number;
}

interface ReservaContextType {
  reservas: Reserva[];
  reservaActual: ReservaFormData | null;
  loading: boolean;
  error: string | null;

  setReservaActual: (r: Partial<ReservaFormData> | null) => void;

  /** Crea la reserva en backend y retorna el ID de la reserva (o null si falla) */
  crearReservaEnServidor: (
    payload: CrearReservaPayload
  ) => Promise<string | null>;

  /** Carga reservas según rol:
   *  - SOCIO/INVITADO → /api/reservas/mias
   *  - ADMIN → /api/reservas/admin
   */
  cargarReservas: () => Promise<void>;

  actualizarEstado: (id: string, estado: EstadoReserva) => Promise<void>;
  eliminarReserva: (id: string) => Promise<void>;
}

/* ============================================================
 * Contexto
 * ============================================================ */
const ReservaContext = createContext<ReservaContextType | undefined>(
  undefined
);

/* ============================================================
 * Provider
 * ============================================================ */
export const ReservaProvider = ({ children }: { children: ReactNode }) => {
  const { role, token } = useAuth();

  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [reservaActual, setReservaActualState] =
    useState<ReservaFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* ============================================================
   * Limpieza automática de errores
   * ============================================================ */
  useEffect(() => {
    if (!error) return;
    const timer = setTimeout(() => setError(null), 3000);
    return () => clearTimeout(timer);
  }, [error]);

  /* ============================================================
   * Setter inteligente para reservaActual
   * ============================================================ */
  const setReservaActual = useCallback(
    (partial: Partial<ReservaFormData> | null) => {
      if (!partial) {
        setReservaActualState(null);
        return;
      }

      setReservaActualState((prev) => {
        const base: ReservaFormData = {
          espacioId: partial.espacioId ?? prev?.espacioId ?? "",
          espacioNombre: partial.espacioNombre ?? prev?.espacioNombre ?? "",
          tarifa: partial.tarifa ?? prev?.tarifa ?? 0,
          fechaInicio: partial.fechaInicio ?? prev?.fechaInicio ?? "",
          fechaFin: partial.fechaFin ?? prev?.fechaFin ?? "",
          personas: partial.personas ?? prev?.personas ?? 1,
          dias: partial.dias ?? prev?.dias ?? 1,
          total: partial.total ?? prev?.total ?? 0,
          id: partial.id ?? prev?.id,
        };

        // 🔁 Si NO vino dias pero sí fechas → lo calculamos
        if (!partial.dias && base.fechaInicio && base.fechaFin) {
          const i = new Date(base.fechaInicio);
          const f = new Date(base.fechaFin);
          base.dias = Math.max(1, Math.ceil((+f - +i) / 86_400_000));
        }

        return base;
      });
    },
    []
  );

  /* ============================================================
   * Cargar reservas (SOCIO/INVITADO/ADMIN)
   * ============================================================ */
  const cargarReservas = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const endpoint =
        role === "ADMIN" ? "/api/reservas/admin" : "/api/reservas/mias";

      const resp = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Error cargando reservas");
      }

      const rawReservas: any[] =
        role === "ADMIN" ? data.data ?? [] : data.reservas ?? [];

      const normalizadas: Reserva[] = rawReservas.map((r: any) => ({
        usuario: {
          nombre: r.user?.name ?? "",
          email: r.user?.email ?? "",
        },

        id: r.id,
        espacioId: r.espacio?.id ?? "",
        espacioNombre: r.espacio?.nombre ?? "Espacio",

        fechaInicio: r.fechaInicio,
        fechaFin: r.fechaFin,

        dias: r.dias ?? 1,
        personas: r.cantidadPersonas ?? 1,

        estado: r.estado as EstadoReserva,
        total: r.totalClp ?? 0,
      }));

      setReservas(normalizadas);
    } catch (e: any) {
      console.error("❌ cargarReservas:", e);
      setError(e.message ?? "Error cargando reservas");
      setReservas([]);
    } finally {
      setLoading(false);
    }
  }, [token, role]);

  /* ============================================================
   * Crear reserva (SOCIO / INVITADO)
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

        if (!resp.ok || data.ok === false) {
          throw new Error(
            data.error || data.message || "No se pudo crear la reserva"
          );
        }

        const id: string | undefined = data.reserva?.id;
        if (!id) {
          throw new Error(
            "Respuesta inválida del servidor (sin ID de reserva)"
          );
        }

        await cargarReservas();
        return id;
      } catch (err: any) {
        console.error("❌ crearReservaEnServidor:", err);
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
    async (id: string, estado: EstadoReserva) => {
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
        if (!resp.ok) throw new Error(data.error || "Error al actualizar estado");

        setReservas((prev) =>
          prev.map((r) => (r.id === id ? { ...r, estado } : r))
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
   * ADMIN — Eliminar reserva
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error || "Error al eliminar reserva");

        setReservas((prev) => prev.filter((r) => r.id !== id));
      } catch (err: any) {
        console.error("❌ eliminarReserva:", err);
        setError(err.message ?? "Error al eliminar reserva");
        throw err;
      }
    },
    [token]
  );

  /* ============================================================
   * Memo
   * ============================================================ */
  const value = useMemo(
    () => ({
      reservas,
      reservaActual,
      loading,
      error,

      setReservaActual,
      crearReservaEnServidor,
      cargarReservas,

      actualizarEstado,
      eliminarReserva,
    }),
    [
      reservas,
      reservaActual,
      loading,
      error,
      setReservaActual,
      crearReservaEnServidor,
      cargarReservas,
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
  if (!ctx)
    throw new Error("useReserva debe usarse dentro del ReservaProvider");
  return ctx;
};
