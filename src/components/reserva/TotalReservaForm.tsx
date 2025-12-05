// src/components/reserva/TotalReservaForm.tsx
import React from "react";
import { DollarSign } from "lucide-react";
import { clp } from "@/lib/format";

interface Props {
  total: number;
}

export const TotalReserva: React.FC<Props> = ({ total }) => {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
      <span className="text-lg font-bold flex items-center gap-2 text-[#002E3E]">
        <DollarSign size={22} />
        Total estimado
      </span>

      <output
        aria-live="polite"
        className="text-xl font-bold text-[#DEC01F]"
      >
        {clp(total)}
      </output>
    </div>
  );
};
