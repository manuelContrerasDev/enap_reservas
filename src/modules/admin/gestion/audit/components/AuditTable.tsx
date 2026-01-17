import { useState } from "react";
import Card from "@/shared/ui/base/Card";
import AuditLogDetailModal from "./AuditLogDetailModal";
import type { AuditLogItem } from "../types/audit";

const DATE = new Intl.DateTimeFormat("es-CL", {
  dateStyle: "short",
  timeStyle: "short",
});

interface Props {
  rows: AuditLogItem[];
}

export default function AuditTable({ rows }: Props) {
  const [selected, setSelected] = useState<AuditLogItem | null>(null);

  return (
    <>
      <Card className="p-0 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-enap-primary text-white">
            <tr>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-left">Acción</th>
              <th className="px-4 py-3 text-left">Entidad</th>
              <th className="px-4 py-3 text-left">Usuario</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-gray-500">
                  No hay eventos registrados.
                </td>
              </tr>
            )}

            {rows.map((log) => (
              <tr
                key={log.id}
                onClick={() => setSelected(log)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 whitespace-nowrap">
                  {DATE.format(new Date(log.createdAt))}
                </td>

                <td className="px-4 py-3 font-mono text-xs">
                  {log.action}
                </td>

                <td className="px-4 py-3">
                  {log.entity} · {log.entityId.slice(0, 8)}…
                </td>

                <td className="px-4 py-3 text-xs">
                  {log.user?.name ?? log.user?.email ?? "SYSTEM"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <AuditLogDetailModal
        open={!!selected}
        log={selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
}
