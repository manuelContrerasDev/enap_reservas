// ============================================================
// calcularTotalReservaFrontend.ts — VERSIÓN OFICIAL ENAP 2025
// Mantiene paridad 1:1 con el backend.
// ============================================================

export type TipoEspacioFrontend = "CABANA" | "QUINCHO" | "PISCINA";
export type ModalidadCobroFrontend = "POR_NOCHE" | "POR_DIA" | "POR_PERSONA";
export type UsoReservaFrontend = "USO_PERSONAL" | "CARGA_DIRECTA" | "TERCEROS";

interface Params {
  espacio: {
    tipo: TipoEspacioFrontend;
    modalidadCobro: ModalidadCobroFrontend;

    precioBaseSocio: number;
    precioBaseExterno: number;

    precioPersonaSocio: number;
    precioPersonaExterno: number;

    precioPiscinaSocio: number;
    precioPiscinaExterno: number;
  };

  dias: number;

  cantidadAdultos: number;
  cantidadNinos: number;
  cantidadPiscina: number;

  usoReserva: UsoReservaFrontend;
}

export function calcularTotalReservaFrontend({
  espacio,
  dias,
  cantidadAdultos,
  cantidadNinos,
  cantidadPiscina,
  usoReserva,
}: Params) {
  
  // ============================================================
  // 1. SOCIO o EXTERNO (mismo criterio que backend)
  // ============================================================
  const esSocio =
    usoReserva === "USO_PERSONAL" ||
    usoReserva === "CARGA_DIRECTA";

  const tBase   = esSocio ? espacio.precioBaseSocio     : espacio.precioBaseExterno;
  const tPersona = esSocio ? espacio.precioPersonaSocio : espacio.precioPersonaExterno;
  const tPiscina = esSocio ? espacio.precioPiscinaSocio : espacio.precioPiscinaExterno;

  // ============================================================
  // 2. BASE según modalidad de cobro
  // ============================================================
  let precioBaseSnapshot = 0;

  if (
    espacio.modalidadCobro === "POR_NOCHE" ||
    espacio.modalidadCobro === "POR_DIA"
  ) {
    precioBaseSnapshot = tBase * Math.max(dias, 1);
  }

  // POR_PERSONA → sin base
  if (espacio.modalidadCobro === "POR_PERSONA") {
    precioBaseSnapshot = 0;
  }

  // ============================================================
  // 3. TARIFA POR PERSONA (adultos + niños)
  // ============================================================
  const precioPersonaSnapshot =
    (cantidadAdultos + cantidadNinos) * tPersona;

  // ============================================================
  // 4. PISCINA (misma regla backend)
  // ============================================================
  let precioPiscinaSnapshot = 0;

  if (espacio.tipo === "PISCINA") {
    if (esSocio) {
      // primeras 5 personas gratis
      const excedentes = Math.max(cantidadPiscina - 5, 0);
      precioPiscinaSnapshot = excedentes * tPiscina;
    } else {
      // externo paga todo
      precioPiscinaSnapshot = cantidadPiscina * tPiscina;
    }
  }

  // ============================================================
  // 5. TOTAL FINAL
  // ============================================================
  const totalClp =
    precioBaseSnapshot +
    precioPersonaSnapshot +
    precioPiscinaSnapshot;

  return {
    totalClp,

    // Snapshots para frontend → deben coincidir exactamente con backend
    precioBaseSnapshot,
    precioPersonaSnapshot,
    precioPiscinaSnapshot,
  };
}
