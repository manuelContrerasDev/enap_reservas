// src/components/espacios/EspacioCardSocio.tsx
import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users, Info, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Espacio } from "@/context/EspaciosContext";
import { PATHS } from "@/routes/paths";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop";

const CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

interface Props {
  espacio: Espacio;
  fechaFiltro?: string | null;
  ocupadoEnFecha?: boolean;
}

const EspacioCardSocio: React.FC<Props> = memo(
  ({ espacio, fechaFiltro, ocupadoEnFecha }) => {
    const prefersReducedMotion = useReducedMotion();
    const navigate = useNavigate();

    const tarifa = espacio.tarifaClp ?? 0;

    const goToReserva = () => {
      if (!espacio.activo) return;

      const base = PATHS.RESERVA_ID.replace(":id", espacio.id);

      if (fechaFiltro) {
        navigate(`${base}?fecha=${fechaFiltro}`);
      } else {
        navigate(base);
      }
    };

    const puedeReservarDirecto =
      espacio.activo && !(fechaFiltro && ocupadoEnFecha);

    const fechaLabel =
      fechaFiltro && !Number.isNaN(+new Date(fechaFiltro))
        ? new Date(fechaFiltro).toLocaleDateString("es-CL")
        : null;

    return (
      <motion.article
        aria-label={`Espacio ${espacio.nombre}`}
        className="
          group bg-white rounded-xl shadow-md border border-gray-100
          hover:shadow-lg hover:border-[#00A3C4]
          transition-all duration-200
          overflow-hidden cursor-pointer
          focus-within:ring-2 focus-within:ring-[#00B5D8]
        "
        whileHover={!prefersReducedMotion ? { y: -4, scale: 1.01 } : undefined}
        onClick={goToReserva}
      >
        {/* IMAGEN / HEADER */}
        <figure className="relative aspect-[16/9] overflow-hidden">
          <img
            src={espacio.imagenUrl || FALLBACK_IMG}
            alt={espacio.nombre}
            className="
              h-full w-full object-cover
              transition-transform duration-300
              group-hover:scale-105
            "
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_IMG) {
                e.currentTarget.src = FALLBACK_IMG;
              }
            }}
          />

          {/* Overlay degradado */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* BARRA SUPERIOR BADGES */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {/* Tipo de espacio */}
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-[#003B4D] uppercase shadow-sm">
              {espacio.tipo}
            </span>
          </div>

          {/* Tarifa */}
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FFD84D] text-[#003B4D] shadow-sm">
              {CLP.format(tarifa)} / día
            </span>
          </div>

          {/* Badge disponibilidad */}
          {fechaLabel && (
            <div className="absolute bottom-3 left-3">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] border backdrop-blur-sm ${
                  ocupadoEnFecha
                    ? "bg-red-100/90 text-red-700 border-red-200"
                    : "bg-emerald-100/90 text-emerald-700 border-emerald-200"
                }`}
              >
                <CalendarDays size={12} />
                {ocupadoEnFecha
                  ? `Ocupado el ${fechaLabel}`
                  : `Disponible el ${fechaLabel}`}
              </span>
            </div>
          )}
        </figure>

        {/* CONTENIDO */}
        <div className="p-5 flex flex-col gap-3">
          {/* Nombre */}
          <h3 className="text-lg font-bold text-[#002E3E] leading-snug line-clamp-2">
            {espacio.nombre}
          </h3>

          {/* Descripción */}
          <p className="text-sm text-gray-600 line-clamp-2">
            {espacio.descripcion ||
              "Espacio disponible para reservas de socios ENAP."}
          </p>

          {/* Capacidad */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Users size={16} className="text-[#005D73]" />
            <span>
              Capacidad:{" "}
              <strong className="font-semibold">{espacio.capacidad}</strong>
            </span>
            {espacio.capacidadExtra && (
              <span className="text-xs text-gray-500">
                (+{espacio.capacidadExtra} extra)
              </span>
            )}
          </div>

          {/* Estado inactivo */}
          {!espacio.activo && (
            <div className="flex items-center gap-2 text-xs mt-1 text-red-600">
              <Info size={14} />
              <span>Este espacio está temporalmente inactivo.</span>
            </div>
          )}

          {/* BOTÓN PRINCIPAL */}
          <motion.button
            type="button"
            aria-disabled={!puedeReservarDirecto}
            disabled={!puedeReservarDirecto}
            whileTap={!prefersReducedMotion ? { scale: 0.97 } : undefined}
            className={`
              mt-3 w-full px-4 py-2.5 rounded-lg text-sm font-semibold
              flex items-center justify-center gap-2
              transition-all duration-200
              ${
                puedeReservarDirecto
                  ? "bg-[#01546B] hover:bg-[#016A85] text-white shadow-sm"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }
            `}
            onClick={(e) => {
              e.stopPropagation();
              if (puedeReservarDirecto) goToReserva();
            }}
          >
            {!espacio.activo
              ? "No disponible"
              : fechaFiltro && ocupadoEnFecha
              ? "Ocupado en la fecha seleccionada"
              : "Reservar"}
          </motion.button>

          {/* Mensaje adicional cuando está ocupado */}
          {fechaFiltro && ocupadoEnFecha && (
            <p className="mt-1 text-[11px] text-gray-500">
              Haz clic para revisar disponibilidad en otras fechas.
            </p>
          )}
        </div>
      </motion.article>
    );
  }
);

export default EspacioCardSocio;
