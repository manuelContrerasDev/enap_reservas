// src/types/enums.ts
// ============================================================
// Enums oficiales Frontend — ENAP
// CONTRATO DE NEGOCIO (NO MODIFICAR SIN AUDITORÍA)
// ============================================================

/* ============================================================
 * ROLES
 * ============================================================ */
export enum Role {
  ADMIN = "ADMIN",
  SOCIO = "SOCIO",
  EXTERNO = "EXTERNO",
}

/* ============================================================
 * ESTADOS DE RESERVA
 *
 * 🔹 Flujo oficial:
 *   PENDIENTE_PAGO
 *      ├─(Admin valida pago)──▶ CONFIRMADA
 *      ├─(Admin rechaza)──────▶ RECHAZADA
 *      ├─(Socio cancela)──────▶ CANCELADA
 *      └─(Sistema expira)─────▶ CADUCADA
 *
 * 🔹 FINALIZADA:
 *   Estado terminal automático (post-fecha)
 *
 * 🔒 Reglas:
 * - El SOCIO solo puede:
 *   • cancelar cuando está en PENDIENTE_PAGO
 *
 * - El ADMIN puede:
 *   • confirmar
 *   • rechazar
 *   • cancelar
 *
 * - TESORERÍA:
 *   • NO cambia estados (solo visualización)
 * ============================================================ */
export enum ReservaEstado {
  PENDIENTE_PAGO = "PENDIENTE_PAGO", // estado inicial SIEMPRE
  CONFIRMADA = "CONFIRMADA",         // admin validó pago
  CANCELADA = "CANCELADA",           // socio o admin
  RECHAZADA = "RECHAZADA",           // admin
  CADUCADA = "CADUCADA",             // sistema (timeout)
  FINALIZADA = "FINALIZADA",          // sistema (post-fecha)
}

/* ============================================================
 * ESPACIOS
 * ============================================================ */
export enum TipoEspacio {
  CABANA = "CABANA",
  QUINCHO = "QUINCHO",
  PISCINA = "PISCINA",
}

/* ============================================================
 * MODALIDAD DE COBRO
 * ============================================================ */
export enum ModalidadCobro {
  POR_DIA = "POR_DIA",
  POR_NOCHE = "POR_NOCHE",
  POR_PERSONA = "POR_PERSONA",
}

/* ============================================================
 * USO DE RESERVA
 * ============================================================ */
export enum UsoReserva {
  USO_PERSONAL = "USO_PERSONAL",
  CARGA_DIRECTA = "CARGA_DIRECTA",
  TERCEROS = "TERCEROS",
}
