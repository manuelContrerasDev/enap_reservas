// src/pages/socio/EspacioDetallePage.tsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion, useReducedMotion } from "framer-motion";
import {
  Loader2,
  Users,
  Home,
  CalendarDays,
  Info,
  ArrowLeft,
} from "lucide-react";

import { useEspacios, Espacio } from "@/context/EspaciosContext";
import { useAuth } from "@/context/AuthContext";


const CLP = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

interface BloqueFecha {
  fechaInicio: string;
  fechaFin: string;
}

const EspacioDetallePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const { obtenerEspacio, obtenerDisponibilidad } = useEspacios();
  const { role } = useAuth();

  const [espacio, setEspacio] = useState<Espacio | null>(null);
  const [bloques, setBloques] = useState<BloqueFecha[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingReserva, setLoadingReserva] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });


  // ============================================================
  // Cargar detalle + disponibilidad
  // ============================================================
  useEffect(() => {
    if (!id) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const [esp, disp] = await Promise.all([
          obtenerEspacio(id),
          obtenerDisponibilidad(id),
        ]);

        if (!esp) {
          setError("No se encontró el espacio solicitado.");
          setEspacio(null);
          setBloques([]);
          return;
        }

        setEspacio(esp);
        setBloques(disp);
      } catch (e) {
        console.error(e);
        setError("Ocurrió un error al cargar la información del espacio.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, obtenerEspacio, obtenerDisponibilidad]);

  // ============================================================
  // CTA reservar
  // ============================================================
  const handleReservar = async () => {
    if (!espacio || !espacio.activo) return;

    try {
      setLoadingReserva(true);
      navigate(`/reservar/${espacio.id}`);
    } finally {
      setLoadingReserva(false);
    }
  };

  // ============================================================
  // Texto bonito modalidad cobro
  // ============================================================
  const modalidadLabel = useMemo(() => {
    if (!espacio) return "";
    switch (espacio.modalidadCobro) {
      case "POR_DIA":
        return "Por día";
      case "POR_PERSONA":
        return "Por persona";
      case "POR_NOCHE":
      default:
        return "Por noche";
    }
  }, [espacio]);

  // ============================================================
  // Render estados
  // ============================================================
  if (loading) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F9FAFB]">
        <Helmet>
          <title>Cargando espacio… | ENAP Limache</title>
        </Helmet>
        <Loader2 className="animate-spin text-[#002E3E] mb-3" size={42} />
        <p className="text-gray-600 text-sm">Cargando información del espacio…</p>
      </main>
    );
  }

  if (error || !espacio) {
    return (
      <main className="min-h-[70vh] flex flex-col items-center justify-center bg-[#F9FAFB] px-4">
        <Helmet>
          <title>Error | ENAP Limache</title>
        </Helmet>

        <div className="max-w-md w-full bg-white rounded-2xl shadow-md p-6 text-center">
          <Info className="mx-auto text-red-500 mb-3" size={40} />
          <h1 className="text-xl font-bold text-[#002E3E] mb-2">
            No pudimos cargar el espacio
          </h1>
          <p className="text-gray-600 text-sm mb-4">
            {error || "Ocurrió un error inesperado. Inténtalo nuevamente más tarde."}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#002E3E] text-white text-sm font-semibold hover:bg-[#01384A]"
          >
            <ArrowLeft size={16} />
            Volver
          </button>
        </div>
      </main>
    );
  }

  const isAdmin = role === "ADMIN";
  const isActivo = espacio.activo;

  return (
    <main className="bg-[#F9FAFB] min-h-screen pb-10 pt-2">
      <Helmet>
        <title>{espacio.nombre} | ENAP Limache</title>
      </Helmet>

      {/* HEADER SUPERIOR */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-[#002E3E]"
          >
            <ArrowLeft size={16} />
            Volver
          </button>

          <span className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <Home size={16} />
            Centro Recreacional ENAP Limache
          </span>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
        {/* TITULO + BADGES */}
        <motion.div
          initial={!prefersReducedMotion ? { opacity: 0, y: -8 } : undefined}
          animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.35 }}
          className="mb-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[#002E3E]">
                {espacio.nombre}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E5F2F7] text-[#002E3E] font-medium">
                  <Home size={14} />
                  {espacio.tipo}
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  <Users size={14} />
                  Capacidad {espacio.capacidad}
                  {espacio.capacidadExtra
                    ? ` (+${espacio.capacidadExtra} extra)`
                    : ""}
                </span>

                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#FFF6D1] text-[#8A6A00] text-xs">
                  Modalidad: {modalidadLabel}
                </span>

                {!isActivo && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs">
                    <Info size={12} />
                    Espacio inactivo
                  </span>
                )}
              </div>
            </div>

            <div className="text-right text-sm">
              <p className="text-gray-500">Tarifa socio</p>
              <p className="text-xl font-extrabold text-[#002E3E]">
                {CLP.format(espacio.tarifaClp)}
                <span className="text-xs font-normal text-gray-500">
                  {" "}
                  / {modalidadLabel.toLowerCase().replace("por ", "")}
                </span>
              </p>
              {espacio.tarifaExterno && (
                <p className="text-xs text-gray-500 mt-1">
                  Externos desde{" "}
                  <span className="font-semibold">
                    {CLP.format(espacio.tarifaExterno)}
                  </span>
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* IMAGEN PRINCIPAL */}
        <motion.div
          initial={!prefersReducedMotion ? { opacity: 0 } : undefined}
          animate={!prefersReducedMotion ? { opacity: 1 } : undefined}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="w-full rounded-3xl overflow-hidden shadow-sm border border-gray-200 bg-gray-100">
            <img
              src={
                espacio.imagenUrl ||
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=1600&auto=format&fit=crop"
              }
              alt={espacio.nombre}
              className="w-full h-[260px] sm:h-[340px] md:h-[420px] object-cover"
              onError={(e) => {
                e.currentTarget.src =
                  "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?q=80&w=1600&auto=format&fit=crop";
              }}
            />
          </div>
        </motion.div>

        {/* LAYOUT PRINCIPAL: INFO + CARD RESERVA */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.1fr)] gap-8 items-start">
          {/* COLUMNA IZQUIERDA */}
          <section className="space-y-6">
            {/* Descripción */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <h2 className="text-lg font-semibold text-[#002E3E] mb-2">
                Descripción del espacio
              </h2>
              <p className="text-sm text-gray-700 leading-relaxed">
                {espacio.descripcion ||
                  "Espacio disponible para uso de socios ENAP Limache. Ideal para actividades familiares, recreativas y eventos según normativa interna."}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-3 text-xs sm:text-sm text-gray-700">
                <div className="space-y-1">
                  <p className="font-semibold text-[#002E3E]">
                    Modalidad de cobro
                  </p>
                  <p>{modalidadLabel}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-[#002E3E]">
                    Capacidad máxima
                  </p>
                  <p>
                    {espacio.capacidad} personas{" "}
                    {espacio.capacidadExtra
                      ? `(+${espacio.capacidadExtra} adicionales)`
                      : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* Disponibilidad simple (bloques) */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <h2 className="text-lg font-semibold text-[#002E3E] flex items-center gap-2">
                  <CalendarDays size={18} />
                  Fechas ocupadas
                </h2>
                <p className="text-xs text-gray-500">
                  Los rangos listados ya tienen reservas activas.
                </p>
              </div>

              {bloques.length === 0 ? (
                <p className="text-sm text-gray-600">
                  No hay reservas futuras registradas para este espacio.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {bloques.map((b, idx) => (
                    <span
                        key={`${b.fechaInicio}-${b.fechaFin}-${idx}`}
                        className="inline-flex items-center px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs border border-red-100"
                    >
                        {formatDate(b.fechaInicio)} → {formatDate(b.fechaFin)}
                    </span>
                    ))}

                </div>
              )}
            </div>

            {/* Nota admin */}
            {isAdmin && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-900">
                <p className="font-semibold mb-1">Vista de socio</p>
                <p>
                  Esta página corresponde a la vista pública del espacio. Las
                  acciones de gestión (CRUD, activar/desactivar) se realizan desde
                  el módulo <strong>Gestión de Espacios (Admin)</strong>.
                </p>
              </div>
            )}
          </section>

          {/* COLUMNA DERECHA — CARD RESERVA */}
          <aside>
            <motion.div
              initial={!prefersReducedMotion ? { opacity: 0, y: 12 } : undefined}
              animate={!prefersReducedMotion ? { opacity: 1, y: 0 } : undefined}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sticky top-20"
            >
              <div className="flex items-baseline justify-between mb-4">
                <div>
                  <p className="text-xs uppercase text-gray-400 tracking-wider">
                    Desde
                  </p>
                  <p className="text-2xl font-extrabold text-[#002E3E]">
                    {CLP.format(espacio.tarifaClp)}
                    <span className="text-xs font-normal text-gray-500 ml-1">
                      / {modalidadLabel.toLowerCase().replace("por ", "")}
                    </span>
                  </p>
                </div>

                {espacio.tarifaExterno && (
                  <div className="text-right text-xs text-gray-500">
                    <p>Tarifa externo</p>
                    <p className="font-semibold">
                      {CLP.format(espacio.tarifaExterno)}
                    </p>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 my-4" />

              <ul className="space-y-2 text-xs sm:text-sm text-gray-700 mb-4">
                <li>• Reservas sujetas a aprobación según política ENAP.</li>
                <li>• El socio debe encontrarse con sus cuotas al día.</li>
                <li>• Se respetan aforos máximos y normativa interna.</li>
              </ul>

              <motion.button
                disabled={!isActivo || loadingReserva}
                whileTap={!prefersReducedMotion ? { scale: 0.97 } : undefined}
                onClick={handleReservar}
                className={`w-full rounded-xl px-4 py-3 text-sm font-semibold flex items-center justify-center gap-2
                  ${
                    isActivo
                      ? "bg-[#002E3E] text-white hover:bg-[#01384A]"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
              >
                {loadingReserva ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Redirigiendo a reserva…
                  </>
                ) : isActivo ? (
                  <>Reservar ahora</>
                ) : (
                  <>
                    <Info size={16} />
                    No disponible para nuevas reservas
                  </>
                )}
              </motion.button>

              <p className="mt-3 text-[11px] text-gray-500 text-center">
                Al continuar con la reserva, aceptas las políticas del Centro
                Recreacional ENAP Limache.
              </p>
            </motion.div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default EspacioDetallePage;
