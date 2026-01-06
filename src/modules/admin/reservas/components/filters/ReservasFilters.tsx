import React, { useCallback, useMemo } from "react";
import { ReservaEstado } from "@/types/enums";
import type { EspacioDTO } from "@/types/espacios";

// UI BASE
import EnapPanel from "@/components/ui/base/Panel";
import FormField from "@/components/ui/base/FormField";
import FormFieldSelect from "@/components/ui/base/FormFieldSelect";
import EnapButton from "@/components/ui/base/Button";

/* ============================================================
 * Tipos
 * ============================================================ */
export interface FiltrosType {
  estado?: ReservaEstado | "TODOS";
  espacioId?: string;
  socioQuery?: string; // ✅ texto libre (nombre/email/rut)
  fechaInicio?: string; // yyyy-mm-dd
  fechaFin?: string;    // yyyy-mm-dd
}

interface Props {
  filtros: FiltrosType;
  setFiltros: React.Dispatch<React.SetStateAction<FiltrosType>>;
  espacios: EspacioDTO[] | null;
}

/* ============================================================
 * Opciones estado (SYNC con enums reales)
 * ============================================================ */
const ESTADOS: Array<ReservaEstado | "TODOS"> = [
  "TODOS",
  ReservaEstado.PENDIENTE_PAGO,
  ReservaEstado.CONFIRMADA,
  ReservaEstado.CANCELADA,
  ReservaEstado.RECHAZADA,
  ReservaEstado.CADUCADA,
  ReservaEstado.FINALIZADA,
];

const ESTADO_LABEL: Record<ReservaEstado, string> = {
  PENDIENTE_PAGO: "Pendiente de pago",
  CONFIRMADA: "Confirmada",
  CANCELADA: "Cancelada",
  RECHAZADA: "Rechazada",
  CADUCADA: "Caducada",
  FINALIZADA: "Finalizada",
};

function isValidDateRange(desde?: string, hasta?: string) {
  if (!desde || !hasta) return true;
  // yyyy-mm-dd compare lexical works
  return desde <= hasta;
}

const ReservasFilters: React.FC<Props> = ({ filtros, setFiltros, espacios }) => {
  const hasFilters = useMemo(() => {
    return (
      (filtros.estado && filtros.estado !== "TODOS") ||
      !!filtros.espacioId ||
      !!filtros.socioQuery ||
      !!filtros.fechaInicio ||
      !!filtros.fechaFin
    );
  }, [filtros]);

  const dateRangeOk = useMemo(
    () => isValidDateRange(filtros.fechaInicio, filtros.fechaFin),
    [filtros.fechaInicio, filtros.fechaFin]
  );

  const clearFilters = useCallback(() => {
    setFiltros({
      estado: "TODOS",
      espacioId: undefined,
      socioQuery: undefined,
      fechaInicio: undefined,
      fechaFin: undefined,
    });
  }, [setFiltros]);

  const setField = useCallback(
    <K extends keyof FiltrosType>(key: K, value: FiltrosType[K]) => {
      setFiltros((prev) => ({ ...prev, [key]: value }));
    },
    [setFiltros]
  );

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
              onChange: (e) => {
                const v = e.target.value as ReservaEstado | "TODOS";
                setField("estado", v);
              },
            }}
          >
            {ESTADOS.map((estado) => (
              <option key={estado} value={estado}>
                {estado === "TODOS"
                  ? "Todos"
                  : ESTADO_LABEL[estado as ReservaEstado] ?? estado}
              </option>
            ))}
          </FormFieldSelect>

          <FormFieldSelect
            label="Espacio"
            selectProps={{
              name: "espacioId",
              value: filtros.espacioId ?? "",
              onChange: (e) => {
                const v = e.target.value.trim();
                setField("espacioId", v ? v : undefined);
              },
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
            label="Socio (nombre / email / RUT)"
            inputProps={{
              name: "socioQuery",
              placeholder: "Juan / juan@enap.cl / 12.345.678-9",
              value: filtros.socioQuery ?? "",
              onChange: (e) => {
                const v = e.target.value;
                setField("socioQuery", v.trim() ? v : undefined);
              },
            }}
          />

          <FormField
            label="Desde"
            inputProps={{
              type: "date",
              name: "fechaInicio",
              value: filtros.fechaInicio ?? "",
              onChange: (e) => {
                const v = e.target.value;
                setField("fechaInicio", v ? v : undefined);
              },
            }}
          />

          <div className="space-y-1">
            <FormField
              label="Hasta"
              inputProps={{
                type: "date",
                name: "fechaFin",
                value: filtros.fechaFin ?? "",
                onChange: (e) => {
                  const v = e.target.value;
                  setField("fechaFin", v ? v : undefined);
                },
                min: filtros.fechaInicio || undefined, // ✅ evita seleccionar antes del "Desde"
              }}
            />

            {!dateRangeOk && (
              <p className="text-xs text-red-600">
                El rango de fechas no es válido (Desde no puede ser mayor que Hasta).
              </p>
            )}
          </div>
        </div>
      </EnapPanel>
    </section>
  );
};

export default ReservasFilters;
