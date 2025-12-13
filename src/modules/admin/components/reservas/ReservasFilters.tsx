// src/components/admin/reservas/ReservasFilters.tsx

import React, { useCallback, useMemo } from "react";
import type { ReservaEstado } from "@/types/enums";
import type { Espacio } from "@/context/EspaciosContext";

// UI BASE
import EnapPanel from "@/components/ui/base/Panel";
import FormField from "@/components/ui/base/FormField";
import FormFieldSelect from "@/components/ui/base/FormFieldSelect";
import EnapButton from "@/components/ui/base/Button";

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

const ESTADOS: (ReservaEstado | "TODOS")[] = [
  "TODOS",
  "PENDIENTE",
  "CONFIRMADA",
  "CANCELADA",
  "RECHAZADA",
];

const ReservasFilters: React.FC<Props> = ({
  filtros,
  setFiltros,
  espacios,
}) => {
  const hasFilters = useMemo(
    () =>
      (filtros.estado && filtros.estado !== "TODOS") ||
      filtros.espacioId ||
      filtros.socioId ||
      filtros.fechaInicio ||
      filtros.fechaFin,
    [filtros]
  );

  const clearFilters = useCallback(() => {
    setFiltros({
      estado: "TODOS",
      espacioId: undefined,
      socioId: undefined,
      fechaInicio: undefined,
      fechaFin: undefined,
    });
  }, [setFiltros]);

  return (
    <section aria-label="Filtros de reservas">
      <EnapPanel title="Filtros" className="mb-8">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 text-sm">
          <span className="text-gray-600">
            Filtros aplicados:{" "}
            <strong className={hasFilters ? "text-success" : "text-gray-500"}>
              {hasFilters ? "Sí" : "No"}
            </strong>
          </span>

          {hasFilters && (
            <EnapButton variant="ghost" size="sm" onClick={clearFilters}>
              Limpiar filtros
            </EnapButton>
          )}
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <FormFieldSelect
            label="Estado"
            selectProps={{
              name: "estado",
              value: filtros.estado ?? "TODOS",
              onChange: (e) =>
                setFiltros((f) => ({
                  ...f,
                  estado: e.target.value as ReservaEstado | "TODOS",
                })),
            }}
          >
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado === "TODOS" ? "Todos" : estado}
              </option>
            ))}
          </FormFieldSelect>

          <FormFieldSelect
            label="Espacio"
            selectProps={{
              name: "espacioId",
              value: filtros.espacioId ?? "",
              onChange: (e) =>
                setFiltros((f) => ({
                  ...f,
                  espacioId: e.target.value || undefined,
                })),
            }}
          >
            <option value="">Todos</option>
            {espacios?.map((esp) => (
              <option key={esp.id} value={esp.id}>
                {esp.nombre}
              </option>
            ))}
          </FormFieldSelect>

          <FormField
            label="Socio (nombre o email)"
            inputProps={{
              name: "socio",
              placeholder: "Juan / juan@mail.com",
              value: filtros.socioId ?? "",
              onChange: (e) =>
                setFiltros((f) => ({
                  ...f,
                  socioId: e.target.value || undefined,
                })),
            }}
          />

          <FormField
            label="Desde"
            inputProps={{
              type: "date",
              name: "fechaInicio",
              value: filtros.fechaInicio ?? "",
              onChange: (e) =>
                setFiltros((f) => ({
                  ...f,
                  fechaInicio: e.target.value || undefined,
                })),
            }}
          />

          <FormField
            label="Hasta"
            inputProps={{
              type: "date",
              name: "fechaFin",
              value: filtros.fechaFin ?? "",
              onChange: (e) =>
                setFiltros((f) => ({
                  ...f,
                  fechaFin: e.target.value || undefined,
                })),
            }}
          />
        </div>
      </EnapPanel>
    </section>
  );
};

export default ReservasFilters;
