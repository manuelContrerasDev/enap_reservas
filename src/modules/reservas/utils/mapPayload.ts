// src/modules/reservas/utils/mapPayload.ts
import type { ReservaFrontendType } from "@/validators/reserva.schema";
import type { Espacio } from "@/context/EspaciosContext";
import type { CrearReservaPayload } from "@/context/ReservaContext";

export function mapCrearReservaPayload(
  data: ReservaFrontendType,
  espacio: Espacio
): CrearReservaPayload {
  return {
    espacioId: espacio.id,

    fechaInicio: data.fechaInicio,
    fechaFin: data.fechaFin,

    nombreSocio: data.nombreSocio,
    rutSocio: data.rutSocio,
    telefonoSocio: data.telefonoSocio,
    correoEnap: data.correoEnap,

    correoPersonal:
      data.correoPersonal && data.correoPersonal.trim() !== ""
        ? data.correoPersonal.trim()
        : undefined,

    usoReserva: data.usoReserva,
    socioPresente: data.socioPresente,

    nombreResponsable: data.socioPresente
      ? undefined
      : data.nombreResponsable || undefined,

    rutResponsable: data.socioPresente
      ? undefined
      : data.rutResponsable || undefined,

    emailResponsable: data.socioPresente
      ? undefined
      : data.emailResponsable || undefined,

    cantidadPersonas: data.cantidadPersonas,
    cantidadPersonasPiscina: data.cantidadPersonasPiscina ?? 0,

    terminosAceptados: data.terminosAceptados === true,

    invitados: data.invitados?.map((i) => ({
      nombre: i.nombre,
      rut: i.rut,
      edad: i.edad,
    })),
  };
}
