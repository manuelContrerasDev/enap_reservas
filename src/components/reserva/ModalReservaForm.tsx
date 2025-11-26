// ============================================================
// ModalReservaForm.tsx — Reserva rápida desde catálogo
// ============================================================

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2 } from "lucide-react";
import { useReservaForm } from "@/hooks/useReservaForm";

import FechasForm from "./FechasForm";
import PersonasForm from "./PersonasForm";
import DatosSocioForm from "./DatosSocioForm";
import UsoReservaForm from "./UsoReservaForm";
import TerminosAceptacion from "./TerminosAceptacion";
import { TotalReserva } from "./TotalReservaForm";

interface ModalReservaFormProps {
  abierto: boolean;
  onCerrar: () => void;
  espacio: any; // desde catálogo
}

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&auto=format";

const ModalReservaForm: React.FC<ModalReservaFormProps> = ({
  abierto,
  onCerrar,
  espacio,
}) => {
  if (!abierto || !espacio) return null;

  // ============================================================
  // Hook maestro
  // ============================================================
  const {
    loading,
    error,

    // RHF
    register,
    watch,
    setValue,
    errors,
    handleSubmit,

    // reactivos
    fechaInicio,
    fechaFin,
    personas,
    usoReserva,
    socioPresente,
    responsable,

    // helpers
    total,
    maxCap,
    today,

    // handlers
    onChangeInicio,
    onChangeFin,
    onChangePersonas,

    onSubmit,
  } = useReservaForm();

  return (
    <AnimatePresence>
      {abierto && (
        <motion.div
          className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 25 }}
            className="w-full max-w-3xl bg-white shadow-xl rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="relative">
              <img
                src={espacio?.imagenUrl || FALLBACK_IMG}
                onError={(e) => (e.currentTarget.src = FALLBACK_IMG)}
                className="w-full h-40 object-cover"
              />
              <button
                onClick={onCerrar}
                className="absolute top-4 right-4 bg-black/30 text-white p-2 rounded-full hover:bg-black/50"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <h2 className="text-2xl font-bold text-[#002E3E]">
                Reservar {espacio?.nombre}
              </h2>

              {loading ? (
                <div className="flex flex-col items-center py-16">
                  <Loader2 className="animate-spin text-[#002E3E]" size={40} />
                  <p className="mt-3 text-gray-600 text-sm">
                    Cargando datos del espacio...
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Panel 1 */}
                  <div className="space-y-5">
                    <FechasForm
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
                      minDate={today}
                    />

                    <PersonasForm
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
                      maxCap={maxCap}
                    />

                    <UsoReservaForm
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
                    />
                  </div>

                  {/* Panel 2 */}
                  <div className="space-y-5">
                    <DatosSocioForm
                      register={register}
                      watch={watch}
                      setValue={setValue}
                      errors={errors}
                    />

                    <TotalReserva total={total} />

                    <TerminosAceptacion register={register} errors={errors} />

                    <button className="w-full py-3 bg-[#002E3E] text-white font-bold rounded-lg hover:bg-[#023B4A]">
                      Confirmar Reserva
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ModalReservaForm;
