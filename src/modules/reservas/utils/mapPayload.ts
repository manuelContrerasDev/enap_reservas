import type { CrearReservaPayload } from "@/context/ReservaContext";
import type { ReservaFrontendParsed } from "@/validators/reserva.schema";
import { UsoReserva } from "@/types/enums";

/**
 * Mapper oficial ENAP 2025
 * Frontend (DATA PARSEADA por Zod) → Payload Backend
 *
 * ✅ No contiene reglas de negocio
 * ✅ No calcula totales/precios (eso es backend)
 * ✅ Mantiene contrato estable y predecible
 */
export function mapCrearReservaPayload(
  data: ReservaFrontendParsed,
  espacioId: string
): CrearReservaPayload {
  return {
    espacioId,

    // Fechas (ya vienen en ISO desde el hook)
    fechaInicio: data.fechaInicio,
    fechaFin: data.fechaFin,

    // Socio (snapshot)
    nombreSocio: data.nombreSocio,
    rutSocio: data.rutSocio,
    telefonoSocio: data.telefonoSocio,
    correoEnap: data.correoEnap,
    correoPersonal: data.correoPersonal ?? undefined,

    // Uso (Zod valida enum, cast seguro para typing)
    usoReserva: data.usoReserva as UsoReserva,
    socioPresente: data.socioPresente,

    // Responsable (normalizado por Zod)
    nombreResponsable: data.nombreResponsable ?? undefined,
    rutResponsable: data.rutResponsable ?? undefined,
    emailResponsable: data.emailResponsable ?? undefined,

    // Cantidades
    cantidadPersonas: data.cantidadPersonas,
    cantidadPersonasPiscina: data.cantidadPersonasPiscina,

    // Términos
    terminosAceptados: data.terminosAceptados,

    // Invitados (array siempre definido por schema)
    invitados: data.invitados.map((i) => ({
      nombre: i.nombre,
      rut: i.rut,
      edad: i.edad,
      esPiscina: i.esPiscina,
    })),
  };
}
