// ============================================================
// calcularTotalReservaPreview.ts — ENAP 2025
// ⚠️ SOLO PREVIEW UI — backend es la fuente de verdad
// ============================================================

import {
  TipoEspacio,
  ModalidadCobro,
  UsoReserva,
} from "@/shared/types/enums";

interface Params {
  espacio: {
    tipo: TipoEspacio;
    modalidadCobro: ModalidadCobro;

    precioBaseSocio: number;
    precioBaseExterno: number;

    // ✅ NOMBRES REALES (Prisma / Backend)
    precioPersonaAdicionalSocio: number;
    precioPersonaAdicionalExterno: number;

    precioPiscinaSocio: number;
    precioPiscinaExterno: number;
  };

  dias: number;

  cantidadAdultos: number;
  cantidadNinos: number;
  cantidadPiscina: number;

  usoReserva: UsoReserva;
}

export function calcularTotalReservaPreview({
  espacio,
  dias,
  cantidadAdultos,
  cantidadNinos,
  cantidadPiscina,
  usoReserva,
}: Params) {
  const esSocio =
    usoReserva === UsoReserva.USO_PERSONAL ||
    usoReserva === UsoReserva.CARGA_DIRECTA;

  const tBase = esSocio
    ? espacio.precioBaseSocio
    : espacio.precioBaseExterno;

  const tPersona = esSocio
    ? espacio.precioPersonaAdicionalSocio
    : espacio.precioPersonaAdicionalExterno;

  const tPiscina = esSocio
    ? espacio.precioPiscinaSocio
    : espacio.precioPiscinaExterno;

  const diasEfectivos = Math.max(dias, 1);

  // BASE
  let precioBaseSnapshot = 0;
  if (
    espacio.modalidadCobro === ModalidadCobro.POR_DIA ||
    espacio.modalidadCobro === ModalidadCobro.POR_NOCHE
  ) {
    precioBaseSnapshot = tBase * diasEfectivos;
  }

  // PERSONAS (adultos + niños)
  const precioPersonaSnapshot =
    (cantidadAdultos + cantidadNinos) * tPersona;

  // PISCINA
  let precioPiscinaSnapshot = 0;

  if (cantidadPiscina > 0) {
    if (espacio.tipo === TipoEspacio.PISCINA) {
      // piscina principal → por día
      precioPiscinaSnapshot =
        cantidadPiscina * tPiscina * diasEfectivos;
    } else {
      // extra piscina
      const pagadas = esSocio
        ? Math.max(cantidadPiscina - 5, 0)
        : cantidadPiscina;

      precioPiscinaSnapshot = pagadas * tPiscina;
    }
  }

  return {
    totalClp:
      precioBaseSnapshot +
      precioPersonaSnapshot +
      precioPiscinaSnapshot,

    precioBaseSnapshot,
    precioPersonaSnapshot,
    precioPiscinaSnapshot,
  };
}
