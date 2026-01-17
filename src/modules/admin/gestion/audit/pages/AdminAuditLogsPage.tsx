// src/modules/admin/audit/pages/AdminAuditLogsPage.tsx

import { useEffect, useState } from "react";

import { useAuditLogs } from "../hooks/useAuditLogs";
import { fetchAuditActions } from "../api/audit.api";

import AuditFilters from "../components/AuditFilters";
import AuditLogDetailModal from "../components/AuditLogDetailModal";

import type { AuditLogItem, AuditLogFilters } from "../types/audit";

export default function AdminAuditLogsPage() {
  const { data, load, hasMore, loading, reset } = useAuditLogs();

  const [acciones, setAcciones] = useState<string[]>([]);
  const [filtros, setFiltros] = useState<AuditLogFilters>({});
  const [selected, setSelected] = useState<AuditLogItem | null>(null);

  useEffect(() => {
    fetchAuditActions().then(setAcciones);
    load({}, true);
  }, []);

  const aplicarFiltros = () => {
    reset();
    load(filtros, true);
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Auditoría del sistema</h1>

      {/* Filtros */}
      <AuditFilters
        filtros={filtros}
        acciones={acciones}
        setFiltros={setFiltros}
      />

      <div className="flex justify-end">
        <button onClick={aplicarFiltros} className="btn-primary">
          Aplicar filtros
        </button>
      </div>

      {/* Tabla */}
      <div className="border rounded">
        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Acción</th>
              <th>Entidad</th>
              <th>Usuario</th>
            </tr>
          </thead>
          <tbody>
            {data.map((log) => (
              <tr
                key={log.id}
                className="cursor-pointer hover:bg-gray-100"
                onClick={() => setSelected(log)}
              >
                <td>
                  {new Date(log.createdAt).toLocaleString("es-CL")}
                </td>
                <td className="font-mono">{log.action}</td>
                <td>{log.entity}</td>
                <td>
                  {log.user
                    ? log.user.name ?? log.user.email
                    : "Sistema"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && data.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No hay logs para los filtros seleccionados
          </div>
        )}
      </div>

      {/* Load more */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => load(filtros)}
            disabled={loading}
            className="btn-secondary"
          >
            {loading ? "Cargando..." : "Cargar más"}
          </button>
        </div>
      )}

      {/* Modal detalle */}
      <AuditLogDetailModal
        open={!!selected}
        log={selected}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
