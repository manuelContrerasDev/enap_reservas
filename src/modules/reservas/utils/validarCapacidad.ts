// src/modules/reservas/utils/validarCapacidad.ts
import type { ReservaFrontendType } from "@/validators/reserva.schema";

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
  const cant = data.cantidadPersonas ?? 1;

  if (cant > maxCapacidad) {
    notify(
      `La cantidad de personas (${cant}) supera el máximo permitido (${maxCapacidad}).`,
      "error"
    );
    return false;
  }

  return true;
}
