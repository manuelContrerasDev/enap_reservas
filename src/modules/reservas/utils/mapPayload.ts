import type { CrearReservaPayload } from "@/context/ReservaContext";
import type { ReservaFrontendParsed } from "@/validators/reserva.schema";
import { UsoReserva } from "@/types/enums";

/**
 * Mapper oficial ENAP 2025
 * Frontend (DATA PARSEADA por Zod) → Payload Backend
 * ✅ NO contiene reglas de negocio
 */
export function mapCrearReservaPayload(
  data: ReservaFrontendParsed,
  espacioId: string
): CrearReservaPayload {
  return {
    espacioId,

    // Fechas
    fechaInicio: data.fechaInicio,
    fechaFin: data.fechaFin,

    // Socio (snapshot)
    nombreSocio: data.nombreSocio,
    rutSocio: data.rutSocio,
    telefonoSocio: data.telefonoSocio,
    correoEnap: data.correoEnap,
    correoPersonal: data.correoPersonal ?? undefined,

    // Uso (CAST CONTROLADO)
    usoReserva: data.usoReserva as UsoReserva,
    socioPresente: data.socioPresente,

    // Responsable (ya normalizado por Zod)
    nombreResponsable: data.nombreResponsable ?? undefined,
    rutResponsable: data.rutResponsable ?? undefined,
    emailResponsable: data.emailResponsable ?? undefined,

    // Cantidades
    cantidadPersonas: data.cantidadPersonas,
    cantidadPersonasPiscina: data.cantidadPersonasPiscina,

    // Términos
    terminosAceptados: data.terminosAceptados,

    // Invitados (array SIEMPRE definido)
    invitados: data.invitados.map((i) => ({
      nombre: i.nombre,
      rut: i.rut,
      edad: i.edad,
      esPiscina: i.esPiscina,
    })),
  };
}
