// src/components/admin/reservas/ReservasPagination.tsx

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

// UI BASE
import EnapPanel from "@/components/ui/base/Panel";
import EnapSelect from "@/components/ui/base/Select";
import EnapButton from "@/components/ui/base/Button";

interface Props {
  reservas: unknown[];
  rowsPerPage: number;
  setRowsPerPage: (value: number) => void;
  startIndex: number;
  endIndex: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (updater: (p: number) => number) => void;
}

const ROWS_OPTIONS = [10, 15, 20, 50];

const ReservasPagination: React.FC<Props> = ({
  reservas,
  rowsPerPage,
  setRowsPerPage,
  startIndex,
  endIndex,
  currentPage,
  totalPages,
  setCurrentPage,
}) => {
  const realEnd = Math.min(endIndex, reservas.length);

  return (
    <section aria-label="Paginación de reservas">
      <EnapPanel className="mt-6 py-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          {/* INFO */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 text-sm text-gray-600">
            <span>
              Mostrando{" "}
              <strong>
                {reservas.length === 0 ? 0 : startIndex + 1}–{realEnd}
              </strong>{" "}
              de <strong>{reservas.length}</strong>
            </span>

            {/* FILAS POR PÁGINA */}
            <div className="flex items-center gap-2">
              <label
                htmlFor="rowsPerPage"
                className="text-sm font-medium text-gray-700"
              >
                Filas por página
              </label>

              <EnapSelect
                id="rowsPerPage"
                name="rowsPerPage"
                value={rowsPerPage}
                onChange={(e) =>
                  setRowsPerPage(Number(e.target.value))
                }
                className="min-w-[72px]"
              >
                {ROWS_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </EnapSelect>
            </div>
          </div>

          {/* NAV */}
          <div className="flex items-center gap-2 justify-end">
            <EnapButton
              variant="ghost"
              size="sm"
              onClick={() =>
                setCurrentPage((p) => Math.max(1, p - 1))
              }
              disabled={currentPage === 1}
              aria-label="Página anterior"
            >
              <ChevronLeft size={16} />
              Anterior
            </EnapButton>

            <span className="px-2 text-sm text-gray-700">
              Página{" "}
              <strong>
                {totalPages === 0 ? 0 : currentPage}
              </strong>{" "}
              de <strong>{totalPages}</strong>
            </span>

            <EnapButton
              variant="ghost"
              size="sm"
              onClick={() =>
                setCurrentPage((p) =>
                  Math.min(totalPages, p + 1)
                )
              }
              disabled={currentPage === totalPages || totalPages === 0}
              aria-label="Página siguiente"
            >
              Siguiente
              <ChevronRight size={16} />
            </EnapButton>
          </div>
        </div>
      </EnapPanel>
    </section>
  );
};

export default ReservasPagination;
