// src/components/espacios/EspacioCardSocio.tsx
import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users, Info, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Espacio } from "@/context/EspaciosContext";

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
      
      if (fechaFiltro) {
        navigate(`/reservar/${espacio.id}?fecha=${fechaFiltro}`);
      } else {
        navigate(`/reservar/${espacio.id}`);
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
        className="bg-white rounded-2xl shadow-md ring-1 ring-gray-200 hover:ring-[#DEC01F] transition-all overflow-hidden cursor-pointer focus-within:ring-2 focus-within:ring-[#002E3E]"
        whileHover={!prefersReducedMotion ? { y: -4, scale: 1.01 } : undefined}
        onClick={goToReserva}
      >
        {/* IMAGEN */}
        <figure className="relative aspect-[16/9] overflow-hidden">
          <img
            src={espacio.imagenUrl || FALLBACK_IMG}
            alt={espacio.nombre}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              if (e.currentTarget.src !== FALLBACK_IMG) {
                e.currentTarget.src = FALLBACK_IMG;
              }
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

          {/* Badges tipo + tarifa */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <span className="bg-white/90 text-[#002E3E] font-semibold px-3 py-1 text-[11px] rounded-full">
              {espacio.tipo}
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span className="bg-[#DEC01F]/95 text-[#002E3E] font-semibold px-3 py-1 text-[11px] rounded-full">
              {CLP.format(tarifa)} / día
            </span>
          </div>

          {/* Badge de disponibilidad para la fecha seleccionada */}
          {fechaLabel && (
            <div className="absolute bottom-3 left-3">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] ${
                  ocupadoEnFecha
                    ? "bg-red-100 text-red-700 border border-red-200"
                    : "bg-emerald-100 text-emerald-700 border border-emerald-200"
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

        {/* INFO */}
        <div className="p-5 flex flex-col gap-3">
          <h3 className="text-lg font-bold text-[#002E3E] line-clamp-2">
            {espacio.nombre}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2">
            {espacio.descripcion ||
              "Espacio disponible para reserva de socios ENAP."}
          </p>

          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Users size={16} className="text-[#002E3E]" aria-hidden="true" />
            <span>
              Capacidad: <strong>{espacio.capacidad}</strong>
            </span>
            {espacio.capacidadExtra ? (
              <span className="text-xs text-gray-500">
                (+{espacio.capacidadExtra} extra)
              </span>
            ) : null}
          </div>

          {!espacio.activo && (
            <div className="flex items-center gap-2 text-red-600 text-xs mt-1">
              <Info size={14} aria-hidden="true" />
              <span>Este espacio está temporalmente inactivo.</span>
            </div>
          )}

          {/* BOTÓN */}
          <motion.button
            type="button"
            aria-label={
              !espacio.activo
                ? `Espacio ${espacio.nombre} no disponible`
                : fechaFiltro && ocupadoEnFecha
                ? `Espacio ${espacio.nombre} ocupado el ${fechaLabel}`
                : `Reservar espacio ${espacio.nombre}`
            }
            aria-disabled={!puedeReservarDirecto}
            disabled={!puedeReservarDirecto}
            whileTap={!prefersReducedMotion ? { scale: 0.97 } : undefined}
            className={`mt-3 w-full font-semibold px-4 py-2.5 rounded-lg text-sm
            ${
              puedeReservarDirecto
                ? "bg-[#002E3E] text-white hover:bg-[#01384A]"
                : "bg-gray-300 text-gray-600 cursor-not-allowed"
            }
          `}
            onClick={(e) => {
              e.stopPropagation();
              if (puedeReservarDirecto) {
                goToReserva();
              }
            }}
          >
            {!espacio.activo
              ? "No disponible"
              : fechaFiltro && ocupadoEnFecha
              ? "Ocupado en la fecha seleccionada"
              : "Reservar"}
          </motion.button>

          {fechaFiltro && ocupadoEnFecha && (
            <p className="mt-1 text-[11px] text-gray-500">
              Puedes ingresar al detalle para revisar otras fechas de reserva
              disponibles.
            </p>
          )}
        </div>
      </motion.article>
    );
  }
);

export default EspacioCardSocio;
