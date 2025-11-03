import { useMemo } from "react";
import type { Reserva } from "@/lib/supabase";
import type { ReservaFilters } from "./useReservaFilters";

const parseLocalDate = (s?: string) => {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 0, 0, 0, 0);
};

/** Aplica filtros (usuario, espacio, estado y fecha) */
export function useFilterReservas(reservas: Reserva[], f: ReservaFilters) {
  return useMemo(() => {
    const usuarioQ = f.fUsuario.trim().toLowerCase();
    const espacioQ = f.fEspacio.trim().toLowerCase();
    const fechaRef = parseLocalDate(f.fFecha);

    return reservas.filter((r) => {
      const okUsuario = usuarioQ ? (r.usuario || "").toLowerCase().includes(usuarioQ) : true;
      const okEspacio = espacioQ ? (r.espacio_nombre || "").toLowerCase().includes(espacioQ) : true;
      const okEstado = f.fEstado === "todas" ? true : r.estado === f.fEstado;

      let okFecha = true;
      if (fechaRef) {
        const fechaIni = new Date(r.fecha_inicio); // ISO desde Supabase
        okFecha = f.fFechaOp === ">" ? fechaIni > fechaRef : fechaIni < fechaRef;
      }
      return okUsuario && okEspacio && okEstado && okFecha;
    });
  }, [reservas, f.fUsuario, f.fEspacio, f.fEstado, f.fFecha, f.fFechaOp]);
}
