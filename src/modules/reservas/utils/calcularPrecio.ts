// ============================================================
// calcularPrecio.ts — Motor de cálculo Frontend ENAP (PRO)
// ============================================================

import { parseYmdLocal } from "@/shared/lib";
import type { EspacioDTO } from "@/modules/espacios/types/espacios";
import { UsoReserva } from "@/shared/types/enums";

/* ============================================================
 * Input exclusivo para cálculo (YA NORMALIZADO)
 * ============================================================ */
export interface ReservaCalculoInput {
  usoReserva: UsoReserva;

  /** Personas totales declaradas (incluye socio) */
  cantidadPersonas: number;

  /** Invitados declarados explícitamente */
  invitados: {
    nombre: string;
    rut: string;
    edad?: number;
    esPiscina: boolean;
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
  /* =========================
   * FECHAS (DST SAFE)
   * ========================= */
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

  /* =========================
   * ROL / TARIFA
   * ========================= */
  const esSocio =
    data.usoReserva === UsoReserva.USO_PERSONAL ||
    data.usoReserva === UsoReserva.CARGA_DIRECTA;

  /* =========================
   * ESPACIO (base)
   * ========================= */
  let valorEspacio = 0;

  if (espacio.modalidadCobro !== "POR_PERSONA") {
    const precioBase = esSocio
      ? espacio.precioBaseSocio
      : espacio.precioBaseExterno;

    valorEspacio = precioBase * dias;
  }

  /* =========================
   * PERSONAS (adicionales)
   * =========================
   * Regla actual:
   * - Se cobra por persona declarada
   * - El socio NO tiene tarifa especial aquí
   * ========================= */
  const tarifaPersona = esSocio
    ? espacio.precioPersonaAdicionalSocio
    : espacio.precioPersonaAdicionalExterno;

  const pagoPersonas =
    espacio.modalidadCobro === "POR_PERSONA"
      ? data.cantidadPersonas * tarifaPersona * dias
      : data.cantidadPersonas * tarifaPersona;

  /* =========================
   * PISCINA (SOLO SI HAY USO REAL)
   * ========================= */
  let pagoPiscina = 0;

  const personasPiscina = data.invitados.filter(
    (i) => i.esPiscina === true
  ).length;

  const permitePiscina =
    espacio.tipo === "PISCINA" ||
    espacio.tipo === "CABANA" ||
    espacio.tipo === "QUINCHO";

  if (permitePiscina && personasPiscina > 0) {
    const tarifaPiscina = esSocio
      ? espacio.precioPiscinaSocio
      : espacio.precioPiscinaExterno;

    pagoPiscina = esSocio
      ? Math.max(personasPiscina - 5, 0) * tarifaPiscina
      : personasPiscina * tarifaPiscina;
  }

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
