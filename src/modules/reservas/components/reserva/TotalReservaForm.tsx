// ============================================================
// TotalReservaForm.tsx — UX/UI Premium ENAP (FINAL SYNC)
// ============================================================

import React from "react";
import { DollarSign, Users, Waves, Home } from "lucide-react";
import { clp } from "@/shared/lib/format2";

interface Props {
  dias: number;
  valorEspacio: number; // tarifaBase * dias (o 0 si POR_PERSONA)
  pagoPersonas: number;
  pagoPiscina: number;
  total: number;
}

export const TotalReserva: React.FC<Props> = ({
  dias,
  valorEspacio,
  pagoPersonas,
  pagoPiscina,
  total,
}) => {
  const plural = dias === 1 ? "día" : "días";

  return (
    <section className="p-5 bg-white rounded-xl border border-gray-200 shadow-sm space-y-5">
      {/* TÍTULO */}
      <h3 className="text-lg font-bold flex items-center gap-2 text-enap-azul">
        <DollarSign size={22} className="text-enap-dorado" />
        Total estimado de la reserva
      </h3>

      {/* DESGLOSE */}
      <dl className="space-y-3 text-sm text-gray-700">
        {/* ESPACIO (solo si aplica) */}
        {valorEspacio > 0 && (
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2 font-semibold">
              <Home size={16} className="text-enap-azul" />
              Espacio
            </dt>
            <dd className="text-right">
              <span className="block">{clp(valorEspacio)}</span>
              <span className="text-xs text-gray-500">
                ({dias} {plural})
              </span>
            </dd>
          </div>
        )}

        {/* PERSONAS */}
        <div className="flex items-center justify-between">
          <dt className="flex items-center gap-2 font-semibold">
            <Users size={16} className="text-enap-azul" />
            Personas
          </dt>
          <dd>{clp(pagoPersonas)}</dd>
        </div>

        {/* PISCINA (solo si hay cobro real) */}
        {pagoPiscina > 0 && (
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2 font-semibold">
              <Waves size={16} className="text-enap-azul" />
              Piscina
            </dt>
            <dd>{clp(pagoPiscina)}</dd>
          </div>
        )}
      </dl>

      {/* TOTAL */}
      <div className="border-t pt-4">
        <output
          aria-live="polite"
          className="block text-3xl font-extrabold text-enap-dorado tracking-tight"
        >
          {clp(total)}
        </output>

        <p className="text-xs text-gray-500 mt-1">
          El total puede variar según fechas, recálculo o disponibilidad.
        </p>
      </div>
    </section>
  );
};

export default TotalReserva;
