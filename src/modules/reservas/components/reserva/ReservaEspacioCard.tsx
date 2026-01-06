// ========================================================================
// ReservaEspacioCard.tsx — ENAP 2025 (SYNC REAL)
// ========================================================================

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&auto=format";

export type TipoEspacio = "CABANA" | "QUINCHO" | "PISCINA";
export type ModalidadCobro = "POR_DIA" | "POR_NOCHE" | "POR_PERSONA";

export interface ReservaEspacioCardProps {
  nombre: string;
  tipo: TipoEspacio;
  descripcion?: string | null;
  imagenUrl?: string | null;
  capacidad: number;

  modalidadCobro: ModalidadCobro;
  precioBaseReferencial: number;
}

export const ReservaEspacioCard: React.FC<ReservaEspacioCardProps> = ({
  nombre,
  tipo,
  descripcion,
  imagenUrl,
  capacidad,
  modalidadCobro,
  precioBaseReferencial,
}) => {
  const prefersReducedMotion = useReducedMotion();

  const labelCobro =
    modalidadCobro === "POR_DIA"
      ? "día"
      : modalidadCobro === "POR_NOCHE"
      ? "noche"
      : "persona";

  return (
    <motion.div
      initial={!prefersReducedMotion ? { opacity: 0, x: -20 } : undefined}
      animate={!prefersReducedMotion ? { opacity: 1, x: 0 } : undefined}
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

        {/* Tarifa referencial */}
        <span className="absolute top-4 right-4 inline-flex px-4 py-1 rounded-full 
          bg-[#FFD84D] text-[#003B4D] text-xs font-bold shadow">
          Desde {precioBaseReferencial.toLocaleString("es-CL")} CLP / {labelCobro}
        </span>
      </figure>

      <div className="p-6 space-y-4">
        <h2 className="text-2xl font-extrabold text-[#002E3E]">{nombre}</h2>

        <p className="text-gray-700 text-sm leading-relaxed">
          {descripcion ||
            "Espacio disponible para reservas en el Centro Recreacional ENAP."}
        </p>

        <ul className="text-sm text-gray-700 space-y-1">
          <li>
            Tipo: <strong>{tipo}</strong>
          </li>

          <li>
            Capacidad máxima: <strong>{capacidad}</strong> personas
          </li>

          <li>
            Modalidad de cobro:{" "}
            <strong className="text-enap-dorado">{labelCobro}</strong>
          </li>
        </ul>
      </div>
    </motion.div>
  );
};

export default ReservaEspacioCard;
