// ============================================================
// ReservaPage.tsx — Step 1 (Creación de Reserva)
// ENAP 2025 · PRODUCCIÓN
// ============================================================

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import type { SubmitHandler } from "react-hook-form";

import { useReservaForm } from "@/modules/reservas/hooks/useReservaForm";

import FechasForm from "@/modules/reservas/components/reserva/FechasForm";
import PersonasForm from "@/modules/reservas/components/reserva/PersonasForm";
import PersonasPiscinaForm from "@/modules/reservas/components/reserva/PersonasPiscinaForm";
import DatosSocioForm from "@/modules/reservas/components/reserva/DatosSocioForm";
import UsoReservaForm from "@/modules/reservas/components/reserva/UsoReservaForm";
import TerminosAceptacion from "@/modules/reservas/components/reserva/TerminosAceptacion";
import ModalAsistentes from "@/modules/reservas/components/reserva/ModalAsistentes";
import { ReservaEspacioCard } from "@/modules/reservas/components/reserva/ReservaEspacioCard";
import { TotalReserva } from "@/modules/reservas/components/reserva/TotalReservaForm";

import CheckoutProgress from "@/components/ui/CheckoutProgress";
import { PATHS } from "@/routes/paths";

import type { ReservaFrontendType } from "@/validators/reserva.schema";

const ReservaPage: React.FC = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  // ============================================================
  // Hook maestro (carga + lógica de reserva)
  // ============================================================
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

  // ============================================================
  // Estado local submit (blindaje UX)
  // ============================================================
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Submit tipado
  const submitHandler: SubmitHandler<ReservaFrontendType> = async (data) => {
    if (isSubmitting) return;
    try {
      setIsSubmitting(true);
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================
  // Modal asistentes
  // ============================================================
  const [modalAsistentesOpen, setModalAsistentesOpen] =
    React.useState(false);

  // ============================================================
  // Datos derivados
  // ============================================================
  const cantidadPersonas = watch("cantidadPersonas") ?? 0;
  const cantidadPersonasPiscina = watch("cantidadPersonasPiscina") ?? 0;
  const invitados = watch("invitados") ?? [];

  const faltan = Math.max(0, cantidadPersonas - invitados.length);

  const invitadosNormalizados = React.useMemo(
    () =>
      invitados.map((i) => ({
        ...i,
        esPiscina: Boolean(i.esPiscina),
      })),
    [invitados]
  );

  // ============================================================
  // Loading / Error inicial
  // ============================================================
  if (loading && !espacio) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-[#002E3E]">
        <Loader2 className="animate-spin" size={48} />
        <p className="mt-3 text-gray-600 text-sm">
          Cargando información…
        </p>
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
          <ReservaEspacioCard
            nombre={espacio.nombre}
            tipo={espacio.tipo}
            descripcion={espacio.descripcion}
            imagenUrl={espacio.imagenUrl}
            capacidad={espacio.capacidad}
            modalidadCobro={espacio.modalidadCobro}
            precioBaseReferencial={espacio.precioBaseSocio}
          />

          {/* PANEL DERECHO */}
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-6 p-6 bg-white shadow-md border border-gray-200 rounded-xl"
          >
            <motion.div
              initial={
                !prefersReducedMotion ? { opacity: 0, x: 20 } : undefined
              }
              animate={
                !prefersReducedMotion ? { opacity: 1, x: 0 } : undefined
              }
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-2xl font-bold text-[#002E3E] mb-4">
                Datos de la Reserva
              </h3>

              {/* FECHAS */}
              <FechasForm
                register={register}
                watch={watch}
                setValue={setValue}
                errors={errors}
                minDate={today}
                espacioTipo={espacio.tipo}
                bloquesOcupados={bloquesOcupados}
              />

              {/* PERSONAS */}
              <PersonasForm
                register={register}
                watch={watch}
                setValue={setValue}
                errors={errors}
                maxCap={maxCap}
              />

              {/* PERSONAS PISCINA */}
              {espacio.tipo === "PISCINA" && (
                <PersonasPiscinaForm
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  errors={errors}
                  max={maxCap}
                />
              )}

              {/* ASISTENTES */}
              {cantidadPersonas > 0 && (
                <div className="mt-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => setModalAsistentesOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold bg-[#005D73] text-white hover:bg-[#003B4D] transition"
                  >
                    <span className="text-xl font-bold">+</span>
                    Añadir asistentes
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

              {/* USO RESERVA */}
              <UsoReservaForm
                register={register}
                watch={watch}
                setValue={setValue}
                errors={errors}
              />

              {/* TOTAL + TÉRMINOS */}
              <div className="space-y-4 border-t pt-4">
                <TotalReserva
                  dias={dias}
                  valorEspacio={valorEspacio}
                  pagoPersonas={pagoPersonas}
                  pagoPiscina={pagoPiscina}
                  total={total}
                />

                <TerminosAceptacion
                  register={register}
                  errors={errors}
                />
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-4 rounded-lg font-bold text-white bg-[#002E3E] ${
                  isSubmitting
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#01384A]"
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2 justify-center">
                    <Loader2 className="animate-spin" size={20} />
                    Enviando…
                  </span>
                ) : (
                  "Confirmar reserva"
                )}
              </button>
            </motion.div>
          </form>
        </div>
      </div>

      {/* MODAL ASISTENTES */}
      <ModalAsistentes
        isOpen={modalAsistentesOpen}
        onClose={() => setModalAsistentesOpen(false)}
        initial={invitadosNormalizados}
        maxCantidad={cantidadPersonas}
        maxPiscina={cantidadPersonasPiscina}
        onSave={(lista) =>
          setValue("invitados", lista, {
            shouldDirty: true,
            shouldValidate: true,
          })
        }
      />
    </main>
  );
};

export default ReservaPage;
