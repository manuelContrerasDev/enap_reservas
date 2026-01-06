import type { ReservaFrontend } from "@/types/ReservaFrontend";
import { ReservaEstado } from "@/types/enums";

/**
 * Permisos de acciones del SOCIO sobre su reserva
 * Flujo ENAP 2025 (SIN pagos online)
 */
export const reservaPermisos = {
  /**
   * Editar invitados (antes de pagar)
   */
  puedeEditarInvitados: (r: ReservaFrontend) =>
    r.estado === ReservaEstado.PENDIENTE_PAGO,

  /**
   * Ver instrucciones de pago / transferencia
   * (antes: Webpay, ahora: datos bancarios)
   */
  puedeVerTransferencia: (r: ReservaFrontend) =>
    r.estado === ReservaEstado.PENDIENTE_PAGO,

  /**
   * Cancelar reserva propia
   */
  puedeCancelar: (r: ReservaFrontend) =>
    r.estado === ReservaEstado.PENDIENTE_PAGO,

  /**
   * Solo lectura (preview)
   */
  esSoloLectura: (r: ReservaFrontend) =>
    r.estado !== ReservaEstado.PENDIENTE_PAGO,
};
