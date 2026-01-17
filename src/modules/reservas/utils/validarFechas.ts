// src/modules/reservas/utils/validarFechas.ts
import { parseYmdLocal } from "@/shared/lib";
import type { ReservaFrontendType } from "@/modules/reservas/schemas/reserva.schema";
import type { EspacioDTO } from "@/modules/espacios/types/espacios";

export interface BloqueFecha {
  fechaInicio: string;
  fechaFin: string;
}

type TipoNotificacion = "error" | "info" | "success";

interface ArgsValidarFechas {
  data: ReservaFrontendType;
  espacio: EspacioDTO | null;
  bloquesOcupados: BloqueFecha[];
  notify: (mensaje: string, tipo: TipoNotificacion) => void;
}

const isMonday = (d: Date) => d.getDay() === 1;

export function validarFechasConBloques({
  data,
  espacio,
  bloquesOcupados,
  notify,
}: ArgsValidarFechas): boolean {
  if (!espacio) {
    notify("Espacio no disponible.", "error");
    return false;
  }

  if (!data.fechaInicio || !data.fechaFin) {
    notify("Debes seleccionar fecha de inicio y término.", "error");
    return false;
  }

  const ini = parseYmdLocal(data.fechaInicio);
  const fin = parseYmdLocal(data.fechaFin);

  if (!ini || !fin) {
    notify("Fechas inválidas.", "error");
    return false;
  }

  // ❗ Regla ENAP: NO iniciar lunes (sí puede terminar lunes)
  if (isMonday(ini)) {
    notify("No puedes iniciar una reserva en día lunes.", "error");
    return false;
  }

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (ini < hoy) {
    notify("No puedes reservar en una fecha pasada.", "error");
    return false;
  }

  if (fin <= ini) {
    notify(
      "La fecha de término debe ser posterior a la de inicio.",
      "error"
    );
    return false;
  }

  const dias =
    Math.ceil(
      (fin.getTime() - ini.getTime()) / 86_400_000
    );

  // ⛔ Min / max días solo para CAB / QUINCHO
  if (espacio.tipo !== "PISCINA") {
    if (dias < 3 || dias > 6) {
      notify(
        "Las reservas deben tener mínimo 3 y máximo 6 días.",
        "error"
      );
      return false;
    }
  }

  // 🔒 Solapamiento con bloques ocupados (espacio principal)
  const solapa = bloquesOcupados.some((b) => {
    const iniO = new Date(b.fechaInicio);
    const finO = new Date(b.fechaFin);
    return ini <= finO && fin >= iniO;
  });

  if (solapa) {
    notify(
      "El espacio ya está reservado en ese rango de fechas.",
      "error"
    );
    return false;
  }

  return true;
}
