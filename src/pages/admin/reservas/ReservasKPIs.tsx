// src/pages/admin/reservas/ReservasKPIs.tsx

import React from "react";

interface KPIsType {
  total: number;
  confirmadas: number;
  pendientes: number;
  canceladas: number;
  rechazadas: number;
}

interface Props {
  kpis: KPIsType;
  prefersReducedMotion: boolean;
}

const ReservasKPIs: React.FC<Props> = ({ kpis, prefersReducedMotion }) => {
  const cards = [
    {
      label: "Total Reservas",
      value: kpis.total ?? 0,
      color: "text-[#002E3E]",
    },
    {
      label: "Confirmadas",
      value: kpis.confirmadas ?? 0,
      color: "text-green-600",
    },
    {
      label: "Pendientes",
      value: kpis.pendientes ?? 0,
      color: "text-yellow-600",
    },
    {
      label: "Canceladas / Rechazadas",
      value: (kpis.canceladas ?? 0) + (kpis.rechazadas ?? 0),
      color: "text-red-600",
    },
  ];

  return (
    <section
      className="mb-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4"
      style={{ opacity: prefersReducedMotion ? 1 : undefined }}
    >
      {cards.map(({ label, value, color }) => (
        <div
          key={label}
          className="flex items-center justify-between rounded-lg border-l-4 border-[#DEC01F] bg-white p-5 shadow"
        >
          <div>
            <p className="text-sm text-gray-600">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default ReservasKPIs;
