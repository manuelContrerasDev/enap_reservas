import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anon) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(url, anon);

// Reutilizable en tu app
export type Estado = "pendiente" | "confirmada" | "cancelada";

export interface Espacio {
  id: string;
  nombre: string;
  tipo: string;
  capacidad: number;
  tarifa: number;
  descripcion: string; // en BD never null, default ''
  imagen: string;      // en BD never null, default ''
  activo: boolean;
  created_at: string;  // timestamptz
  updated_at?: string | null; // puede ser null
}

export interface Reserva {
  id: string;
  usuario: string;
  espacio_id: string | null; // <- puede venir null
  espacio_nombre: string;
  fecha_inicio: string; // 'YYYY-MM-DD'
  fecha_fin: string;    // 'YYYY-MM-DD'
  personas: number;
  total: number;
  estado: Estado;
  created_at?: string;        // default now()
  updated_at?: string | null; // trigger lo setea, puede ser null al inicio
}

/** 🔎 Ping rápido (útil mientras configuras) */
export async function supabaseHealthCheck() {
  const { data, error } = await supabase.from("espacios").select("id").limit(1);
  return { ok: !error, error };
}
