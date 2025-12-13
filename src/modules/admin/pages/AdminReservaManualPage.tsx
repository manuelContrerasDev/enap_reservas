// ============================================================
// AdminReservaManualPage.tsx — Crear Reserva Manual (2 Steps)
// ============================================================

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// UI
import { Stepper } from "@/modules/admin/reservas/components/Stepper";
import { AdminStep1_DatosSocioEspacio } from "@/modules/admin/reservas/components/AdminStep1_DatosSocioEspacio";
import { AdminStep2_CantidadesResumen } from "@/modules/admin/reservas/components/AdminStep2_CantidadesResumen";
import { AdminReservaSuccess } from "@/modules/admin/reservas/components/AdminReservaSuccess";

// Validaciones y tipos
import {
  reservaManualSchema,
  type ReservaManualPayload,
} from "@/validators/reservaManual.schema";
import type { Resolver } from "react-hook-form";


// Backend hook
import { useReservaManual } from "@/modules/admin/reservas/hooks/useReservaManual";

const AdminReservaManualPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { crear, resultado, loading } = useReservaManual();

  // ============================================================
  // FORM — Tipado fuerte + resolver Zod
  // ============================================================

  
  const form = useForm<ReservaManualPayload>({
resolver: zodResolver(reservaManualSchema) as Resolver<ReservaManualPayload>,
    defaultValues: {
      userId: "",
      espacioId: "",
      fechaInicio: "",
      fechaFin: "",
      cantidadAdultos: 1,
      cantidadNinos: 0,
      cantidadPiscina: 0,
      marcarPagada: false,
      datosContacto: {
        nombre: "",
        rut: "",
        telefono: "",
        correoEnap: "",
        correoPersonal: "",
        nombreResponsable: "",
        rutResponsable: "",
        emailResponsable: "",
        telefonoResponsable: "",
      },
    },
  });

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    trigger,
    formState: { errors },
  } = form;

  // ============================================================
  // STEP NAVIGATION
  // ============================================================
  const next = async () => {
    const valid = await trigger([
      "userId",
      "datosContacto",
      "espacioId",
      "fechaInicio",
      "fechaFin",
    ]);

    if (valid) {
      setStep(2);
      window.scrollTo(0, 0);
    }
  };

  const back = () => {
    setStep(1);
    window.scrollTo(0, 0);
  };

  // ============================================================
  // SUBMIT — Crear reserva manual
  // ============================================================
  const onSubmit: SubmitHandler<ReservaManualPayload> = async (data) => {
    await crear(data);
    setStep(3);
    window.scrollTo(0, 0);
  };

  const createReserva = handleSubmit(onSubmit);

  // ============================================================
  // SUCCESS
  // ============================================================
  if (step === 3 && resultado) {
    return <AdminReservaSuccess id={resultado.id} />;
  }

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Stepper step={step} />

      <form onSubmit={createReserva} className="space-y-8">
        {step === 1 && (
          <AdminStep1_DatosSocioEspacio
            register={register}
            watch={watch}
            errors={errors}
            setValue={setValue}
          />
        )}

        {step === 2 && (
          <AdminStep2_CantidadesResumen
            register={register}
            watch={watch}
            errors={errors}
          />
        )}

        {/* FOOTER BOTONES */}
        <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
          
          {step === 2 && (
            <button
              type="button"
              onClick={back}
              className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Volver
            </button>
          )}

          {step === 1 && (
            <button
              type="button"
              onClick={next}
              className="ml-auto px-6 py-2.5 bg-[#007B91] text-white font-medium rounded-lg shadow hover:bg-[#006272] transition-all"
            >
              Siguiente
            </button>
          )}

          {step === 2 && (
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2.5 bg-[#00394F] text-white font-medium rounded-lg shadow hover:bg-[#002a3a] disabled:opacity-60 transition-all flex items-center gap-2"
            >
              {loading ? "Guardando..." : "Confirmar Reserva"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminReservaManualPage;
