// src/pages/admin/reservas/ReservasFilters.tsx

import React from "react";
import type { ReservaEstado } from "@/types/enums";
import type { Espacio } from "@/context/EspaciosContext";

interface FiltrosType {
  estado?: ReservaEstado | "TODOS";
  espacioId?: string;
  socioId?: string;
  fechaInicio?: string;
  fechaFin?: string;
}

interface Props {
  filtros: FiltrosType;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosType>>;
  espacios: Espacio[] | null;
}

const ReservasFilters: React.FC<Props> = ({ filtros, setFiltros, espacios }) => {
  
  const hasFilters =
    (filtros.estado && filtros.estado !== "TODOS") ||
    filtros.espacioId ||
    filtros.socioId ||
    filtros.fechaInicio ||
    filtros.fechaFin;

  const clear = () =>
    setFiltros({
      estado: "TODOS",
      espacioId: undefined,
      socioId: undefined,
      fechaInicio: undefined,
      fechaFin: undefined,
    });

  return (
    <section className="mb-6 rounded-xl border bg-white shadow p-6">

      {/* Header */}
      <div className="flex justify-between mb-4 text-sm text-gray-600">
        <span>
          Filtros aplicados:{" "}
          <strong className={hasFilters ? "text-green-700" : "text-gray-600"}>
            {hasFilters ? "Sí" : "No"}
          </strong>
        </span>
        {hasFilters && (
          <button
            onClick={clear}
            className="text-xs px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 items-end">

        {/* ESTADO */}
        <div>
          <label className="block text-xs font-semibold mb-1">Estado</label>
          <select
            className="border px-3 py-2 rounded text-sm"
            value={filtros.estado ?? "TODOS"}
            onChange={(e) =>
              setFiltros((f) => ({
                ...f,
                estado: e.target.value as ReservaEstado | "TODOS",
              }))
            }
          >
            <option value="TODOS">Todos</option>
            <option value="PENDIENTE">Pendientes</option>
            <option value="CONFIRMADA">Confirmadas</option>
            <option value="CANCELADA">Canceladas</option>
            <option value="RECHAZADA">Rechazadas</option>
          </select>
        </div>

        {/* ESPACIO */}
        <div>
          <label className="block text-xs font-semibold mb-1">Espacio</label>
          <select
            className="border px-3 py-2 rounded text-sm"
            value={filtros.espacioId ?? ""}
            onChange={(e) =>
              setFiltros((f) => ({
                ...f,
                espacioId: e.target.value || undefined,
              }))
            }
          >
            <option value="">Todos</option>
            {espacios?.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* SOCIO */}
        <div>
          <label className="block text-xs font-semibold mb-1">
            Buscar por nombre o email
          </label>
          <input
            className="border px-3 py-2 rounded text-sm"
            placeholder="ej: Juan / juan@mail.com"
            value={filtros.socioId ?? ""}
            onChange={(e) =>
              setFiltros((f) => ({
                ...f,
                socioId: e.target.value || undefined,
              }))
            }
          />
        </div>

        {/* FECHAS */}
        <div>
          <label className="block text-xs font-semibold mb-1">Desde</label>
          <input
            type="date"
            className="border px-3 py-2 rounded text-sm"
            value={filtros.fechaInicio ?? ""}
            onChange={(e) =>
              setFiltros((f) => ({
                ...f,
                fechaInicio: e.target.value || undefined,
              }))
            }
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1">Hasta</label>
          <input
            type="date"
            className="border px-3 py-2 rounded text-sm"
            value={filtros.fechaFin ?? ""}
            onChange={(e) =>
              setFiltros((f) => ({
                ...f,
                fechaFin: e.target.value || undefined,
              }))
            }
          />
        </div>

      </div>
    </section>
  );
};

export default ReservasFilters;
