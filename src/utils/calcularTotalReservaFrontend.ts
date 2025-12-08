// src/utils/calcularTotalReservaFrontend.ts

type TipoEspacioFrontend = "CABANA" | "QUINCHO" | "PISCINA";

interface Params {
  espacio: {
    tipo: TipoEspacioFrontend;
    tarifaClp: number | null;
    tarifaExterno: number | null;
  };
  dias: number;
  data: {
    usoReserva?: "USO_PERSONAL" | "CARGA_DIRECTA" | "TERCEROS";
    invitados?: { edad?: number | null }[];
    cantidadPersonasPiscina?: number;
  };
}

export function calcularTotalReservaFrontend({ espacio, dias, data }: Params) {
  // ============================================================
  // 1. SOCIO vs EXTERNO según usoReserva
  // ============================================================
  const usoReserva = data.usoReserva ?? "USO_PERSONAL";
  const esSocio =
    usoReserva === "USO_PERSONAL" || usoReserva === "CARGA_DIRECTA";

  // ============================================================
  // 2. Tarifas base desde espacio
  // ============================================================
  const tarifaSocioBase = espacio.tarifaClp ?? 0;
  const tarifaExternoBase = espacio.tarifaExterno ?? tarifaSocioBase;

  const tarifaBaseAplicada = esSocio ? tarifaSocioBase : tarifaExternoBase;

  // CAB/QUIN: base * días / PISCINA: sin base
  const base =
    espacio.tipo === "PISCINA" ? 0 : tarifaBaseAplicada * Math.max(dias, 1);

  // ============================================================
  // 3. Invitados — solo pagan mayores (>= 13 años)
  // ============================================================
  const invitados = data.invitados ?? [];
  const mayores = invitados.filter((i) => (i.edad ?? 13) >= 13).length;

  const TARIFA_INVITADO_SOCIO = 3500;
  const TARIFA_INVITADO_EXTERNO = 4000;

  const totalInvitados = esSocio
    ? mayores * TARIFA_INVITADO_SOCIO
    : mayores * TARIFA_INVITADO_EXTERNO;

  // ============================================================
  // 4. Piscina — regla 5 gratis para socio
  // ============================================================
  const TARIFA_PISCINA_SOCIO = 3500;
  const TARIFA_PISCINA_EXTERNO = 4500;

  const cantPiscina = Number(data.cantidadPersonasPiscina ?? 0);
  let totalPiscina = 0;

  if (esSocio) {
    const excedentes = Math.max(0, cantPiscina - 5);
    totalPiscina = excedentes * TARIFA_PISCINA_SOCIO;
  } else {
    totalPiscina = cantPiscina * TARIFA_PISCINA_EXTERNO;
  }

  // ============================================================
  // 5. TOTAL
  // ============================================================
  const total = base + totalInvitados + totalPiscina;

  return {
    total,
    base,
    totalInvitados,
    totalPiscina,
  };
}
