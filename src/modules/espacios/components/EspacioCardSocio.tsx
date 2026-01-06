// src/components/espacios/EspacioCardSocio.tsx
import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users, Info, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

import type { EspacioDTO } from "@/types/espacios";
import { PATHS } from "@/routes/paths";
import { useAuth } from "@/context/auth";

/* ============================================================
 * Utils
 * ============================================================ */
const CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop";

function resolveImagen(
  path: string | null,
  tipo: EspacioDTO["tipo"]
): string {
  if (path?.startsWith("http")) return path;

  try {
    switch (tipo) {
      case "CABANA":
        return new URL("/src/assets/cabana1.png", import.meta.url).href;
      case "QUINCHO":
        return new URL("/src/assets/parque-espacio.png", import.meta.url).href;
      case "PISCINA":
        return new URL("/src/assets/Piscina1.png", import.meta.url).href;
      default:
        return FALLBACK_IMG;
    }
  } catch {
    return FALLBACK_IMG;
  }
}

function modalidadLabel(
  modalidad: EspacioDTO["modalidadCobro"]
): string {
  switch (modalidad) {
    case "POR_NOCHE":
      return " / noche";
    case "POR_PERSONA":
      return " / persona";
    default:
      return " / día";
  }
}

/* ============================================================
 * Props
 * ============================================================ */
interface Props {
  espacio: EspacioDTO;
  fechaFiltro?: string | null;
  ocupadoEnFecha?: boolean;
}

/* ============================================================
 * Component
 * ============================================================ */
const EspacioCardSocio: React.FC<Props> = memo(
  ({ espacio, fechaFiltro = null, ocupadoEnFecha = false }) => {
    const { role } = useAuth();
    const navigate = useNavigate();
    const prefersReducedMotion = useReducedMotion();

    const esExterno = role === "EXTERNO";

    const precioBase = esExterno
      ? espacio.precioBaseExterno
      : espacio.precioBaseSocio;

    const puedeReservar =
      espacio.activo &&
      espacio.visible &&
      !(fechaFiltro && ocupadoEnFecha);

    const imagen = resolveImagen(espacio.imagenUrl, espacio.tipo);

    const goToReserva = () => {
      if (!puedeReservar) return;

      const base = PATHS.RESERVA_ID.replace(":id", espacio.id);
      fechaFiltro ? navigate(`${base}?fecha=${fechaFiltro}`) : navigate(base);
    };

    return (
      <motion.article
        role="button"
        aria-disabled={!puedeReservar}
        onClick={goToReserva}
        whileHover={
          !prefersReducedMotion ? { y: -4, scale: 1.01 } : undefined
        }
        className="
          group bg-white rounded-xl shadow-md border border-gray-100
          hover:shadow-lg hover:border-[#00A3C4]
          transition-all duration-200 overflow-hidden cursor-pointer
        "
      >
        {/* Imagen */}
        <figure className="relative aspect-[16/9] overflow-hidden">
          <img
            src={imagen}
            alt={espacio.nombre}
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
            onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-white/95 text-[#003B4D]">
            {espacio.tipo}
          </span>

          <span className="absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full bg-[#FFD84D] text-[#003B4D]">
            {CLP.format(precioBase)}
            {modalidadLabel(espacio.modalidadCobro)}
          </span>

          {fechaFiltro && (
            <span
              className={`absolute bottom-3 left-3 px-3 py-1 text-xs rounded-full flex items-center gap-1 ${
                ocupadoEnFecha
                  ? "bg-red-100 text-red-700"
                  : "bg-emerald-100 text-emerald-700"
              }`}
            >
              <CalendarDays size={12} />
              {ocupadoEnFecha ? "Ocupado" : "Disponible"}
            </span>
          )}
        </figure>

        {/* Contenido */}
        <div className="p-5 flex flex-col gap-3">
          <h3 className="text-lg font-bold text-[#002E3E]">
            {espacio.nombre}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2">
            {espacio.descripcion || "Espacio disponible para reservas ENAP."}
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Users size={16} />
            Capacidad: <strong>{espacio.capacidad}</strong>
          </div>

          {!espacio.activo && (
            <div className="flex items-center gap-2 text-xs text-red-600">
              <Info size={14} />
              No disponible temporalmente
            </div>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              goToReserva();
            }}
            disabled={!puedeReservar}
            className={`mt-2 py-2 rounded-lg text-sm font-semibold transition-colors ${
              puedeReservar
                ? "bg-[#01546B] text-white hover:bg-[#016A85]"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            Reservar
          </button>
        </div>
      </motion.article>
    );
  }
);

export default EspacioCardSocio;
