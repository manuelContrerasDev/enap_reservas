export type TipoEspacio = "CABANA" | "QUINCHO" | "PISCINA";

interface CalcularReservaInput {
  tipo: TipoEspacio;
  dias: number;
  personas: number;
  capacidadBase: number;
  capacidadExtra?: number;

  tarifaBaseSocio: number;
  tarifaBaseTercero?: number;

  extraSocio?: number;
  extraTercero?: number;

  usoReserva: "USO_PERSONAL" | "CARGA_DIRECTA" | "TERCEROS";
}

export function useCalcularReserva() {
  function calcular(input: CalcularReservaInput): number {
    const {
      tipo,
      dias,
      personas,
      capacidadBase,
      capacidadExtra,
      tarifaBaseSocio,
      tarifaBaseTercero,
      extraSocio,
      extraTercero,
      usoReserva
    } = input;

    const isTercero = usoReserva === "TERCEROS";
    const tarifa = isTercero
      ? tarifaBaseTercero ?? tarifaBaseSocio
      : tarifaBaseSocio;

    const extraValor = isTercero
      ? extraTercero ?? 0
      : extraSocio ?? 0;

    const maxCap = capacidadBase + (capacidadExtra ?? 0);
    if (personas > maxCap) return 0;

    // CABAÑAS — mínimo 3 días
    if (tipo === "CABANA") {
      if (dias < 3) return 0;
      const extras = Math.max(0, personas - capacidadBase);
      return tarifa * dias + extras * extraValor * dias;
    }

    // QUINCHO (ENAP) — por día + extras por día
    if (tipo === "QUINCHO") {
      const extras = Math.max(0, personas - capacidadBase);
      return tarifa * dias + extras * extraValor * dias;
    }

    // Piscina — por persona por día
    if (tipo === "PISCINA") {
      const base = capacidadBase;
      const extraMax = capacidadExtra ?? 0;

      if (personas > base + extraMax) return 0;

      if (personas <= base) return tarifa * dias;

      const extras = personas - base;
      return tarifa * dias + extras * extraValor * dias;
    }

    return tarifa * dias;
  }

  return { calcular };
}
