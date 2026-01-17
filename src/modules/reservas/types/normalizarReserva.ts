// src/utils/normalizarReserva.ts
import type { ReservaDTO } from "@/modules/reservas/types/ReservaDTO";
import type { ReservaFrontend } from "@/modules/reservas/types/ReservaFrontend";
import { TipoEspacio, UsoReserva } from "@/shared/types/enums";

export function normalizarReserva(r: ReservaDTO): ReservaFrontend {
  const adultos = r.cantidadAdultos ?? 0;
  const ninos = r.cantidadNinos ?? 0;

  return {
    id: r.id,

    espacioId: r.espacio?.id ?? null,
    espacioNombre: r.espacio?.nombre ?? "—",
    espacioTipo: r.espacio?.tipo
      ? (r.espacio.tipo as TipoEspacio)
      : null,

    fechaInicio: r.fechaInicio,
    fechaFin: r.fechaFin,
    dias: r.dias,

    estado: r.estado,
    totalClp: r.totalClp,

    cantidadAdultos: adultos,
    cantidadNinos: ninos,
    cantidadPiscina: r.cantidadPiscina ?? 0,
    cantidadPersonas: adultos + ninos,

    socio: {
      nombre: r.socio.nombre,
      rut: r.socio.rut,
      telefono: r.socio.telefono,
      correoEnap: r.socio.correoEnap,
      correoPersonal: r.socio.correoPersonal,
    },

    usoReserva: r.usoReserva as UsoReserva,
    socioPresente: r.socioPresente,

    responsable: r.responsable
      ? {
          nombre: r.responsable.nombre,
          rut: r.responsable.rut,
          email: r.responsable.email,
          telefono: null,
        }
      : { nombre: null, rut: null, email: null, telefono: null },

    invitados: r.invitados.map((i) => ({
      id: i.id,
      nombre: i.nombre,
      rut: i.rut,
      edad: i.edad ?? null,
      esPiscina: Boolean(i.esPiscina),
    })),

    snapshot: {
      precioBase: r.snapshot?.precioBase ?? 0,
      precioPersona: r.snapshot?.precioPersona ?? 0,
      precioPiscina: r.snapshot?.precioPiscina ?? 0,
    },

    comprobanteUrl: r.comprobanteUrl ?? null,

    pago: r.pago
      ? {
          id: r.pago.id,
          status: r.pago.status,
          amountClp: r.pago.amountClp,
          buyOrder: r.pago.buyOrder,
          token: r.pago.token,
          transactionDate: r.pago.transactionDate,
        }
      : null,
  };
}
