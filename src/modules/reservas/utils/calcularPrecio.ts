// ============================================================
// calcularPrecio.ts — Motor de cálculo Frontend ENAP (FINAL)
// ============================================================

import { parseYmdLocal } from "@/lib";
import type { EspacioDTO } from "@/types/espacios";
import { UsoReserva } from "@/types/enums";

/* ============================================================
 * Input exclusivo para cálculo (YA NORMALIZADO)
 * ============================================================ */
export interface ReservaCalculoInput {
  usoReserva: UsoReserva;
  cantidadPersonas: number;
  cantidadPersonasPiscina: number;
  invitados: {
    nombre: string;
    rut: string;
    edad?: number;
    esPiscina: boolean; // ✅ obligatorio
  }[];
}

export interface TotalesReserva {
  dias: number;
  valorEspacio: number;
  pagoPersonas: number;
  pagoPiscina: number;
  total: number;
}

/* ============================================================
 * Motor de cálculo
 * ============================================================ */
export function calcularTotalesReserva({
  espacio,
  fechaInicio,
  fechaFin,
  data,
}: {
  espacio: EspacioDTO;
  fechaInicio: string;
  fechaFin: string;
  data: ReservaCalculoInput;
}): TotalesReserva {
  const ini = parseYmdLocal(fechaInicio);
  const fin = parseYmdLocal(fechaFin);

  if (!ini || !fin || fin <= ini) {
    return {
      dias: 0,
      valorEspacio: 0,
      pagoPersonas: 0,
      pagoPiscina: 0,
      total: 0,
    };
  }

  const dias = Math.ceil(
    (fin.getTime() - ini.getTime()) / 86_400_000
  );

  const esSocio =
    data.usoReserva === UsoReserva.USO_PERSONAL ||
    data.usoReserva === UsoReserva.CARGA_DIRECTA;

  /* =========================
   * ESPACIO
   * ========================= */
  let valorEspacio = 0;

  if (espacio.modalidadCobro !== "POR_PERSONA") {
    const base = esSocio
      ? espacio.precioBaseSocio
      : espacio.precioBaseExterno;

    valorEspacio = base * dias;
  }

  /* =========================
   * PERSONAS
   * ========================= */
  const tarifaPersona = esSocio
    ? espacio.precioPersonaAdicionalSocio
    : espacio.precioPersonaAdicionalExterno;

  const pagoPersonas = data.cantidadPersonas * tarifaPersona;

  /* =========================
   * PISCINA
   * ========================= */
  const tarifaPiscina = esSocio
    ? espacio.precioPiscinaSocio
    : espacio.precioPiscinaExterno;

  const personasPiscina = data.invitados.filter(
    (i) => i.esPiscina === true
  ).length;

  const pagoPiscina = esSocio
    ? Math.max(personasPiscina - 5, 0) * tarifaPiscina
    : personasPiscina * tarifaPiscina;

  /* =========================
   * TOTAL
   * ========================= */
  const total = valorEspacio + pagoPersonas + pagoPiscina;

  return {
    dias,
    valorEspacio,
    pagoPersonas,
    pagoPiscina,
    total,
  };
}
