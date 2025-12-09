// ========================================================================
// ReservaEspacioCard.tsx
// ========================================================================

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&auto=format";

export interface ReservaEspacioCardProps {
  nombre: string;
  tipo: string;
  descripcion?: string | null;
  imagenUrl?: string | null;
  capacidad: number;
  capacidadExtra?: number | null;
  tarifaClp: number;
  tarifaLabel: string;
}

export const ReservaEspacioCard: React.FC<ReservaEspacioCardProps> = ({
  nombre,
  tipo,
  descripcion,
  imagenUrl,
  capacidad,
  capacidadExtra,
  tarifaClp,
  tarifaLabel,
}) => {
  const prefersMotion = useReducedMotion();

  return (
    <motion.div
      initial={!prefersMotion ? { opacity: 0, x: -20 } : undefined}
      animate={!prefersMotion ? { opacity: 1, x: 0 } : undefined}
      transition={{ duration: 0.4 }}
      className="rounded-xl overflow-hidden bg-white shadow-md border border-gray-200"
    >
      <figure className="relative">
        <img
          src={imagenUrl || FALLBACK_IMG}
          alt={`Imagen del espacio ${nombre}`}
          onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
          className="h-64 w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Tipo */}
        <span className="absolute top-4 left-4 inline-flex px-4 py-1 rounded-full 
          bg-white/95 text-[#003B4D] text-xs font-bold shadow">
          {tipo}
        </span>

        {/* Tarifa */}
        <span className="absolute top-4 right-4 inline-flex px-4 py-1 rounded-full 
          bg-[#FFD84D] text-[#003B4D] text-xs font-bold shadow">
          {tarifaClp.toLocaleString("es-CL")} CLP / {tarifaLabel}
        </span>
      </figure>

      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-extrabold text-[#002E3E]">{nombre}</h2>

        <p className="text-gray-700 text-sm leading-relaxed">
          {descripcion || "Espacio disponible para reservas en Centro Recreacional ENAP."}
        </p>

        <ul className="text-sm text-gray-700 space-y-1">
          <li>
            Tipo: <strong>{tipo}</strong>
          </li>

          <li>
            Capacidad: <strong>{capacidad}</strong>
            {capacidadExtra && <> (+{capacidadExtra} extra)</>}
          </li>

          <li>
            Tarifa:{" "}
            <strong className="text-enap-dorado">
              {tarifaClp.toLocaleString("es-CL")} CLP / {tarifaLabel}
            </strong>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};
