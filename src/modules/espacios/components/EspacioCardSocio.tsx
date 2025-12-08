// src/components/espacios/EspacioCardSocio.tsx
import React, { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users, Info, CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Espacio } from "@/context/EspaciosContext";
import { PATHS } from "@/routes/paths";
import { useAuth } from "@/context/auth";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop";

const CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

/* ---------------------------------------------------------
 * Resolver imagen
 * --------------------------------------------------------- */
function resolveImagen(path: string | null, tipo?: string): string {
  if (path && (path.startsWith("http://") || path.startsWith("https://"))) {
    return path;
  }

  if (path && path.startsWith("/assets")) {
    try {
      return new URL(`/src${path}`, import.meta.url).href;
    } catch {
      console.warn("⚠ No se pudo cargar imagen local:", path);
    }
  }

  // Fallbacks por tipo
  if (!path) {
    if (tipo === "CABANA") {
      const random = Math.floor(Math.random() * 5) + 1;
      return new URL(`/src/assets/cabana${random}.png`, import.meta.url).href;
    }
    if (tipo === "QUINCHO") {
      return new URL("/src/assets/parque-espacio.png", import.meta.url).href;
    }
    if (tipo === "PISCINA") {
      return new URL("/src/assets/Piscina1.png", import.meta.url).href;
    }
  }

  return FALLBACK_IMG;
}

/* ---------------------------------------------------------
 * Props
 * --------------------------------------------------------- */
interface Props {
  espacio: Espacio;
  fechaFiltro?: string | null;
  ocupadoEnFecha?: boolean;
}

const EspacioCardSocio: React.FC<Props> = memo(
  ({ espacio, fechaFiltro = null, ocupadoEnFecha = false }) => {
    const { role } = useAuth();
    const prefersReducedMotion = useReducedMotion();
    const navigate = useNavigate();

    /* -----------------------------------------------
     * Tarifa según role (SOCIO / EXTERNO)
     * ----------------------------------------------- */
    const tarifa =
      role === "EXTERNO"
        ? espacio.tarifaExterno ?? espacio.tarifaClp
        : espacio.tarifaClp;

    /* -----------------------------------------------
     * Etiqueta según modalidadCobro
     * ----------------------------------------------- */
    const modalidadLabel =
      espacio.modalidadCobro === "POR_NOCHE"
        ? " / noche"
        : espacio.modalidadCobro === "POR_PERSONA"
        ? " / persona"
        : " / día";

    /* -----------------------------------------------
     * Imagen
     * ----------------------------------------------- */
    const imagen = resolveImagen(espacio.imagenUrl, espacio.tipo);

    /* -----------------------------------------------
     * Navegación a reserva
     * ----------------------------------------------- */
    const goToReserva = () => {
      if (!espacio.activo) return;

      const base = PATHS.RESERVA_ID.replace(":id", espacio.id);
      if (fechaFiltro) navigate(`${base}?fecha=${fechaFiltro}`);
      else navigate(base);
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
          transition-all duration-200 overflow-hidden cursor-pointer
          focus-within:ring-2 focus-within:ring-[#00B5D8]
        "
        whileHover={!prefersReducedMotion ? { y: -4, scale: 1.01 } : undefined}
        onClick={goToReserva}
      >
        {/* IMAGEN */}
        <figure className="relative aspect-[16/9] overflow-hidden">
          <img
            src={imagen}
            alt={espacio.nombre}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_IMG;
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Tipo */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-white/95 text-[#003B4D] uppercase shadow-sm">
              {espacio.tipo}
            </span>
          </div>

          {/* Tarifa */}
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 rounded-full text-[11px] font-semibold bg-[#FFD84D] text-[#003B4D] shadow-sm">
              {CLP.format(tarifa)}
              {modalidadLabel}
            </span>
          </div>

          {/* Disponibilidad */}
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
          <h3 className="text-lg font-bold text-[#002E3E] leading-snug line-clamp-2">
            {espacio.nombre}
          </h3>

          <p className="text-sm text-gray-600 line-clamp-2">
            {espacio.descripcion ||
              "Espacio disponible para reservas de socios ENAP."}
          </p>

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

          {!espacio.activo && (
            <div className="flex items-center gap-2 text-xs mt-1 text-red-600">
              <Info size={14} />
              <span>Este espacio está temporalmente inactivo.</span>
            </div>
          )}

          <motion.button
            type="button"
            disabled={!puedeReservarDirecto}
            whileTap={!prefersReducedMotion ? { scale: 0.97 } : undefined}
            className={`
              mt-3 w-full px-4 py-2.5 rounded-lg text-sm font-semibold
              flex items-center justify-center gap-2 transition-all duration-200
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
        </div>
      </motion.article>
    );
  }
);

export default EspacioCardSocio;
