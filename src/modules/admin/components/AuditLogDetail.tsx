import type { AuditLogItem } from "@/modules/admin/gestion/types/audit";

interface Props {
  log: AuditLogItem;
  onClose: () => void;
}

export function AuditLogDetail({ log, onClose }: Props) {
  return (
    <div className="border rounded p-4 space-y-3 bg-white">
      <div className="flex justify-between items-center">
        <h2 className="font-semibold text-lg">Detalle de auditoría</h2>
        <button onClick={onClose} className="text-sm text-gray-500">
          Cerrar
        </button>
      </div>

      <div className="text-sm space-y-1">
        <div>
          <strong>Fecha:</strong>{" "}
          {new Date(log.createdAt).toLocaleString()}
        </div>

        <div>
          <strong>Acción:</strong>{" "}
          <span className="font-mono">{log.action}</span>
        </div>

        <div>
          <strong>Entidad:</strong> {log.entity} — {log.entityId}
        </div>

        <div>
          <strong>Usuario:</strong>{" "}
          {log.user ? log.user.name ?? log.user.email : "SYSTEM"}
        </div>
      </div>

    </div>
  );
}
