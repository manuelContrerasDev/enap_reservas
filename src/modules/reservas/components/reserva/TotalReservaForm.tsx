// ============================================================
// TotalReservaForm.tsx — ENAP Premium UI 2025
// ============================================================

import React from "react";
import { DollarSign } from "lucide-react";
import { clp } from "@/lib/format";

interface Props {
  dias: number;
  valorEspacio: number;
  pagoPersonas: number;
  pagoPiscina: number;
  total: number;
}

const plural = (n: number) => (n === 1 ? "día" : "días");

export const TotalReserva: React.FC<Props> = ({
  dias,
  valorEspacio,
  pagoPersonas,
  pagoPiscina,
  total,
}) => {
  return (
    <section className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm space-y-4">
      {/* TITLE */}
      <h3 className="text-lg font-bold flex items-center gap-2 text-enap-azul">
        <DollarSign size={22} className="text-enap-dorado" />
        Total estimado de la reserva
      </h3>

      {/* BREAKDOWN LIST */}
      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 text-sm text-gray-700">
        {/* VALOR ESPACIO */}
        <div className="flex justify-between sm:block">
          <dt className="font-semibold">Espacio</dt>
          <dd>
            {clp(valorEspacio)} × {dias} {plural(dias)}
          </dd>
        </div>

        {/* PAGO PERSONAS */}
        <div className="flex justify-between sm:block">
          <dt className="font-semibold">Personas</dt>
          <dd>{clp(pagoPersonas)}</dd>
        </div>

        {/* PISCINA */}
        <div className="flex justify-between sm:block">
          <dt className="font-semibold">Piscina</dt>
          <dd>{clp(pagoPiscina)}</dd>
        </div>
      </dl>

      <div className="border-t pt-3">
        {/* TOTAL */}
        <output
          aria-live="polite"
          className="
            block text-3xl font-extrabold text-enap-dorado
            drop-shadow-sm tracking-tight animate-fadeIn
          "
        >
          {clp(total)}
        </output>

        <p className="text-xs text-gray-500 mt-1">
          Este total puede variar según disponibilidad, cambios de fechas o
          recalculo final del sistema.
        </p>
      </div>
    </section>
  );
};

export default TotalReserva;
