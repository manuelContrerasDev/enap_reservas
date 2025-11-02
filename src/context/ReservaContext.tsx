import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from "react";
import { supabase, Reserva } from "../lib/supabase";

/** 🎯 Tipos de estado posibles para una reserva */
export type EstadoReserva = "pendiente" | "confirmada" | "cancelada";

/** 🧾 Datos de formulario de reserva (draft en UI) */
export interface ReservaFormData {
  espacioId: string;
  espacioNombre: string;
  tarifa: number;
  fechaInicio: string; // YYYY-MM-DD
  fechaFin: string;    // YYYY-MM-DD
  personas: number;
  total: number;
}

/** 💡 Interface del contexto */
interface ReservaContextType {
  reservas: Reserva[];
  reservaActual: ReservaFormData | null;
  loading: boolean;
  setReservaActual: (reserva: Partial<ReservaFormData> | null) => void;
  agregarReserva: (usuario: string) => Promise<boolean>;
  actualizarEstado: (id: string, nuevoEstado: EstadoReserva) => Promise<void>;
  eliminarReserva: (id: string) => Promise<void>;
  cargarReservas: () => Promise<void>;
}

/** 🧱 Contexto global */
const ReservaContext = createContext<ReservaContextType | undefined>(undefined);

/** ⚙️ Utilidades */
const MS_POR_DIA = 86_400_000;

// parse de fecha “YYYY-MM-DD” a Date a medianoche local
const parseYmd = (s?: string) => (s ? new Date(`${s}T00:00:00`) : null);

function calcularDias(inicioStr?: string, finStr?: string): number {
  const inicio = parseYmd(inicioStr);
  const fin = parseYmd(finStr);
  if (!inicio || !fin) return 0;
  const diff = fin.getTime() - inicio.getTime();
  if (!Number.isFinite(diff) || diff < 0) return 0;
  return Math.max(1, Math.ceil(diff / MS_POR_DIA));
}

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

/** 🌐 Proveedor del contexto */
export const ReservaProvider = ({ children }: { children: ReactNode }) => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [reservaActual, setReservaActualState] = useState<ReservaFormData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /** 🔄 Cargar todas las reservas (orden: recientes primero) */
  const cargarReservas = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reservas")
        .select(
          "id,usuario,espacio_id,espacio_nombre,fecha_inicio,fecha_fin,personas,total,estado,created_at,updated_at"
        )
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReservas(data ?? []);
    } catch (err) {
      console.error("❌ Error al cargar reservas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /** 📡 Realtime granular (INSERT/UPDATE/DELETE) */
  useEffect(() => {
    cargarReservas();

    const channel = supabase
      .channel("rt-reservas")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "reservas" },
        (payload) => {
          const row = payload.new as Reserva;
          // dedupe + insertar al inicio para mantener orden por created_at desc
          setReservas((prev) => [row, ...prev.filter((r) => r.id !== row.id)]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "reservas" },
        (payload) => {
          const row = payload.new as Reserva;
          setReservas((prev) => prev.map((r) => (r.id === row.id ? row : r)));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "reservas" },
        (payload) => {
          const row = payload.old as Pick<Reserva, "id">;
          setReservas((prev) => prev.filter((r) => r.id !== row.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cargarReservas]);

  /** 🧮 Setter que recalcula el total dinámicamente */
  const setReservaActual = useCallback((partial: Partial<ReservaFormData> | null) => {
    if (!partial) return setReservaActualState(null);

    setReservaActualState((prev) => {
      const merged = mergeReservaData(prev, partial);
      const dias = calcularDias(merged.fechaInicio, merged.fechaFin);
      const personas = Math.max(1, Number.isFinite(merged.personas) ? merged.personas : 1);
      const tarifa = Number.isFinite(merged.tarifa) ? merged.tarifa : 0;
      const total = dias * tarifa * personas;
      return { ...merged, total };
    });
  }, []);

  /** ➕ Crear nueva reserva (optimista ligera + RT confirma) */
  const agregarReserva = useCallback(
    async (usuario: string): Promise<boolean> => {
      if (!reservaActual) return false;

      try {
        // Insert directo; la suscripción INSERT actualizará la lista.
        const { error } = await supabase.from("reservas").insert([
          {
            usuario,
            espacio_id: reservaActual.espacioId,
            espacio_nombre: reservaActual.espacioNombre,
            fecha_inicio: reservaActual.fechaInicio,
            fecha_fin: reservaActual.fechaFin,
            personas: reservaActual.personas,
            total: reservaActual.total,
            estado: "confirmada" as EstadoReserva,
          },
        ]);
        if (error) throw error;

        console.info("✅ Reserva creada correctamente.");
        return true;
      } catch (err) {
        console.error("❌ Error al crear reserva:", err);
        // Fallback: si RT no estuviera activo, podrías descomentar:
        // await cargarReservas();
        return false;
      }
    },
    [reservaActual]
  );

  /** 🔁 Actualizar estado (optimista + rollback si falla) */
  const actualizarEstado = useCallback(
    async (id: string, nuevoEstado: EstadoReserva) => {
      // snapshot para rollback
      const prev = reservas;

      try {
        // Optimista
        setReservas((curr) =>
          curr.map((r) =>
            r.id === id ? { ...r, estado: nuevoEstado, updated_at: new Date().toISOString() } : r
          )
        );

        const { error } = await supabase
          .from("reservas")
          .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
          .eq("id", id);

        if (error) throw error;
        // RT UPDATE lo hará consistente si algo cambia del lado de la DB
      } catch (err) {
        console.error("❌ Error al actualizar estado:", err);
        // rollback
        setReservas(prev);
      }
    },
    [reservas]
  );

  /** 🗑️ Eliminar reserva (optimista + rollback si falla) */
  const eliminarReserva = useCallback(
    async (id: string) => {
      const prev = reservas;
      try {
        // Optimista
        setReservas((curr) => curr.filter((r) => r.id !== id));

        const { error } = await supabase.from("reservas").delete().eq("id", id);
        if (error) throw error;
        // RT DELETE confirmará el estado
      } catch (err) {
        console.error("❌ Error al eliminar reserva:", err);
        // rollback
        setReservas(prev);
      }
    },
    [reservas]
  );

  /** 🔒 value memoizado */
  const value = useMemo<ReservaContextType>(
    () => ({
      reservas,
      reservaActual,
      loading,
      setReservaActual,
      agregarReserva,
      actualizarEstado,
      eliminarReserva,
      cargarReservas,
    }),
    [reservas, reservaActual, loading, setReservaActual, agregarReserva, actualizarEstado, eliminarReserva, cargarReservas]
  );

  return <ReservaContext.Provider value={value}>{children}</ReservaContext.Provider>;
};

/** 🎯 Hook personalizado */
export const useReserva = (): ReservaContextType => {
  const ctx = useContext(ReservaContext);
  if (!ctx) throw new Error("useReserva debe usarse dentro de un <ReservaProvider>");
  return ctx;
};
