export type AuditAction =
  | "SUBIR_COMPROBANTE"
  | "APROBAR_PAGO"
  | "RECHAZAR_PAGO"
  | "CANCELAR_RESERVA_ADMIN"
  | "RESERVA_CADUCADA_AUTOMATICA"
  | "CREAR_MOVIMIENTO_TESORERIA";

export interface AuditLogItem {
  id: string;
  action: AuditAction;
  entity: string;
  entityId: string;
  createdAt: string;

  user?: {
    id: string;
    name: string | null;
    email: string;
  } | null;

  details?: Record<string, unknown>;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
}

export interface AuditLogsResponse {
  ok: boolean;
  data: AuditLogItem[];
  nextCursor: string | null;
}

/**
 * 🔍 Filtros de auditoría (frontend)
 * ⚠️ NO confundir con componente AuditFilters
 */
export interface AuditLogFilters {
  action?: string;
  entity?: string;
  entityId?: string;
  desde?: string;
  hasta?: string;
}
