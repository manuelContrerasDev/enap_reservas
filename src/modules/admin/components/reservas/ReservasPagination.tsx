// src/components/admin/reservas/ReservasPagination.tsx

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ReservasPagination = ({
  reservas,
  rowsPerPage,
  setRowsPerPage,
  startIndex,
  endIndex,
  currentPage,
  totalPages,
  setCurrentPage,
}: any) => {
  const realEnd = Math.min(endIndex, reservas.length);

  return (
    <div className="border-t bg-gray-50 px-6 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

      {/* Left side */}
      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span>
          Mostrando{" "}
          {reservas.length === 0 ? 0 : startIndex + 1}–{realEnd} de{" "}
          {reservas.length}
        </span>

        <div className="flex items-center gap-2">
          <span>Filas por página:</span>

          <select
            className="rounded border px-2 py-1 text-xs"
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            {[10, 15, 20, 50].map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right side: navigation */}
      <div className="flex items-center gap-3 justify-end">
        <button
          onClick={() => setCurrentPage((p: number) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-1 rounded px-3 py-1 text-sm 
            text-[#002E3E] disabled:text-gray-400 hover:bg-gray-100"
        >
          <ChevronLeft size={16} />
          Anterior
        </button>

        <span className="px-2 text-sm">
          Página {totalPages === 0 ? 0 : currentPage} de {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((p: number) => Math.min(totalPages, p + 1))
          }
          disabled={currentPage === totalPages || totalPages === 0}
          className="inline-flex items-center gap-1 rounded px-3 py-1 text-sm 
            text-[#002E3E] disabled:text-gray-400 hover:bg-gray-100"
        >
          Siguiente
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default ReservasPagination;
