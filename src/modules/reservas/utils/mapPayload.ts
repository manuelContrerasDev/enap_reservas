import type { CrearReservaPayload } from "@/modules/reservas/context/ReservaContext";
import type { ReservaFrontendParsed } from "@/modules/reservas/schemas/reserva.schema";
import { UsoReserva } from "@/shared/types/enums";

/**
 * Mapper oficial ENAP 2025
 * Frontend (Zod parseado) → Payload Backend
 *
 * ✅ Sin reglas de negocio
 * ✅ Sin cálculos
 * ✅ Contrato estable y real
 */
export function mapCrearReservaPayload(
  data: ReservaFrontendParsed,
  espacioId: string
): CrearReservaPayload {
  return {
    /* ================= ESPACIO ================= */
    espacioId,

    /* ================= FECHAS ================= */
    fechaInicio: data.fechaInicio,
    fechaFin: data.fechaFin,

    /* ================= SOCIO ================= */
    nombreSocio: data.nombreSocio,
    rutSocio: data.rutSocio,
    telefonoSocio: data.telefonoSocio,
    correoEnap: data.correoEnap,
    correoPersonal: data.correoPersonal ?? undefined,

    /* ================= USO ================= */
    usoReserva: data.usoReserva as UsoReserva,
    socioPresente: data.socioPresente,

    /* ================= RESPONSABLE ================= */
    nombreResponsable: data.nombreResponsable ?? undefined,
    rutResponsable: data.rutResponsable ?? undefined,
    emailResponsable: data.emailResponsable ?? undefined,

    /* ================= CANTIDADES ================= */
    cantidadPersonas: data.cantidadPersonas,
    cantidadPersonasPiscina: data.cantidadPersonasPiscina,

    /* ================= INVITADOS ================= */
    invitados: data.invitados.map((i) => ({
      nombre: i.nombre,
      rut: i.rut,
      edad: i.edad,
      esPiscina: i.esPiscina,
    })),

    /* ================= TÉRMINOS ================= */
    terminosAceptados: data.terminosAceptados,
  };
}
