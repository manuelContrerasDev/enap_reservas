import { useMemo } from "react";
import type { ReservaFrontend } from "@/types/ReservaBackend";
import type { ReservaFilters } from "./useReservaFilters";

const parseLocalDate = (s?: string) => {
  if (!s) return null;
  const [y, m, d] = s.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d, 0, 0, 0, 0);
};

/** Aplica filtros a reservas (usuario, espacio, estado, fecha) */
export function useFilterReservas(reservas: ReservaFrontend[], f: ReservaFilters) {
  return useMemo(() => {
    const usuarioQ = f.fUsuario.trim().toLowerCase();
    const espacioQ = f.fEspacio.trim().toLowerCase();
    const fechaRef = parseLocalDate(f.fFecha);

    return reservas.filter((r) => {
      // usuario: nombre + email
      const userString = `${r.usuario?.nombre ?? ""} ${r.usuario?.email ?? ""}`.toLowerCase();
      const okUsuario = usuarioQ ? userString.includes(usuarioQ) : true;

      // espacio: ahora espacioNombre
      const okEspacio = espacioQ
        ? (r.espacioNombre ?? "").toLowerCase().includes(espacioQ)
        : true;

      // estado
      const okEstado = f.fEstado === "todas" ? true : r.estado === f.fEstado;

      // fecha (fechaInicio)
      let okFecha = true;
      if (fechaRef) {
        const fechaIni = new Date(r.fechaInicio);
        okFecha =
          f.fFechaOp === ">" ? fechaIni > fechaRef : fechaIni < fechaRef;
      }

      return okUsuario && okEspacio && okEstado && okFecha;
    });
  }, [reservas, f.fUsuario, f.fEspacio, f.fEstado, f.fFecha, f.fFechaOp]);
}
