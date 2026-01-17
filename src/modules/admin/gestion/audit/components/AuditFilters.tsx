// src/modules/admin/audit/components/AuditFilters.tsx

import Input from "@/shared/ui/base/Input";
import type { AuditLogFilters } from "../types/audit";

interface Props {
  filtros: AuditLogFilters;
  acciones: string[];
  setFiltros: React.Dispatch<React.SetStateAction<AuditLogFilters>>;
}

export default function AuditFilters({
  filtros,
  acciones,
  setFiltros,
}: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div>
        <label className="text-sm font-medium">Acción</label>
        <select
          className="w-full rounded border px-2 py-1 text-sm"
          value={filtros.action ?? ""}
          onChange={(e) =>
            setFiltros((prev) => ({
              ...prev,
              action: e.target.value || undefined,
            }))
          }
        >
          <option value="">Todas</option>
          {acciones.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Entidad</label>
        <Input
          placeholder="RESERVA"
          value={filtros.entity ?? ""}
          onChange={(e) =>
            setFiltros((prev) => ({
              ...prev,
              entity: e.target.value || undefined,
            }))
          }
        />
      </div>

      <div>
        <label className="text-sm font-medium">Desde</label>
        <Input
          type="date"
          value={filtros.desde ?? ""}
          onChange={(e) =>
            setFiltros((prev) => ({
              ...prev,
              desde: e.target.value || undefined,
            }))
          }
        />
      </div>

      <div>
        <label className="text-sm font-medium">Hasta</label>
        <Input
          type="date"
          value={filtros.hasta ?? ""}
          onChange={(e) =>
            setFiltros((prev) => ({
              ...prev,
              hasta: e.target.value || undefined,
            }))
          }
        />
      </div>
    </div>
  );
}
