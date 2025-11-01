import React, { memo, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEspacios } from "../../context/EspaciosContext";
import type { Espacio } from "../../context/EspaciosContext";
import { useNotificacion } from "../../context/NotificacionContext";

type Props = { espacio: Espacio };

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop";

/**
 * Card institucional ENAP — Moderno & Accesible
 * Paleta: Azul petróleo (#002E3E) + Dorado (#DEC01F)
 * - Semántica: article/figure/figcaption
 * - Accesibilidad: aria-labels, focus-visible
 * - UI: ring+shadow sutil, chips, hover-translate
 */
export const EspacioCard: React.FC<Props> = memo(({ espacio }) => {
  const navigate = useNavigate();
  const { userRole } = useAuth();
  const { eliminarEspacio } = useEspacios();
  const { agregarNotificacion } = useNotificacion();

  const handleEliminar = useCallback(async () => {
    if (
      window.confirm(
        `¿Seguro que deseas eliminar el espacio "${espacio.nombre}"? Esta acción no se puede deshacer.`
      )
    ) {
      try {
        await eliminarEspacio(espacio.id);
        agregarNotificacion("🗑️ Espacio eliminado correctamente", "success");
      } catch (error) {
        console.error("❌ Error al eliminar espacio:", error);
        agregarNotificacion("Error al eliminar el espacio", "error");
      }
    }
  }, [espacio.id, espacio.nombre, eliminarEspacio, agregarNotificacion]);

  const handleEditar = useCallback(() => {
    // Aquí luego puedes navegar a /admin/espacios/:id si ya tienes vista de edición
    // navigate(`/admin/espacios/${espacio.id}/editar`);
    agregarNotificacion(`🛠️ Edición de "${espacio.nombre}" próximamente`, "info");
  }, [espacio.id, espacio.nombre, agregarNotificacion]);

  const onImageError = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      if (img.src !== FALLBACK_IMG) img.src = FALLBACK_IMG;
    },
    []
  );

  return (
    <motion.article
      role="article"
      aria-labelledby={`espacio-${espacio.id}-title`}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative overflow-hidden rounded-2xl bg-white ring-1 ring-gray-200 hover:ring-[#DEC01F]/50 shadow-sm hover:shadow-xl transition-all duration-300 focus-within:ring-2 focus-within:ring-[#DEC01F]/70"
    >
      {/* Media */}
      <figure className="relative aspect-[16/9] overflow-hidden">
        <img
          src={espacio.imagen || FALLBACK_IMG}
          onError={onImageError}
          alt={`Vista del espacio ${espacio.nombre}`}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {/* Overlay gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />

        {/* Badges sobre la imagen */}
        <figcaption className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-3">
          <span className="pointer-events-auto select-none rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[#002E3E] shadow-sm ring-1 ring-black/5">
            {espacio.tipo}
          </span>
          <span className="pointer-events-auto select-none rounded-full bg-[#DEC01F]/95 px-3 py-1 text-xs font-extrabold text-[#002E3E] shadow-sm ring-1 ring-black/5">
            ${espacio.tarifa.toLocaleString("es-CL")}/día
          </span>
        </figcaption>
      </figure>

      {/* Content */}
      <div className="flex h-full flex-col gap-4 p-5">
        <header className="flex items-start justify-between gap-3">
          <h3
            id={`espacio-${espacio.id}-title`}
            className="text-xl font-bold leading-tight text-[#002E3E]"
          >
            {espacio.nombre}
          </h3>
        </header>

        <p className="line-clamp-2 text-sm leading-relaxed text-gray-600">
          {espacio.descripcion || "Espacio disponible para reserva en Refinería Aconcagua."}
        </p>

        <div className="mt-1 flex items-center gap-2 text-sm text-gray-700">
          <Users size={16} className="text-[#002E3E]" aria-hidden="true" />
          <span>
            Capacidad:{" "}
            <strong className="font-semibold">
              {espacio.capacidad ?? 10} personas
            </strong>
          </span>
        </div>

        {/* Actions */}
        <div className="mt-2">
          {userRole === "admin" ? (
            <div className="flex items-center gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleEditar}
                type="button"
                aria-label={`Editar ${espacio.nombre}`}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-[#DEC01F]/60 bg-[#DEC01F] px-4 py-2.5 font-semibold text-[#002E3E] shadow-sm hover:bg-[#E8CF4F] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DEC01F]/70"
              >
                <Edit size={18} aria-hidden="true" />
                Editar
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleEliminar}
                type="button"
                aria-label={`Eliminar ${espacio.nombre}`}
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/20 bg-red-500 px-4 py-2.5 font-semibold text-white shadow-sm hover:bg-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              >
                <Trash2 size={18} aria-hidden="true" />
                Eliminar
              </motion.button>
            </div>
          ) : (
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/reservar/${espacio.id}`)}
              type="button"
              aria-label={`Reservar ${espacio.nombre}`}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#002E3E] px-5 py-3 font-semibold text-white shadow-sm ring-1 ring-black/5 transition-all hover:bg-[#01384A] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#DEC01F]/70"
            >
              Reservar
            </motion.button>
          )}
        </div>
      </div>
    </motion.article>
  );
});

export default EspacioCard;
