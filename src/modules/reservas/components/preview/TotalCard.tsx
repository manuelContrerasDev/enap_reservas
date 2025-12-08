// src/modules/reserva/preview/TotalCard.tsx
import React from "react";

const CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

interface Props {
  total: number;
}

export const TotalCard: React.FC<Props> = ({ total }) => {
  return (
    <section className="text-center border-t pt-6 space-y-2">
      <h3 className="text-xl font-bold text-[#002E3E]">Total a pagar:</h3>

      <p className="text-3xl font-extrabold text-[#DEC01F] tracking-tight">
        {CLP.format(total)}
      </p>

      <p className="text-xs text-gray-500">
        * Transacción segura con Webpay Transbank.
      </p>
    </section>
  );
};
