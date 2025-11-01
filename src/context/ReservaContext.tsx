import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { supabase, Reserva } from "../lib/supabase";

// Tipos de estado posibles
type Estado = "pendiente" | "confirmada" | "cancelada";

// Datos de formulario de reserva
export interface ReservaFormData {
  espacioId: string;
  espacioNombre: string;
  tarifa: number;         // $ por día
  fechaInicio: string;    // YYYY-MM-DD
  fechaFin: string;       // YYYY-MM-DD
  personas: number;
  total: number;          // derivado (dias * tarifa * personas)
}

// Interfaz del contexto
interface ReservaContextType {
  reservas: Reserva[];
  reservaActual: ReservaFormData | null;
  loading: boolean;
  // ✅ Ahora acepta parciales para poder sincronizar campo a campo desde el form
  setReservaActual: (reserva: Partial<ReservaFormData> | null) => void;
  agregarReserva: (usuario: string) => Promise<boolean>;
  actualizarEstado: (id: string, nuevoEstado: Estado) => Promise<void>;
  eliminarReserva: (id: string) => Promise<void>;
  cargarReservas: () => Promise<void>;
}

// Contexto global
const ReservaContext = createContext<ReservaContextType | undefined>(undefined);

// 🔢 Utilidades
const DAY = 24 * 60 * 60 * 1000;
function calcDias(inicioStr?: string, finStr?: string) {
  if (!inicioStr || !finStr) return 0;
  const inicio = new Date(inicioStr);
  const fin = new Date(finStr);
  const ms = fin.getTime() - inicio.getTime();
  if (Number.isNaN(ms) || ms < 0) return 0;
  // ✅ Mínimo 1 día si fin >= inicio
  const raw = Math.ceil(ms / DAY);
  return Math.max(1, raw);
}

function withDefaults(prev: Partial<ReservaFormData> | null, next: Partial<ReservaFormData>) {
  return {
    espacioId: prev?.espacioId ?? "",
    espacioNombre: prev?.espacioNombre ?? "",
    tarifa: prev?.tarifa ?? 0,
    fechaInicio: prev?.fechaInicio ?? "",
    fechaFin: prev?.fechaFin ?? "",
    personas: prev?.personas ?? 1,
    total: prev?.total ?? 0,
    ...next,
  } as ReservaFormData;
}

export const ReservaProvider = ({ children }: { children: ReactNode }) => {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [reservaActualState, _setReservaActualState] = useState<ReservaFormData | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Cargar todas las reservas
  const cargarReservas = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("reservas")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReservas(data || []);
    } catch (error) {
      console.error("❌ Error al cargar reservas:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 📡 Escuchar cambios en tiempo real
  useEffect(() => {
    cargarReservas();

    const channel = supabase
      .channel("reservas_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservas" },
        () => cargarReservas()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cargarReservas]);

  // ✅ Setter seguro que recalcula total a partir de (fechas, tarifa, personas)
  const setReservaActual = useCallback((partial: Partial<ReservaFormData> | null) => {
    if (partial === null) {
      _setReservaActualState(null);
      return;
    }
    _setReservaActualState((prev) => {
      const merged = withDefaults(prev, partial);
      const dias = calcDias(merged.fechaInicio, merged.fechaFin);
      const personas = Math.max(1, Number(merged.personas || 1));
      const tarifa = Number(merged.tarifa || 0);
      const total = dias * tarifa * personas;
      return { ...merged, total };
    });
  }, []);

  // ➕ Crear nueva reserva
  const agregarReserva = async (usuario: string): Promise<boolean> => {
    if (!reservaActualState) return false;

    try {
      const { error } = await supabase.from("reservas").insert([
        {
          usuario,
          espacio_id: reservaActualState.espacioId,
          espacio_nombre: reservaActualState.espacioNombre,
          fecha_inicio: reservaActualState.fechaInicio,
          fecha_fin: reservaActualState.fechaFin,
          personas: reservaActualState.personas,
          total: reservaActualState.total,
          estado: "confirmada",
        },
      ]);

      if (error) throw error;

      await cargarReservas();
      console.log("✅ Reserva creada correctamente en Supabase");
      return true;
    } catch (error) {
      console.error("❌ Error al crear reserva:", error);
      return false;
    }
  };

  // 🗑️ Eliminar reserva
  const eliminarReserva = async (id: string): Promise<void> => {
    if (!id) {
      console.warn("⚠️ Intento de eliminar reserva sin ID válido");
      return;
    }
    try {
      const { error } = await supabase.from("reservas").delete().eq("id", id);
      if (error) throw error;
      setReservas((prev) => prev.filter((r) => r.id !== id));
      console.log(`🗑️ Reserva ${id} eliminada correctamente`);
    } catch (error) {
      console.error("❌ Error al eliminar reserva:", error);
      throw error;
    }
  };

  // 🔁 Actualizar estado de una reserva
  const actualizarEstado = async (id: string, nuevoEstado: Estado): Promise<void> => {
    try {
      const { error } = await supabase
        .from("reservas")
        .update({ estado: nuevoEstado, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      setReservas((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, estado: nuevoEstado, updated_at: new Date().toISOString() } : r
        )
      );
      console.log(`🔄 Estado de reserva ${id} actualizado a ${nuevoEstado}`);
    } catch (error) {
      console.error("❌ Error al actualizar estado:", error);
      throw error;
    }
  };

  return (
    <ReservaContext.Provider
      value={{
        reservas,
        reservaActual: reservaActualState,
        loading,
        setReservaActual,   // <— usa el setter seguro
        agregarReserva,
        actualizarEstado,
        eliminarReserva,
        cargarReservas,
      }}
    >
      {children}
    </ReservaContext.Provider>
  );
};

// Hook personalizado
export const useReserva = (): ReservaContextType => {
  const context = useContext(ReservaContext);
  if (!context) throw new Error("useReserva debe usarse dentro de un ReservaProvider");
  return context;
};
