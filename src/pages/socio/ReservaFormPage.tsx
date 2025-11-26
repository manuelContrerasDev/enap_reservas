// ============================================================
//  ReservaForm.tsx — Presentational + Hook Maestro
// ============================================================

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { useReservaForm } from "@/hooks/useReservaForm";

import FechasForm from "@/components/reserva/FechasForm";
import PersonasForm from "@/components/reserva/PersonasForm";
import DatosSocioForm from "@/components/reserva/DatosSocioForm";
import UsoReservaForm from "@/components/reserva/UsoReservaForm";
import TerminosAceptacion from "@/components/reserva/TerminosAceptacion";
import { TotalReserva } from "@/components/reserva/TotalReservaForm";
import CheckoutProgress from "@/components/ui/CheckoutProgress";


const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&auto=format";

const ReservaForm: React.FC = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();

  const {
    loading,
    error,
    espacio,

    register,
    watch,
    setValue,
    errors,

    fechaInicio,
    fechaFin,
    personas,
    usoReserva,
    socioPresente,
    responsable,

    total,
    maxCap,
    today,

    onChangeInicio,
    onChangeFin,
    onChangePersonas,

    handleSubmit,
    onSubmit
  } = useReservaForm();

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
        <h2 className="text-2xl font-bold text-gray-800">{error || "Espacio no encontrado"}</h2>
        <Link
          to="/espacios"
          className="mt-4 bg-[#002E3E] text-white px-6 py-3 rounded-lg"
        >
          Volver
        </Link>
      </section>
    );

  }

  return (
    <main className="flex min-h-[calc(100vh-120px)] flex-col items-center bg-[#F9FAFB] px-6 pt-2 pb-12">

      <CheckoutProgress step={1} />

      <div className="w-full max-w-7xl">
        <button
          onClick={() => navigate("/espacios")}
          className="mb-6 flex items-center gap-2 text-[#002E3E]"
        >
          <ArrowLeft size={20} /> Volver a espacios
        </button>

        <div className="grid gap-10 md:grid-cols-2">

          {/* Panel Izquierdo */}
          <motion.div
            initial={!prefersReducedMotion ? { opacity: 0, x: -20 } : undefined}
            animate={!prefersReducedMotion ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.4 }}
            className="rounded-xl overflow-hidden bg-white shadow border"
          >
            <img
              src={espacio.imagenUrl || FALLBACK_IMG}
              onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
              className="h-64 w-full object-cover"
            />
            <div className="p-6 space-y-3">
              <h2 className="text-2xl font-bold text-[#002E3E]">{espacio.nombre}</h2>
              <p className="text-gray-600">{espacio.descripcion}</p>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>Tipo: <strong>{espacio.tipo}</strong></li>
                <li>
                  Capacidad: <strong>{espacio.capacidad}</strong>
                  {espacio.capacidadExtra && <> (+{espacio.capacidadExtra} extra)</>}
                </li>
                <li>
                  Tarifa: <strong className="text-[#DEC01F]">{espacio.tarifaClp.toLocaleString()} CLP/día</strong>
                </li>
              </ul>
            </div>
          </motion.div>

          {/* Formulario */}
          <motion.form
            onSubmit={handleSubmit(onSubmit)}
            initial={!prefersReducedMotion ? { opacity: 0, x: 20 } : undefined}
            animate={!prefersReducedMotion ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.4 }}
            className="space-y-6 p-6 bg-white shadow border rounded-xl"
          >
            <h3 className="text-2xl font-bold text-[#002E3E]">Datos de la Reserva</h3>

            {/* Fechas */}
            <FechasForm
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
              minDate={today}
            />

            {/* Personas */}
            <PersonasForm
              watch={watch}
              setValue={setValue}
              errors={errors}
              maxCap={maxCap}
            />

            {/* Datos Socio */}
            <DatosSocioForm
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
            />

            {/* Uso Reserva */}
            <UsoReservaForm
              register={register}
              watch={watch}
              setValue={setValue}
              errors={errors}
            />

            {/* Total y términos */}
            <div className="space-y-4 border-t pt-4">
              <TotalReserva total={total} />

              <TerminosAceptacion
                register={register}
                errors={errors}
              />
            </div>

            <button
              disabled={loading}
              className={`w-full py-4 rounded-lg font-bold text-white bg-[#002E3E]
                ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-[#01384A]"}
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

          </motion.form>
        </div>
      </div>
    </main>
  );
};

export default ReservaForm;
