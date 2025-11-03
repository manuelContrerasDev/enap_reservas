import {
  createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode,
} from "react";
import { supabase, Reserva } from "../lib/supabase";
import { daysBetweenInclusive } from "@/lib/date";

/** Tipos */
export type EstadoReserva = "pendiente" | "confirmada" | "cancelada";

export interface ReservaFormData {
  espacioId: string;
  espacioNombre: string;
  tarifa: number;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string;    // YYYY-MM-DD
  personas: number;
  total: number;
}

interface ReservaContextType {
  reservas: Reserva[];
  reservaActual: ReservaFormData | null;
  loading: boolean;
  error: string | null;
  setReservaActual: (reserva: Partial<ReservaFormData> | null) => void;
  agregarReserva: (usuario: string) => Promise<boolean>;
  actualizarEstado: (id: string, nuevoEstado: EstadoReserva) => Promise<void>;
  eliminarReserva: (id: string) => Promise<void>;
  cargarReservas: () => Promise<void>;
}

/** Contexto */
const ReservaContext = createContext<ReservaContextType | undefined>(undefined);

/** Utils internos */
function mergeReservaData(
  prev: Partial<ReservaFormData> | null,
  next: Partial<ReservaFormData>
): ReservaFormData {
  const base: ReservaFormData = {
    espacioId: prev?.espacioId ?? "",
    espacioNombre: prev?.espacioNombre ?? "",
    tarifa: prev?.tarifa ?? 0,
    fechaInicio: prev?.fechaInicio ?? "",
    fechaFin: prev?.fechaFin ?? "",
    personas: prev?.personas ?? 1,
    total: prev?.total ?? 0,
  };
  return { ...base, ...next };
}

/** Provider */
export const ReservaProvider = ({ children }: { children: React.ReactNode }) => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [reservaActual, setReservaActualState] = useState<ReservaFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /** Cargar reservas (evita columnas hardcodeadas) */
  const cargarReservas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("reservas")
        .select("*") // <-- sin columnas fijas
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReservas((data ?? []) as unknown as Reserva[]);
    } catch (err: any) {
      console.error("❌ Error al cargar reservas:", err?.message || err);
      setReservas([]);
      setError(err?.message ?? "No se pudo cargar reservas");
    } finally {
      setLoading(false);
    }
  }, []);

  /** Realtime (INSERT/UPDATE/DELETE) + cleanup */
  useEffect(() => {
    cargarReservas();

    const channel = supabase
      .channel("rt-reservas")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservas" },
        (payload) => {
          try {
            if (payload.eventType === "INSERT") {
              const row = payload.new as Reserva;
              setReservas((prev) => [row, ...prev.filter((r) => r.id !== row.id)]);
            } else if (payload.eventType === "UPDATE") {
              const row = payload.new as Reserva;
              setReservas((prev) => prev.map((r) => (r.id === row.id ? row : r)));
            } else if (payload.eventType === "DELETE") {
              const row = payload.old as Pick<Reserva, "id">;
              setReservas((prev) => prev.filter((r) => r.id !== row.id));
            }
          } catch (e) {
            console.warn("⚠️ Handler realtime lanzó excepción:", e);
          }
        }
      )
      .subscribe((status) => {
        // opcional: logging de estado del canal
        // console.log("realtime channel status:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cargarReservas]);

  /** Setter que recalcula total */
  const setReservaActual = useCallback((partial: Partial<ReservaFormData> | null) => {
    if (!partial) {
      setReservaActualState(null);
      return;
    }
    setReservaActualState((prev) => {
      const merged = mergeReservaData(prev, partial);
      const dias = daysBetweenInclusive(merged.fechaInicio, merged.fechaFin);
      const personas = Math.max(1, Number.isFinite(merged.personas) ? merged.personas : 1);
      const tarifa = Number.isFinite(merged.tarifa) ? merged.tarifa : 0;
      const total = dias * tarifa * personas;
      return { ...merged, total };
    });
  }, []);

  /** Crear reserva
   *  - selecciona la fila insertada para obtener los datos reales
   *  - actualiza estado local (independiente del realtime)
   */
  const agregarReserva = useCallback(
    async (usuario: string): Promise<boolean> => {
      if (!reservaActual) return false;
      try {
        const payload = {
          usuario,
          espacio_id: reservaActual.espacioId,
          espacio_nombre: reservaActual.espacioNombre,
          fecha_inicio: reservaActual.fechaInicio,
          fecha_fin: reservaActual.fechaFin,
          personas: reservaActual.personas,
          total: reservaActual.total,
          estado: "confirmada" as EstadoReserva,
        };

        const { data, error } = await supabase
          .from("reservas")
          .insert([payload])
          .select("*")
          .single();

        if (error) throw error;

        if (data) {
          // inserción inmediata en estado local por si el realtime no llega
          setReservas((prev) => [data as unknown as Reserva, ...prev]);
        }

        return true;
      } catch (err) {
        console.error("❌ Error al crear reserva:", err);
        return false;
      }
    },
    [reservaActual]
  );

  /** Update estado (optimista + fallback local) */
  const actualizarEstado = useCallback(
    async (id: string, nuevoEstado: EstadoReserva) => {
      const snapshot = reservas;
      try {
        setReservas((curr) =>
          curr.map((r) =>
            r.id === id ? { ...r, estado: nuevoEstado, updated_at: new Date().toISOString() } : r
          )
        );

        const { data, error } = await supabase
          .from("reservas")
          .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
          .eq("id", id)
          .select("*")
          .single();

        if (error) throw error;

        if (data) {
          // sincroniza con lo que devuelve la DB
          setReservas((curr) => curr.map((r) => (r.id === id ? (data as Reserva) : r)));
        }
      } catch (err) {
        console.error("❌ Error al actualizar estado:", err);
        setReservas(snapshot); // rollback
      }
    },
    [reservas]
  );

  /** Delete (optimista + rollback) */
  const eliminarReserva = useCallback(
    async (id: string) => {
      const snapshot = reservas;
      try {
        setReservas((curr) => curr.filter((r) => r.id !== id));
        const { error } = await supabase.from("reservas").delete().eq("id", id);
        if (error) throw error;
      } catch (err) {
        console.error("❌ Error al eliminar reserva:", err);
        setReservas(snapshot);
      }
    },
    [reservas]
  );

  const value = useMemo<ReservaContextType>(
    () => ({
      reservas,
      reservaActual,
      loading,
      error,
      setReservaActual,
      agregarReserva,
      actualizarEstado,
      eliminarReserva,
      cargarReservas,
    }),
    [reservas, reservaActual, loading, error, setReservaActual, agregarReserva, actualizarEstado, eliminarReserva, cargarReservas]
  );

  return <ReservaContext.Provider value={value}>{children}</ReservaContext.Provider>;
};

export const useReserva = (): ReservaContextType => {
  const ctx = useContext(ReservaContext);
  if (!ctx) throw new Error("useReserva debe usarse dentro de un <ReservaProvider>");
  return ctx;
};
