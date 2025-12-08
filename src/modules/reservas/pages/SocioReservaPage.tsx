// ============================================================
//  ReservaPage.tsx — Versión UX/UI Premium ENAP
// ============================================================

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { TotalReserva } from "@/modules/reservas/components/reserva/TotalReservaForm";
import { useReservaForm } from "@/modules/reservas/hooks/useReservaForm";

import FechasForm from "@/modules/reservas/components/reserva/FechasForm";
import PersonasForm from "@/modules/reservas/components/reserva/PersonasForm";
import DatosSocioForm from "@/modules/reservas/components/reserva/DatosSocioForm";
import TerminosAceptacion from "@/modules/reservas/components/reserva/TerminosAceptacion";
import ModalAsistentes from "@/modules/reservas/components/reserva/ModalAsistentes";

import CheckoutProgress from "@/components/ui/CheckoutProgress";
import { PATHS } from "@/routes/paths";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&auto=format";

type InvitadoReserva = {
  nombre: string;
  rut: string;
  edad?: number;
};

const ReservaPage: React.FC = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();


  // ------------------------------
  // Modal asistentes
  // ------------------------------
  const [modalAsistentesOpen, setModalAsistentesOpen] = React.useState(false);
  const [invitados, setInvitados] = React.useState<InvitadoReserva[]>([]);

  // ------------------------------
  // Hook del formulario
  // ------------------------------
  const {
  loading,
  error,
  espacio,
  bloquesOcupados,

  register,
  watch,
  setValue,
  errors,

  dias,
  valorEspacio,
  pagoPersonas,
  pagoPiscina,
  total,

  maxCap,
  today,

  handleSubmit,
  onSubmit,
} = useReservaForm();


  // ------------------------------
  // Loading / error
  // ------------------------------
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-[#002E3E]">
        <Loader2 className="animate-spin" size={48} />
        <p className="mt-3 text-gray-600 text-sm">Cargando información...</p>
      </div>
    );
  }

  if (error || !espacio) {
    return (
      <section className="flex flex-col items-center justify-center py-24 text-center">
        <AlertTriangle className="mb-4 text-red-500" size={48} />
        <h2 className="text-2xl font-bold text-gray-800">
          {error || "Espacio no encontrado"}
        </h2>

        <Link
          to={PATHS.SOCIO_ESPACIOS}
          className="mt-4 bg-[#002E3E] text-white px-6 py-3 rounded-lg hover:bg-[#01384A]"
        >
          Volver
        </Link>
      </section>
    );
  }

  const TARIFA_LABEL =
    espacio.modalidadCobro === "POR_DIA"
      ? "día"
      : espacio.modalidadCobro === "POR_NOCHE"
      ? "noche"
      : "persona";

  const cantidadPersonas = watch("cantidadPersonas") || 0;
  const faltan = Math.max(0, cantidadPersonas - invitados.length);

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <main className="flex min-h-[calc(100vh-120px)] flex-col items-center bg-[#F4F7F9] px-6 pt-3 pb-12">
      <CheckoutProgress step={1} />

      <div className="w-full max-w-7xl">
        {/* VOLVER */}
        <button
          onClick={() => navigate(PATHS.SOCIO_ESPACIOS)}
          className="mt-2 mb-6 flex items-center gap-2 text-[#005D73] hover:text-[#003B4D] transition"
        >
          <ArrowLeft size={20} /> Volver a espacios
        </button>

        <div className="grid gap-10 md:grid-cols-2">
          {/* PANEL IZQUIERDO */}
          <motion.div
            initial={!prefersReducedMotion ? { opacity: 0, x: -20 } : undefined}
            animate={!prefersReducedMotion ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.4 }}
            className="rounded-xl overflow-hidden bg-white shadow-md border border-gray-200"
          >
            <figure className="relative">
              <img
                src={espacio.imagenUrl || FALLBACK_IMG}
                onError={(e) => {
                  e.currentTarget.src = FALLBACK_IMG;
                }}
                className="h-64 w-full object-cover"
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Badge tipo */}
              <span className="absolute top-4 left-4 inline-flex px-4 py-1 rounded-full bg-white/95 text-[#003B4D] text-xs font-bold shadow">
                {espacio.tipo}
              </span>

              {/* Tarifa */}
              <span className="absolute top-4 right-4 inline-flex px-4 py-1 rounded-full bg-[#FFD84D] text-[#003B4D] text-xs font-bold shadow">
                {espacio.tarifaClp.toLocaleString()} CLP / {TARIFA_LABEL}
              </span>
            </figure>

            <div className="p-6 space-y-4">
              <h2 className="text-2xl font-extrabold text-[#002E3E]">
                {espacio.nombre}
              </h2>

              <p className="text-gray-700 text-sm leading-relaxed">
                {espacio.descripcion || "Espacio disponible para reservas."}
              </p>

              <ul className="text-sm text-gray-700 space-y-1">
                <li>
                  Tipo: <strong>{espacio.tipo}</strong>
                </li>

                <li>
                  Capacidad:{" "}
                  <strong>{espacio.capacidad}</strong>
                  {espacio.capacidadExtra && (
                    <> (+{espacio.capacidadExtra} extra)</>
                  )}
                </li>

                <li>
                  Tarifa:{" "}
                  <strong className="text-[#DCAB12]">
                    {espacio.tarifaClp.toLocaleString()} CLP / {TARIFA_LABEL}
                  </strong>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* FORMULARIO */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 p-6 bg-white shadow-md border border-gray-200 rounded-xl"
          >
            <motion.div
              initial={!prefersReducedMotion ? { opacity: 0, x: 20 } : undefined}
              animate={!prefersReducedMotion ? { opacity: 1, x: 0 } : undefined}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-[#002E3E]">
                Datos de la Reserva
              </h3>

              {/* FECHAS */}
              <FechasForm
                register={register}
                watch={watch}
                setValue={setValue}
                errors={errors}
                minDate={today}
                espacioTipo={espacio.tipo as any}
                bloquesOcupados={bloquesOcupados}
              />

              {/* PERSONAS */}
            <PersonasForm
              register={register}   // 👈 FALTA ESTA LÍNEA
              watch={watch}
              setValue={setValue}
              errors={errors}
              maxCap={maxCap}
              />

              {/* ASISTENTES */}
              {cantidadPersonas > 0 && (
                <div className="mt-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => setModalAsistentesOpen(true)}
                    className="
                      flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
                      bg-[#005D73] text-white hover:bg-[#003B4D] transition
                    "
                  >
                    <span className="text-xl font-bold">+</span> Añadir asistentes
                  </button>

                  <p className="text-sm text-gray-700">
                    {invitados.length} asistente(s) añadidos{" "}
                    {faltan > 0 && (
                      <span className="text-red-600 font-medium">
                        — faltan {faltan}
                      </span>
                    )}
                  </p>
                </div>
              )}

              {/* DATOS SOCIO */}
              <DatosSocioForm
                register={register}
                watch={watch}
                setValue={setValue}
                errors={errors}
              />

              {/* TOTAL & TÉRMINOS */}
              <div className="space-y-4 border-t pt-4">
                <TotalReserva
                  dias={dias}
                  valorEspacio={valorEspacio}
                  pagoPersonas={pagoPersonas}
                  pagoPiscina={pagoPiscina}
                  total={total}
                />
                <TerminosAceptacion register={register} errors={errors} />
              </div>

              {/* BOTÓN SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full py-4 rounded-lg font-bold text-white
                  bg-[#002E3E]
                  ${loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#01384A]"}
                `}
              >

                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 className="animate-spin" size={20} />
                    Enviando…
                  </span>
                ) : (
                  "Confirmar Reserva"
                )}
              </button>
            </motion.div>
          </form>
        </div>
      </div>

      {/*MODAL ASISTENTES*/} 
      
        <ModalAsistentes
        isOpen={modalAsistentesOpen}
        onClose={() => setModalAsistentesOpen(false)}
        onSave={(lista: InvitadoReserva[]) => {
          setInvitados(lista);
          setValue("invitados", lista);
        }}
        initial={invitados}
        maxCantidad={cantidadPersonas}
      />
    </main>
  );
};

export default ReservaPage;
