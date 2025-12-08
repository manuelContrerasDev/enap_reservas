// src/modules/espacios/components/EspaciosGrid.tsx
import React, { Suspense } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { AlertCircle } from "lucide-react";

import type { Espacio } from "@/context/EspaciosContext";

const EspacioCardSocio = React.lazy(() =>
  import("@/modules/espacios/components/EspacioCardSocio")
);

interface Props {
  espacios: Espacio[];
  fechaFiltro: string | null;
  estaOcupadoEnFecha: (id: string, fechaISO: string) => boolean;
}

export default function EspaciosGrid({
  espacios,
  fechaFiltro,
  estaOcupadoEnFecha,
}: Props) {
  const prefersReducedMotion = useReducedMotion();

  /* ============================================================
   * SIN RESULTADOS
   * ============================================================ */
  if (!espacios.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3 text-center">
        <AlertCircle size={48} className="text-[#DCAB12]" />
        <p className="text-base text-gray-800 font-semibold">
          No se encontraron espacios con los filtros actuales.
        </p>

        {fechaFiltro && (
          <p className="text-sm text-gray-500 max-w-md">
            No hay espacios disponibles para la fecha seleccionada.
          </p>
        )}
      </div>
    );
  }

  /* ============================================================
   * GRID
   * ============================================================ */
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-10">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-56 bg-gray-200 rounded-2xl animate-pulse"
            />
          ))}
        </div>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {espacios.map((e, index) => {
          const ocupado =
            fechaFiltro && fechaFiltro !== ""
              ? estaOcupadoEnFecha(e.id, fechaFiltro)
              : false;

          return (
            <motion.div
              key={e.id}
              initial={!prefersReducedMotion ? { opacity: 0, y: 16 } : undefined}
              animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
              transition={{
                duration: 0.25,
                delay: prefersReducedMotion ? 0 : index * 0.03,
              }}
              viewport={{ once: true }}
            >
              <EspacioCardSocio
                espacio={e}
                fechaFiltro={fechaFiltro}
                ocupadoEnFecha={ocupado}
              />
            </motion.div>
          );
        })}
      </div>
    </Suspense>
  );
}
