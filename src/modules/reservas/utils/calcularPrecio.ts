// src/modules/reservas/utils/calcularPrecio.ts
import { parseYmdLocal } from "@/lib";
import { calcularTotalReservaFrontend } from "@/utils/calcularTotalReservaFrontend";
import type { Espacio } from "@/context/EspaciosContext";
import type { ReservaFrontendType } from "@/validators/reserva.schema";

export interface TotalesReserva {
  dias: number;
  valorEspacio: number;
  pagoPersonas: number;
  pagoPiscina: number;
  total: number;
}

export function calcularTotalesReserva({
  espacio,
  fechaInicio,
  fechaFin,
  data,
}: {
  espacio: Espacio | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  data: ReservaFrontendType;
}): TotalesReserva {
  if (!espacio || !fechaInicio || !fechaFin) {
    return {
      dias: 0,
      valorEspacio: 0,
      pagoPersonas: 0,
      pagoPiscina: 0,
      total: 0,
    };
  }

  const ini = parseYmdLocal(fechaInicio);
  const fin = parseYmdLocal(fechaFin);

  if (!ini || !fin || !(ini instanceof Date) || !(fin instanceof Date)) {
    return {
      dias: 0,
      valorEspacio: 0,
      pagoPersonas: 0,
      pagoPiscina: 0,
      total: 0,
    };
  }

  if (fin <= ini) {
    return {
      dias: 0,
      valorEspacio: 0,
      pagoPersonas: 0,
      pagoPiscina: 0,
      total: 0,
    };
  }

  const diffMs = fin.getTime() - ini.getTime();
  const dias = Math.ceil(diffMs / 86400000);
  if (dias <= 0) {
    return {
      dias: 0,
      valorEspacio: 0,
      pagoPersonas: 0,
      pagoPiscina: 0,
      total: 0,
    };
  }

  const { total, base, totalInvitados, totalPiscina } =
    calcularTotalReservaFrontend({
      espacio: {
        tipo: espacio.tipo as any,
        tarifaClp: espacio.tarifaClp,
        tarifaExterno: espacio.tarifaExterno,
      },
      dias,
      data: {
        usoReserva: data.usoReserva,
        invitados: data.invitados ?? [],
        cantidadPersonasPiscina: data.cantidadPersonasPiscina ?? 0,
      },
    });

  return {
    dias,
    valorEspacio: base,
    pagoPersonas: totalInvitados,
    pagoPiscina: totalPiscina,
    total,
  };
}
