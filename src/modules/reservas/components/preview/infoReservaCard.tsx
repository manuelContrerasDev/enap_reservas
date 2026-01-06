// src/modules/reserva/preview/InfoReservaCard.tsx
import React from "react";
import { Home, Users } from "lucide-react";
import type { ReservaFrontend } from "@/types/ReservaDTO";

interface Props {
  reserva: ReservaFrontend;
}

export const InfoReservaCard: React.FC<Props> = ({ reserva }) => {
  return (
    <section className="bg-gray-50 rounded-2xl px-6 py-5 border space-y-4">
      <h2 className="text-xl font-bold text-[#002E3E] text-center flex items-center justify-center gap-2">
        <Home size={20} /> {reserva.espacioNombre}
      </h2>

      <ul className="text-gray-700 text-sm space-y-2 text-center">
        <li className="flex justify-center gap-1 items-center">
          <Users size={14} />
          <strong>{reserva.cantidadPersonas}</strong> persona(s)
        </li>

        <li className="font-semibold">{reserva.dias} día(s)</li>

        <li className="flex items-center justify-center gap-3 text-sm font-medium">
          <span className="px-2 py-1 bg-white border rounded-lg shadow-sm">
            {new Date(reserva.fechaInicio).toLocaleDateString("es-CL")}
          </span>

          <span className="text-gray-500 font-semibold text-lg">→</span>

          <span className="px-2 py-1 bg-white border rounded-lg shadow-sm">
            {new Date(reserva.fechaFin).toLocaleDateString("es-CL")}
          </span>
        </li>
      </ul>
    </section>
  );
};
