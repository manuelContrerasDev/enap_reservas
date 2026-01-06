// ============================================================
// AdminReservaManualPage.tsx — Reserva Manual Admin (ENAP 2025)
// SYNC RHF + Zod (SIN transform) + Backend Payload (nested)
// ============================================================

import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

// UI
import { Stepper } from "@/modules/admin/reservas/manual/Stepper";
import { AdminStep1_DatosSocioEspacio } from "@/modules/admin/reservas/manual/AdminStep1_DatosSocioEspacio";
import { AdminStep2_CantidadesResumen } from "@/modules/admin/reservas/manual/AdminStep2_CantidadesResumen";
import AdminReservaSuccess from "@/modules/admin/reservas/manual/AdminReservaSuccess";

// Schema (FRONTEND: sin transform)
import { reservaManualFormSchema } from "@/validators/reservaManual.schema";

// Hook backend
import { useReservaManual } from "@/modules/admin/reservas/hooks/useReservaManual";

type ReservaManualFormValues = z.input<typeof reservaManualFormSchema>;
type ReservaManualParsed = z.output<typeof reservaManualFormSchema>;

function getAdminId(): string {
  // ✅ Ajusta esta fuente a tu realidad (storage/estado/route)
  const raw = localStorage.getItem("auth_user");
  if (!raw) return "";
  try {
    const u = JSON.parse(raw);
    return u?.id ?? "";
  } catch {
    return "";
  }
}

const AdminReservaManualPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const { crear, resultado, loading } = useReservaManual();

  const form = useForm<ReservaManualFormValues>({
    resolver: zodResolver(reservaManualFormSchema),
    mode: "onChange",
    defaultValues: {
      userId: "",
      creadaPor: "", // se setea en useEffect
      espacioId: "",
      fechaInicio: "",
      fechaFin: "",

      cantidadAdultos: 1 as any,
      cantidadNinos: 0 as any,
      cantidadPiscina: 0 as any,

      usoReserva: "USO_PERSONAL",
      marcarPagada: false,

      socioPresente: true, // ✅ regla real

      socio: {
        nombre: "",
        rut: "",
        telefono: "",
        correoEnap: "",
        correoPersonal: null,
      },

      responsable: null,
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

  const socioPresente = watch("socioPresente");

  // ✅ set creadaPor sin AuthContext
  useEffect(() => {
    const adminId = getAdminId();
    if (adminId) {
      setValue("creadaPor", adminId, { shouldValidate: true });
    }
  }, [setValue]);

  const next = async () => {
    const fields: any[] = [
      "userId",
      "creadaPor",
      "espacioId",
      "fechaInicio",
      "fechaFin",
      "usoReserva",
      "socio",
      "socioPresente",
    ];

    if (socioPresente === false) fields.push("responsable");

    const valid = await trigger(fields as any);

    if (valid) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const back = () => {
    setStep(1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit: SubmitHandler<ReservaManualFormValues> = async (data) => {
    // ✅ parse final (numbers coerced / reglas zod aplicadas)
    const parsed: ReservaManualParsed = reservaManualFormSchema.parse(data);

    // ✅ NO "manosear" responsable acá
    // La regla debe vivir en Zod (superRefine) y/o backend.

    await crear(parsed as any); // parsed es NESTED: socio/responsable/socioPresente
    setStep(3);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (step === 3 && resultado) {
    return <AdminReservaSuccess id={resultado.id} />;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <Stepper step={step} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">
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

        <div className="flex justify-between pt-6 border-t border-gray-200">
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
              className="px-8 py-2.5 bg-[#00394F] text-white font-medium rounded-lg shadow hover:bg-[#002a3a] disabled:opacity-60 transition-all"
            >
              {loading ? "Guardando…" : "Confirmar Reserva"}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminReservaManualPage;
