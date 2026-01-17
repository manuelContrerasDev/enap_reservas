// ============================================================
// AdminReservaManualPage.tsx — Reserva Manual Admin (ENAP 2025)
// FLUJO COMPACTO · PRODUCCIÓN (INPUT → OUTPUT)
// ============================================================

import React, { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

import { Stepper } from "@/modules/admin/gestion/reservas/manual/Stepper";
import { AdminStep1_DatosSocioEspacio } from "@/modules/admin/gestion/reservas/manual/AdminStep1_DatosSocioEspacio";
import { AdminStep2_CantidadesResumen } from "@/modules/admin/gestion/reservas/manual/AdminStep2_CantidadesResumen";
import { AdminStep3_Invitados } from "@/modules/admin/gestion/reservas/manual/AdminStep3_Invitados";
import { AdminStep4_Confirmacion } from "@/modules/admin/gestion/reservas/manual/AdminStep4_Confirmacion";
import AdminDatosResponsable from "@/modules/admin/gestion/reservas/manual/AdminDatosResponsable";
import AdminReservaSuccess from "@/modules/admin/gestion/reservas/manual/AdminReservaSuccess";

import { reservaManualFormSchema } from "@/modules/admin/gestion/reservas/types/reservaManual.schema";
import { useReservaManual } from "@/modules/admin/components/hooks/useReservaManual";

type FormInput = z.input<typeof reservaManualFormSchema>;
type FormOutput = z.output<typeof reservaManualFormSchema>;
type Step = "FORM" | "CONFIRM" | "SUCCESS";

const AdminReservaManualPage: React.FC = () => {
  const [step, setStep] = useState<Step>("FORM");
  const [preview, setPreview] = useState<FormOutput | null>(null);

  const { crear, reserva, loading, error } = useReservaManual();

  const form = useForm<FormInput>({
    resolver: zodResolver(reservaManualFormSchema),
    mode: "onChange",
    defaultValues: {
      tipoCliente: "SOCIO",
      espacioId: "",
      fechaInicio: "",
      fechaFin: "",
      cantidadAdultos: 1,
      cantidadNinos: 0,
      cantidadPiscina: 0,
      usoReserva: "USO_PERSONAL",
      socioPresente: true,
      socio: {
        nombre: "",
        rut: "",
        telefono: "",
        correoEnap: "",
        correoPersonal: null,
      },
      responsable: null,
      invitados: [],
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

  useEffect(() => {
    if (socioPresente) {
      setValue("responsable", null, { shouldValidate: true });
    }
  }, [socioPresente, setValue]);

  /* ================= PASO → CONFIRM ================= */
  const goToConfirm = useCallback(async () => {
    const valid = await trigger();
    if (!valid) return;

    const parsed = reservaManualFormSchema.parse(watch());
    setPreview(parsed);
    setStep("CONFIRM");

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [trigger, watch]);

  /* ================= SUBMIT REAL ================= */
  const onSubmit = async () => {
    if (!preview) return;

    const { creadaPor, ...payload } = preview; // ⛔ no va al backend

    const res = await crear(payload as FormOutput);
    if (res?.ok) {
      setStep("SUCCESS");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (step === "SUCCESS" && reserva) {
    return <AdminReservaSuccess id={reserva.id} />;
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <Stepper step={step === "FORM" ? 1 : 2} />

      {step === "FORM" && (
        <form className="space-y-12">
          <AdminStep1_DatosSocioEspacio
            register={register}
            watch={watch}
            errors={errors}
            setValue={setValue}
          />

          <AdminStep2_CantidadesResumen
            register={register}
            watch={watch}
            errors={errors}
          />

          <AdminDatosResponsable
            register={register}
            errors={errors}
            visible={!socioPresente}
          />

          <AdminStep3_Invitados
            register={register}
            watch={watch}
            setValue={setValue}
            errors={errors}
          />

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-6 border-t">
            <button type="button" onClick={goToConfirm} className="btn-primary">
              Revisar y confirmar
            </button>
          </div>
        </form>
      )}

      {step === "CONFIRM" && preview && (
        <AdminStep4_Confirmacion
          reservaPreview={preview}
          loading={loading}
          onConfirm={onSubmit}
        />
      )}
    </div>
  );
};

export default AdminReservaManualPage;
