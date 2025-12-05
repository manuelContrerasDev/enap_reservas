// src/utils/normalizarReserva.ts
import type { ReservaFrontend } from "@/types/ReservaFrontend";

/**
 * Normaliza siempre el DTO del backend ENAP v2 (admin / mias)
 */
export function normalizarReserva(r: any): ReservaFrontend {
  return {
    id: String(r.id),

    espacioId: String(r.espacioId ?? r.espacio?.id ?? ""),
    espacioNombre: r.espacioNombre ?? r.espacio?.nombre ?? "Espacio",
    espacioTipo: r.espacioTipo ?? r.espacio?.tipo ?? "CABANA",

    fechaInicio: r.fechaInicio,
    fechaFin: r.fechaFin,

    dias: Number(r.dias),

    cantidadPersonas: Number(r.cantidadPersonas),
    totalClp: Number(r.totalClp),

    estado: r.estado,

    usuario: {
      id: String(r.usuario?.id ?? r.user?.id ?? ""),
      nombre: r.usuario?.nombre ?? r.user?.name ?? "",
      email: r.usuario?.email ?? r.user?.email ?? "",
    },
  };
}
