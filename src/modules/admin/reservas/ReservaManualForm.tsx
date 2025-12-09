// src/modules/admin/reservas/components/ReservaManualForm.tsx

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  reservaManualSchema,
  type ReservaManualPayload,
} from "@/validators/reservaManual.schema";
import { useEspacios } from "@/context/EspaciosContext";
import AdminDatosSocio from "@/modules/admin/reservas/components/AdminDatosSocio";
import AdminDatosResponsable from "@/modules/admin/reservas/components/AdminDatosResponsable";
import AdminEspacioFecha from "@/modules/admin/reservas/components/AdminEspacioFecha";
import AdminCantidades from "@/modules/admin/reservas/components/AdminCantidades";
import AdminEstadoPago from "@/modules/admin/reservas/components/AdminEstadoPago";

interface Props {
  onSubmit: (data: ReservaManualPayload) => Promise<void> | void;
  loading: boolean;
}

const ReservaManualForm: React.FC<Props> = ({ onSubmit, loading }) => {
  const { espacios } = useEspacios();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(reservaManualSchema),
    defaultValues: {
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

  const selectedEspacioId = watch("espacioId") as string | undefined;
  const selectedEspacio =
    espacios.find((e) => e.id === selectedEspacioId) ?? null;

  return (
    <form
      onSubmit={handleSubmit(onSubmit as any)}
      className="space-y-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6"
    >
      <AdminDatosSocio register={register} errors={errors} />
      <AdminDatosResponsable register={register} errors={errors} />
      <AdminEspacioFecha
        register={register}
        errors={errors}
        espacios={espacios as any}
        selectedEspacio={selectedEspacio as any}
      />
      <AdminCantidades register={register} errors={errors} />
      <AdminEstadoPago register={register} loading={loading} />
    </form>
  );
};

export default ReservaManualForm;
