// ============================================================
// DatosSocioForm.tsx — Sincronizado ENAP + Limpio RHF
// ============================================================

import React from "react";
import {
  UseFormRegister,
  UseFormWatch,
  UseFormSetValue,
  FieldErrors,
} from "react-hook-form";
import { ReservaFrontendType } from "@/validators/reserva.schema";

interface Props {
  register: UseFormRegister<ReservaFrontendType>;
  watch: UseFormWatch<ReservaFrontendType>;
  errors: FieldErrors<ReservaFrontendType>;
  setValue: UseFormSetValue<ReservaFrontendType>;
}

const DatosSocioForm: React.FC<Props> = ({
  register,
  watch,
  errors,
  setValue,
}) => {
  const nombreSocio = watch("nombreSocio") || "";
  const rutSocio = watch("rutSocio") || "";
  const telefonoSocio = watch("telefonoSocio") || "";
  const correoEnap = watch("correoEnap") || "";
  const correoPersonal = watch("correoPersonal") || "";

  const handle = (field: keyof ReservaFrontendType, value: string) => {
    setValue(field, value, { shouldValidate: true, shouldDirty: true });
  };

  return (
    <section className="space-y-4 border-t pt-5">
      <h4 className="text-sm font-semibold text-gray-800">
        Datos del Socio ENAP
      </h4>

      {/* NOMBRE */}
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-700">
          Nombre del socio
        </label>

        <input
          type="text"
          value={nombreSocio}
          onChange={(e) => handle("nombreSocio", e.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
          placeholder="Ej: Felipe Contreras"
        />

        {errors.nombreSocio && (
          <p className="text-xs text-red-600">{errors.nombreSocio.message}</p>
        )}
      </div>

      {/* RUT + TELÉFONO */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* RUT */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">RUT del socio</label>

          <input
            type="text"
            {...register("rutSocio")}
            value={rutSocio}
            onChange={(e) => handle("rutSocio", e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
            placeholder="Ej: 20.123.456-7"
          />

          {errors.rutSocio && (
            <p className="text-xs text-red-600">{errors.rutSocio.message}</p>
          )}
        </div>

        {/* TELÉFONO */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">Teléfono</label>

          <input
            type="tel"
            {...register("telefonoSocio")}
            value={telefonoSocio}
            onChange={(e) => handle("telefonoSocio", e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
            placeholder="Ej: +56 9 8765 4321"
          />

          {errors.telefonoSocio && (
            <p className="text-xs text-red-600">{errors.telefonoSocio.message}</p>
          )}
        </div>
      </div>

      {/* CORREOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* CORREO ENAP */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">Correo ENAP</label>

          <input
            type="email"
            {...register("correoEnap")}
            value={correoEnap}
            onChange={(e) => handle("correoEnap", e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
            placeholder="Ej: socio@enap.cl"
          />

          {errors.correoEnap && (
            <p className="text-xs text-red-600">{errors.correoEnap.message}</p>
          )}
        </div>

        {/* CORREO PERSONAL */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-700">
            Correo personal (opcional)
          </label>

          <input
            type="email"
            {...register("correoPersonal")}
            value={correoPersonal}
            onChange={(e) => handle("correoPersonal", e.target.value)}
            className="rounded-lg border px-3 py-2 text-sm"
            placeholder="Ej: felipe.c@gmail.com"
          />

          {errors.correoPersonal && (
            <p className="text-xs text-red-600">{errors.correoPersonal.message}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default DatosSocioForm;
