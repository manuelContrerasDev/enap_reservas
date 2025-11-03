import React, { useMemo, Suspense, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Loader2, AlertCircle, Plus } from "lucide-react";
import { useEspacios } from "../context/EspaciosContext";
import { useAuth } from "../context/AuthContext";
import { useNotificacion } from "../context/NotificacionContext";
import { LayoutGrid } from "lucide-react";


/** Lazy load de tarjetas para mejor rendimiento. */
const EspacioCard = React.lazy(() =>
  import("../components/cards/EspacioCard").then((mod) => ({
    default: mod.EspacioCard,
  }))
);

/** Utilidad: parsear tarifa */
const parseTarifa = (val: string | null): number => {
  const n = Number((val ?? "").toString().replace(/\./g, "").trim());
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/**
 * EspaciosPage — Catálogo institucional de espacios disponibles.
 * Vista adaptable para socios y administradores ENAP.
 */
const EspaciosPage: React.FC = () => {
  const prefersReducedMotion = useReducedMotion();
  const { espacios, loading, agregarEspacio, eliminarEspacio } = useEspacios();
  const { userRole } = useAuth();
  const { agregarNotificacion } = useNotificacion();

  /** ➕ Crear nuevo espacio (solo admin) */
  const handleAgregarEspacio = useCallback(async () => {
    const nombre = prompt("Nombre del nuevo espacio:");
    const tipo = prompt("Tipo de espacio (sala, cancha, piscina, etc.):");
    const tarifa = parseTarifa(prompt("Tarifa base del espacio (en CLP):"));

    if (!nombre?.trim() || !tipo?.trim() || tarifa <= 0) {
      agregarNotificacion("❌ Datos inválidos o incompletos.", "error");
      return;
    }

    try {
      await agregarEspacio({ nombre: nombre.trim(), tipo: tipo.trim(), tarifa });
      agregarNotificacion("✅ Espacio agregado correctamente.", "success");
    } catch {
      agregarNotificacion("❌ Error al agregar el espacio.", "error");
    }
  }, [agregarEspacio, agregarNotificacion]);

  /** 🗑️ Eliminar espacio (solo admin) */
  const handleEliminarEspacio = useCallback(
    async (id: string) => {
      const ok = confirm("¿Seguro que deseas eliminar este espacio?");
      if (!ok) return;
      try {
        await eliminarEspacio(id);
        agregarNotificacion("🗑️ Espacio eliminado correctamente.", "success");
      } catch {
        agregarNotificacion("❌ Error al eliminar el espacio.", "error");
      }
    },
    [eliminarEspacio, agregarNotificacion]
  );

  /** 📄 Render dinámico del contenido */
  const contenido = useMemo(() => {
    if (loading) {
      return (
        <div
          className="flex flex-col items-center justify-center py-32 text-[#002E3E]"
          role="status"
          aria-busy="true"
          aria-live="polite"
        >
          <Loader2 className="animate-spin mb-3" size={42} aria-hidden="true" />
          <p className="text-gray-600 text-sm">Cargando espacios disponibles...</p>
        </div>
      );
    }

    if (!espacios?.length) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-gray-600">
          <AlertCircle size={48} className="text-[#DEC01F] mb-4" aria-hidden="true" />
          <p className="text-base font-medium text-center">
            No hay espacios registrados en este momento.
          </p>
        </div>
      );
    }

    return (
      <Suspense
        fallback={
          <div
            className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-10"
            role="status"
            aria-busy="true"
            aria-live="polite"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-inner animate-pulse"
              />
            ))}
          </div>
        }
      >
        <motion.section
          initial={prefersReducedMotion ? undefined : { opacity: 0 }}
          animate={prefersReducedMotion ? undefined : { opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          aria-label="Listado de espacios disponibles"
        >
          {espacios.map((espacio, index) => (
            <motion.div
              key={espacio.id}
              initial={prefersReducedMotion ? undefined : { opacity: 0, y: 20 }}
              animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
              transition={prefersReducedMotion ? undefined : { delay: index * 0.05 }}
              className="relative group"
            >
              <EspacioCard espacio={espacio} />

              {userRole === "admin" && (
                <button
                  type="button"
                  onClick={() => handleEliminarEspacio(espacio.id)}
                  aria-label={`Eliminar ${espacio.nombre}`}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm border border-red-100 rounded-full shadow-sm hover:bg-red-50 text-red-600 p-1.5 transition-all"
                >
                  ✕
                </button>
              )}
            </motion.div>
          ))}
        </motion.section>
      </Suspense>
    );
  }, [loading, espacios, userRole, handleEliminarEspacio, prefersReducedMotion]);

  return (
    <main
      className="min-h-[calc(100vh-120px)] bg-[#F9FAFB] flex flex-col"
      role="main"
      aria-labelledby="espacios-title"
    >
      <Helmet>
        <title>Espacios Disponibles | ENAP Limache</title>
        <meta
          name="description"
          content="Catálogo institucional de espacios disponibles en ENAP Limache. Selecciona un espacio para ver detalles o realizar una reserva."
        />
      </Helmet>

      {/* 🔷 Encabezado superior */}
      <motion.header
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
        animate={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
        className="relative bg-[#002E3E] text-white py-5 md:py-6 shadow-md"
      >
        <div className="max-w-5xl mx-auto px-5">
          {/* Contenedor compacto con borde sutil */}
          <div className="relative rounded-xl border border-white/10 bg-white/[0.04] px-5 py-4 md:py-5">
            <div className="flex flex-col items-center text-center gap-2">
              {/* Etiqueta */}
              <span className="inline-block bg-white/10 text-white/80 px-2 py-0.5 rounded-md text-[10px] md:text-[11px] tracking-widest uppercase ring-1 ring-white/15">
                Catálogo ENAP
              </span>

              {/* Título con icono y sombra elegante */}
              <h1
                id="espacios-title"
                className="text-2xl md:text-3xl font-extrabold tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.45)]"
              >
                <span className="inline-flex items-center gap-2">
                  <LayoutGrid size={22} aria-hidden="true" className="opacity-90" />
                  Espacios Disponibles
                </span>
              </h1>

              {/* Subtítulo compacto */}
              <p className="text-white/80 text-sm sm:text-base">
                Selecciona un espacio para ver detalles o realizar una reserva.
              </p>

              {/* Subrayado dorado fino */}
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-[#DEC01F] to-transparent rounded-full" />
            </div>

            {/* Acción admin: centrado en mobile, anclado a la derecha en md+ */}
            {userRole === "admin" && (
              <button
                type="button"
                onClick={handleAgregarEspacio}
                className="mt-4 md:mt-0 md:absolute md:right-5 md:top-1/2 md:-translate-y-1/2 flex items-center justify-center gap-2 bg-[#DEC01F] hover:bg-[#E5D14A] text-[#002E3E] px-3 py-1.5 rounded-lg font-semibold text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-[#DEC01F]/60"
              >
                <Plus size={18} aria-hidden="true" /> Agregar Espacio
              </button>
            )}
          </div>
        </div>
      </motion.header>

      {/* 🔹 Contenido principal */}
      <section className="flex-grow max-w-7xl mx-auto px-6 py-12">{contenido}</section>
    </main>
  );
};

export default React.memo(EspaciosPage);
