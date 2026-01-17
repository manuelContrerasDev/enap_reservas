import React from "react";
import Modal from "@/shared/ui/base/Modal";
import Button from "@/shared/ui/base/Button";

interface Props {
  open: boolean;
  log: any | null;
  onClose: () => void;
}

function JsonBlock({ title, data }: { title: string; data?: any }) {
  if (!data) return null;

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <pre className="max-h-60 overflow-auto rounded bg-gray-900 p-3 text-xs text-green-200">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}

const AuditLogDetailModal: React.FC<Props> = ({ open, log, onClose }) => {
  if (!log) return null;

  return (
    <Modal open={open} onClose={onClose} title="Detalle de auditoría">
      <div className="space-y-5 text-sm">
        {/* CONTEXTO */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-500">Acción</p>
            <p className="font-semibold">{log.action}</p>
          </div>

          <div>
            <p className="text-gray-500">Entidad</p>
            <p className="font-semibold">
              {log.entity} · {log.entityId}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Usuario</p>
            <p className="font-semibold">
              {log.user?.name || log.user?.email || "Sistema"}
            </p>
          </div>

          <div>
            <p className="text-gray-500">Fecha</p>
            <p className="font-semibold">
              {new Date(log.createdAt).toLocaleString("es-CL")}
            </p>
          </div>
        </div>

        {/* JSON */}
        <JsonBlock title="Antes" data={log.before} />
        <JsonBlock title="Después" data={log.after} />
        <JsonBlock title="Detalles" data={log.details} />

        {/* FOOTER */}
        <div className="flex justify-end">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AuditLogDetailModal;
