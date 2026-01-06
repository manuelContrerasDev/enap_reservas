// src/modules/espacios/components/EspaciosFilters.tsx
import React from "react";
import { motion } from "framer-motion";
import { Filter } from "lucide-react";

import type { TipoFiltro } from "@/types/espacios";

interface Props {
  search: string;
  setSearch: (value: string) => void;

  tipo: TipoFiltro;
  setTipo: (value: TipoFiltro) => void;

  resetFiltros: () => void;
}

function EspaciosFilters({
  search,
  setSearch,
  tipo,
  setTipo,
  resetFiltros,
}: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="
        bg-white rounded-xl shadow-md border border-gray-200 p-4
        flex flex-col md:flex-row items-center gap-4 md:gap-6
      "
    >
      {/* BUSCADOR */}
      <div className="flex flex-col w-full md:w-1/2">
        <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
          Buscar espacio
        </span>

        <div
          className="
            flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg
            border border-gray-200 shadow-sm
            focus-within:border-[#005D73]
            focus-within:ring-1 focus-within:ring-[#005D73]
            transition-all
          "
        >
          <input
            aria-label="Buscar espacios"
            type="text"
            placeholder="Ej: Cabaña, Quincho, Piscina…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm outline-none flex-1 placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* SELECT TIPO */}
      <div className="flex flex-col w-full md:w-1/3">
        <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wide">
          Tipo de espacio
        </span>

        <div
          className="
            flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg
            border border-gray-200 shadow-sm
            focus-within:border-[#005D73]
            focus-within:ring-1 focus-within:ring-[#005D73]
            transition-all
          "
        >
          <Filter size={16} className="text-gray-500" />
          <select
            aria-label="Filtrar por tipo de espacio"
            value={tipo}
            onChange={(e) => setTipo(e.target.value as TipoFiltro)}
            className="bg-transparent text-sm outline-none flex-1 cursor-pointer text-gray-700"
          >
            <option value="TODOS">Todos</option>
            <option value="CABANA">Cabañas</option>
            <option value="QUINCHO">Quinchos</option>
            <option value="PISCINA">Piscinas</option>
          </select>
        </div>
      </div>

      {/* RESET */}
      {(search || tipo !== "TODOS") && (
        <button
          onClick={resetFiltros}
          className="
            text-xs text-[#005D73] underline underline-offset-2
            hover:text-[#0088CC]
            transition-all mt-1
          "
        >
          Restablecer filtros
        </button>
      )}
    </motion.section>
  );
}

export default React.memo(EspaciosFilters);
