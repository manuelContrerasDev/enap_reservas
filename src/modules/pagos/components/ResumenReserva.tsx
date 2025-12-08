// src/modules/pagos/components/ResumenReserva.tsx
import React from "react";
import { Calendar, Users, MapPin } from "lucide-react";

interface Props {
  espacioNombre: string;
  dias: number;
  fechaInicio: string;
  fechaFin: string;
  cantidadPersonas: number;
  monto: number;
}

export default function ResumenReserva({
  espacioNombre,
  dias,
  fechaInicio,
  fechaFin,
  cantidadPersonas,
  monto,
}: Props) {
  return (
    <section className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-100">
      {/* HEADER */}
      <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
        <div className="w-12 h-12 bg-[#DEC01F]/10 rounded-full flex items-center justify-center">
          <MapPin className="text-[#DEC01F]" size={24} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-[#002E3E]">{espacioNombre}</h2>
          <p className="text-sm text-gray-600">
            Reserva de {dias} día{dias > 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* LISTA */}
      <ul className="space-y-3 text-gray-700">
        <li className="flex justify-between">
          <span className="flex items-center gap-2">
            <Calendar size={16} /> Inicio:
          </span>
          <span>{new Date(fechaInicio).toLocaleDateString("es-CL")}</span>
        </li>

        <li className="flex justify-between">
          <span className="flex items-center gap-2">
            <Calendar size={16} /> Fin:
          </span>
          <span>{new Date(fechaFin).toLocaleDateString("es-CL")}</span>
        </li>

        <li className="flex justify-between">
          <span className="flex items-center gap-2">
            <Users size={16} /> Personas:
          </span>
          <span>{cantidadPersonas}</span>
        </li>

        {/* Total */}
        <li className="pt-4 border-t border-gray-200 text-lg font-bold text-[#002E3E] flex justify-between">
          <span>Total a pagar:</span>
          <span className="text-[#DEC01F]">
            ${monto.toLocaleString("es-CL")}
          </span>
        </li>
      </ul>
    </section>
  );
}
