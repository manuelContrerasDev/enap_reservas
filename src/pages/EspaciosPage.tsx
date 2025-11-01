import React, { useMemo, Suspense, useCallback } from "react";
import { motion } from "framer-motion";
import { Loader2, AlertCircle, Plus } from "lucide-react";
import { useEspacios } from "../context/EspaciosContext";
import { useAuth } from "../context/AuthContext";
import { useNotificacion } from "../context/NotificacionContext";

/**
 * Lazy load de tarjetas para mejor rendimiento.
 */
const EspacioCard = React.lazy(() =>
  import("../components/cards/EspacioCard").then((mod) => ({
    default: mod.EspacioCard,
  }))
);

/**
 * EspaciosPage — Catálogo institucional de espacios disponibles.
 * Vista adaptable para socios y administradores ENAP.
 */
const EspaciosPage: React.FC = () => {
  const { espacios, loading, agregarEspacio, eliminarEspacio } = useEspacios();
  const { userRole } = useAuth();
  const { agregarNotificacion } = useNotificacion();

  /** ➕ Crear nuevo espacio (solo admin) */
  const handleAgregarEspacio = useCallback(async () => {
    const nombre = prompt("Nombre del nuevo espacio:");
    const tipo = prompt("Tipo de espacio (sala, cancha, piscina, etc.):");
    const tarifa = Number(prompt("Tarifa base del espacio (en CLP):") || "0");

    if (!nombre?.trim() || !tipo?.trim() || tarifa <= 0) {
      agregarNotificacion("❌ Datos inválidos o incompletos.", "error");
      return;
    }

    try {
      await agregarEspacio({ nombre, tipo, tarifa });
      agregarNotificacion("✅ Espacio agregado correctamente.", "success");
    } catch {
      agregarNotificacion("❌ Error al agregar el espacio.", "error");
    }
  }, [agregarEspacio, agregarNotificacion]);

  /** 🗑️ Eliminar espacio */
  const handleEliminarEspacio = useCallback(
    async (id: string) => {
      const confirmado = confirm("¿Seguro que deseas eliminar este espacio?");
      if (!confirmado) return;

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
        >
          <Loader2 className="animate-spin mb-3" size={42} aria-hidden="true" />
          <p className="text-gray-600 text-sm">Cargando espacios disponibles...</p>
        </div>
      );
    }

    if (!espacios?.length) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-gray-600">
          <AlertCircle
            size={48}
            className="text-[#DEC01F] mb-4"
            aria-hidden="true"
          />
          <p className="text-base font-medium text-center">
            No hay espacios registrados en este momento.
          </p>
        </div>
      );
    }

    return (
      <Suspense
        fallback={
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-10 animate-pulse">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-56 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl shadow-inner"
              />
            ))}
          </div>
        }
      >
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          aria-label="Listado de espacios disponibles"
        >
          {espacios.map((espacio, index) => (
            <motion.div
              key={espacio.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
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
  }, [loading, espacios, userRole, handleEliminarEspacio]);

  return (
    <main
      className="min-h-[calc(100vh-120px)] bg-[#F9FAFB] flex flex-col"
      role="main"
    >
      {/* 🔷 Encabezado superior */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#002E3E] text-white py-10 shadow-md border-b border-[#DEC01F]/30"
      >
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-1 tracking-tight text-white">
              Espacios Disponibles
            </h1>
            <p className="text-[#C7D9DC] text-sm sm:text-base opacity-90">
              Selecciona un espacio para ver detalles o realizar una reserva.
            </p>
          </div>

          {userRole === "admin" && (
            <button
              type="button"
              onClick={handleAgregarEspacio}
              className="flex items-center justify-center gap-2 bg-[#DEC01F] hover:bg-[#E5D14A] text-[#002E3E] px-4 py-2 rounded-lg font-semibold text-sm transition-all shadow-sm focus:ring-2 focus:ring-[#DEC01F]/60"
            >
              <Plus size={18} aria-hidden="true" /> Agregar Espacio
            </button>
          )}
        </div>
      </motion.header>

      {/* 🔹 Contenido principal */}
      <section
        className="flex-grow max-w-7xl mx-auto px-6 py-12"
        aria-labelledby="espacios-section"
      >
        {contenido}
      </section>
    </main>
  );
};

export default EspaciosPage;
