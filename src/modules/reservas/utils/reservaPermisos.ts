// src/modules/reservas/utils/reservaPermisos.ts
import type { ReservaFrontend } from "@/modules/reservas/types/ReservaFrontend";
import { ReservaEstado } from "@/shared/types/enums";

/**
 * Permisos de acciones del SOCIO sobre su reserva
 * Flujo ENAP 2026 (pagos online congelados → transferencia manual)
 *
 * Nota:
 * - Frontend controla UX (botones/acciones).
 * - Backend es autoridad final (seguridad real).
 */
export const reservaPermisos = {
  /** Ver detalle / preview (siempre permitido) */
  puedeVerDetalle: (_r: ReservaFrontend) => true,

  /** Editar invitados (solo antes de validación/pago manual) */
  puedeEditarInvitados: (r: ReservaFrontend) =>
    r.estado === ReservaEstado.PENDIENTE_PAGO,

  /** Ver instrucciones de transferencia (Step 3) */
  puedeVerTransferencia: (r: ReservaFrontend) =>
    r.estado === ReservaEstado.PENDIENTE_PAGO,

  /** Cancelar reserva (la regla de 24h la valida backend; aquí UX base por estado) */
  puedeCancelar: (r: ReservaFrontend) =>
    r.estado === ReservaEstado.PENDIENTE_PAGO,

  /** Solo lectura */
  esSoloLectura: (r: ReservaFrontend) => r.estado !== ReservaEstado.PENDIENTE_PAGO,
};
