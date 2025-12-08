// src/modules/reserva/preview/AsistentesList.tsx
import React from "react";
import { Users } from "lucide-react";

interface Invitado {
  nombre: string;
  rut: string | null | undefined;
}

interface Props {
  invitados: Invitado[];
}


export const AsistentesList: React.FC<Props> = ({ invitados }) => {
  if (!invitados || invitados.length === 0) return null;

  return (
    <section className="bg-white border rounded-xl px-6 py-4 shadow-sm">
      <h3 className="text-lg font-bold text-[#002E3E] mb-2 flex items-center gap-2">
        <Users size={18} /> Lista de asistentes
      </h3>

      <ul className="space-y-1">
        {invitados.map((inv, idx) => (
          <li
            key={idx}
            className="flex justify-between bg-gray-50 px-3 py-2 rounded border"
          >
            <span>{inv.nombre}</span>
            <span className="text-gray-600">{inv.rut}</span>
          </li>
        ))}
      </ul>
    </section>
  );
};
