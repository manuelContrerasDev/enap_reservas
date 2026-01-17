// src/modules/reservas/utils/validarCapacidad.ts
import type { ReservaFrontendType } from "@/modules/reservas/schemas/reserva.schema";

type TipoNotificacion = "error" | "info" | "success";

interface ArgsValidarCapacidad {
  data: ReservaFrontendType;
  maxCapacidad: number;
  notify: (mensaje: string, tipo: TipoNotificacion) => void;
}

export function validarCapacidad({
  data,
  maxCapacidad,
  notify,
}: ArgsValidarCapacidad): boolean {
  const cantidad = data.cantidadPersonas ?? 1;

  if (cantidad > maxCapacidad) {
    notify(
      `La cantidad de personas (${cantidad}) supera el máximo permitido (${maxCapacidad}).`,
      "error"
    );
    return false;
  }

  return true;
}
