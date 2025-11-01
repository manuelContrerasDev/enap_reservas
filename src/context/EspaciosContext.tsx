import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { supabase } from "../lib/supabase";

/** 
 * 🏗️ Definición de tipo de Espacio 
 * (adaptado para reflejar columnas de la tabla 'espacios' en Supabase)
 */
export interface Espacio {
  id: string;
  nombre: string;
  tipo: string;
  tarifa: number;
  capacidad?: number; // opcional para flexibilidad
  descripcion?: string;
  imagen?: string;
  activo?: boolean;
  created_at?: string;
}

/** 🎛️ Interfaz de Contexto */
interface EspaciosContextType {
  espacios: Espacio[];
  loading: boolean;
  agregarEspacio: (nuevo: Omit<Espacio, "id" | "created_at">) => Promise<void>;
  editarEspacio: (id: string, cambios: Partial<Espacio>) => Promise<void>;
  eliminarEspacio: (id: string) => Promise<void>;
  cargarEspacios: () => Promise<void>;
}

/** 🧩 Crear Contexto */
const EspaciosContext = createContext<EspaciosContextType | undefined>(undefined);

export const EspaciosProvider = ({ children }: { children: ReactNode }) => {
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [loading, setLoading] = useState(true);

  /** 🔁 Cargar espacios desde Supabase */
  const cargarEspacios = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("espacios")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setEspacios(data || []);
    } catch (error) {
      console.error("❌ Error al cargar espacios:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  /** 📡 Escucha en tiempo real */
  useEffect(() => {
    cargarEspacios();

    const channel = supabase
      .channel("espacios_realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "espacios" },
        () => cargarEspacios()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cargarEspacios]);

  /** ➕ Agregar espacio (con defaults) */
  const agregarEspacio = async (nuevo: Omit<Espacio, "id" | "created_at">): Promise<void> => {
    try {
      // 🧱 Asignar valores por defecto si no vienen del front
      const espacioConDefaults = {
        capacidad: nuevo.capacidad ?? 1,
        descripcion: nuevo.descripcion ?? "Sin descripción disponible",
        imagen: nuevo.imagen ?? "",
        activo: nuevo.activo ?? true,
        ...nuevo,
      };

      const { error } = await supabase.from("espacios").insert([espacioConDefaults]);
      if (error) throw error;

      await cargarEspacios();
      console.log("✅ Espacio agregado correctamente");
    } catch (error) {
      console.error("❌ Error al agregar espacio:", error);
      throw error;
    }
  };

  /** 📝 Editar espacio */
  const editarEspacio = async (id: string, cambios: Partial<Espacio>): Promise<void> => {
    try {
      const { error } = await supabase
        .from("espacios")
        .update({ ...cambios, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) throw error;

      await cargarEspacios();
      console.log("✏️ Espacio actualizado correctamente");
    } catch (error) {
      console.error("❌ Error al actualizar espacio:", error);
      throw error;
    }
  };

  /** 🗑️ Eliminar espacio */
  const eliminarEspacio = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase.from("espacios").delete().eq("id", id);
      if (error) throw error;

      await cargarEspacios();
      console.log("🗑️ Espacio eliminado correctamente");
    } catch (error) {
      console.error("❌ Error al eliminar espacio:", error);
      throw error;
    }
  };

  return (
    <EspaciosContext.Provider
      value={{
        espacios,
        loading,
        agregarEspacio,
        editarEspacio,
        eliminarEspacio,
        cargarEspacios,
      }}
    >
      {children}
    </EspaciosContext.Provider>
  );
};

/** 🎯 Hook personalizado */
export const useEspacios = (): EspaciosContextType => {
  const context = useContext(EspaciosContext);
  if (!context) {
    throw new Error("useEspacios debe usarse dentro de un EspaciosProvider");
  }
  return context;
};
