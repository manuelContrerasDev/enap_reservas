import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { supabase } from "../lib/supabase";

/** 🧾 Row real en BD (snake_case) */
type DbEspacio = {
  id: string;
  nombre: string;
  tipo: string;
  tarifa: number;
  capacidad: number | null;
  descripcion: string | null;
  imagen: string | null;
  activo: boolean | null;
  created_at: string | null;
  updated_at?: string | null;
};

/** 🎨 Modelo en UI (camelCase, con defaults) */
export interface Espacio {
  id: string;
  nombre: string;
  tipo: string;
  tarifa: number;
  capacidad?: number;
  descripcion?: string;
  imagen?: string;
  activo?: boolean;
  created_at?: string;
  updated_at?: string;
}

/** 🔁 Mapeos */
const toEspacio = (row: DbEspacio): Espacio => ({
  id: row.id,
  nombre: row.nombre,
  tipo: row.tipo,
  tarifa: Number(row.tarifa ?? 0),
  capacidad: row.capacidad ?? 1,
  descripcion: row.descripcion ?? "Sin descripción disponible",
  imagen: row.imagen ?? "",
  activo: row.activo ?? true,
  created_at: row.created_at ?? undefined,
  updated_at: row.updated_at ?? undefined,
});

const fromInsert = (nuevo: Omit<Espacio, "id" | "created_at" | "updated_at">): Partial<DbEspacio> => ({
  nombre: nuevo.nombre,
  tipo: nuevo.tipo,
  tarifa: Number(nuevo.tarifa ?? 0),
  capacidad: nuevo.capacidad ?? 1,
  descripcion: nuevo.descripcion ?? "Sin descripción disponible",
  imagen: nuevo.imagen ?? "",
  activo: nuevo.activo ?? true,
});

/** 🎛️ Interfaz de Contexto */
interface EspaciosContextType {
  espacios: Espacio[];
  loading: boolean;
  agregarEspacio: (nuevo: Omit<Espacio, "id" | "created_at" | "updated_at">) => Promise<void>;
  editarEspacio: (id: string, cambios: Partial<Espacio>) => Promise<void>;
  eliminarEspacio: (id: string) => Promise<void>;
  cargarEspacios: () => Promise<void>;
}

/** 🧩 Crear Contexto */
const EspaciosContext = createContext<EspaciosContextType | undefined>(undefined);

export const EspaciosProvider = ({ children }: { children: ReactNode }) => {
  const [espacios, setEspacios] = useState<Espacio[]>([]);
  const [loading, setLoading] = useState(true);

  /** 🔁 Cargar espacios (una sola vez + cuando se invoque) */
const cargarEspacios = useCallback(async () => {
  try {
    setLoading(true);
    const { data, error } = await supabase
      .from("espacios")
      .select(
        "id,nombre,tipo,tarifa,capacidad,descripcion,imagen,activo,created_at,updated_at"
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    const rows = (data ?? []) as unknown as DbEspacio[];
    setEspacios(rows.map(toEspacio));
  } catch (err) {
    console.error("❌ Error al cargar espacios:", err);
  } finally {
    setLoading(false);
  }
}, []);


  /** 📡 Realtime granular: INSERT/UPDATE/DELETE → actualiza estado sin refetch */
  useEffect(() => {
    cargarEspacios();

    const channel = supabase
      .channel("rt-espacios")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "espacios" },
        (payload) => {
          const row = payload.new as DbEspacio;
          setEspacios((prev) => {
            const e = toEspacio(row);
            // dedupe por id y lo insertamos arriba para respetar orden por created_at desc
            const without = prev.filter((x) => x.id !== e.id);
            return [e, ...without];
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "espacios" },
        (payload) => {
          const row = payload.new as DbEspacio;
          setEspacios((prev) => prev.map((x) => (x.id === row.id ? toEspacio(row) : x)));
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "espacios" },
        (payload) => {
          const row = payload.old as DbEspacio;
          setEspacios((prev) => prev.filter((x) => x.id !== row.id));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [cargarEspacios]);

  /** ➕ Agregar espacio (sin refetch; RT lo sincroniza igualmente) */
  const agregarEspacio = useCallback(
    async (nuevo: Omit<Espacio, "id" | "created_at" | "updated_at">): Promise<void> => {
      try {
        const insertPayload = fromInsert(nuevo);
        const { error } = await supabase.from("espacios").insert([insertPayload]);
        if (error) throw error;
        // RT INSERT actualizará el estado.
      } catch (error) {
        console.error("❌ Error al agregar espacio:", error);
        throw error;
      }
    },
    []
  );

  /** 📝 Editar espacio (optimista + RT lo confirmará) */
  const editarEspacio = useCallback(
    async (id: string, cambios: Partial<Espacio>): Promise<void> => {
      try {
        // actualización optimista
        setEspacios((prev) =>
          prev.map((x) => (x.id === id ? { ...x, ...cambios, updated_at: new Date().toISOString() } : x))
        );

        const allow: Partial<DbEspacio> = {
          nombre: cambios.nombre,
          tipo: cambios.tipo,
          tarifa: cambios.tarifa,
          capacidad: cambios.capacidad,
          descripcion: cambios.descripcion,
          imagen: cambios.imagen,
          activo: cambios.activo,
          updated_at: new Date().toISOString(),
        };

        const { error } = await supabase.from("espacios").update(allow).eq("id", id);
        if (error) throw error;
        // RT UPDATE lo vuelve consistente si algo cambia en DB.
      } catch (error) {
        console.error("❌ Error al actualizar espacio:", error);
        // revertir (en un caso real guardar snapshot para rollback)
        await cargarEspacios();
        throw error;
      }
    },
    [cargarEspacios]
  );

  /** 🗑️ Eliminar espacio (optimista + RT DELETE confirmará) */
  const eliminarEspacio = useCallback(async (id: string): Promise<void> => {
    try {
      // optimista
      setEspacios((prev) => prev.filter((x) => x.id !== id));
      const { error } = await supabase.from("espacios").delete().eq("id", id);
      if (error) throw error;
      // RT DELETE ya coincide con el estado.
    } catch (error) {
      console.error("❌ Error al eliminar espacio:", error);
      await cargarEspacios();
      throw error;
    }
  }, [cargarEspacios]);

  /** 🔒 value memoizado para evitar renders en cascada */
  const value = useMemo<EspaciosContextType>(
    () => ({
      espacios,
      loading,
      agregarEspacio,
      editarEspacio,
      eliminarEspacio,
      cargarEspacios,
    }),
    [espacios, loading, agregarEspacio, editarEspacio, eliminarEspacio, cargarEspacios]
  );

  return <EspaciosContext.Provider value={value}>{children}</EspaciosContext.Provider>;
};

/** 🎯 Hook personalizado */
export const useEspacios = (): EspaciosContextType => {
  const context = useContext(EspaciosContext);
  if (!context) throw new Error("useEspacios debe usarse dentro de un EspaciosProvider");
  return context;
};
