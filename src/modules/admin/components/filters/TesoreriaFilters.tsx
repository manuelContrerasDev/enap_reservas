// src/modules/admin/tesoreria/components/filters/TesoreriaFilters.tsx
import React from "react";
import Input from "@/shared/ui/base/Input";

export interface TesoreriaFiltros {
  desde?: string;
  hasta?: string;
}

interface Props {
  filtros: TesoreriaFiltros;
  setFiltros: React.Dispatch<React.SetStateAction<TesoreriaFiltros>>;
}

const TesoreriaFilters: React.FC<Props> = ({ filtros, setFiltros }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Desde</label>
        <Input
          type="date"
          value={filtros.desde ?? ""}
          onChange={(e) =>
            setFiltros((prev) => ({ ...prev, desde: e.target.value || undefined }))
          }
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Hasta</label>
        <Input
          type="date"
          value={filtros.hasta ?? ""}
          onChange={(e) =>
            setFiltros((prev) => ({ ...prev, hasta: e.target.value || undefined }))
          }
        />
      </div>
    </div>
  );
};

export default TesoreriaFilters;
