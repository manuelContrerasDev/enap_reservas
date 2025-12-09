// ============================================================
// DatosSocioForm.tsx — UX/UI Premium ENAP 2025 (VERSIÓN FINAL SINCRONIZADA)
// ============================================================

import React from "react";
import {
  UseFormRegister,
  UseFormWatch,
  FieldErrors,
  UseFormSetValue,
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
  const nombreSocio = watch("nombreSocio") ?? "";
  const rutSocio = watch("rutSocio") ?? "";
  const telefonoSocio = watch("telefonoSocio") ?? "";
  const correoEnap = watch("correoEnap") ?? "";
  const correoPersonal = watch("correoPersonal") ?? "";

  const update = (field: keyof ReservaFrontendType, value: string) => {
    setValue(field, value, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <fieldset className="space-y-6 border-t pt-6">
      <legend className="text-lg font-semibold text-[#002E3E]">
        Datos del Socio ENAP
      </legend>

      {/* ============================= Nombre ============================= */}
      <div className="flex flex-col gap-1">
        <label htmlFor="nombreSocio" className="text-sm font-medium text-gray-700">
          Nombre completo
        </label>

        <input
          id="nombreSocio"
          type="text"
          autoComplete="name"
          placeholder="Ej: Felipe Contreras Soto"
          {...register("nombreSocio")}
          value={nombreSocio}
          onChange={(e) => update("nombreSocio", e.target.value)}
          className="
            rounded-lg border px-4 py-3 text-sm shadow-sm
            focus:ring-2 focus:ring-enap-cyan focus:border-enap-cyan
          "
        />

        {errors.nombreSocio && (
          <span className="text-xs text-red-600">{errors.nombreSocio.message}</span>
        )}
      </div>

      {/* ======================= RUT + Teléfono ======================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* RUT */}
        <div className="flex flex-col gap-1">
          <label htmlFor="rutSocio" className="text-sm font-medium text-gray-700">
            RUT del socio
          </label>

          <input
            id="rutSocio"
            type="text"
            autoComplete="off"
            placeholder="12.345.678-9"
            {...register("rutSocio")}
            value={rutSocio}
            onChange={(e) => update("rutSocio", e.target.value)}
            className="
              rounded-lg border px-4 py-3 text-sm shadow-sm
              focus:ring-2 focus:ring-enap-cyan focus:border-enap-cyan
            "
          />

          {errors.rutSocio && (
            <span className="text-xs text-red-600">{errors.rutSocio.message}</span>
          )}
        </div>

        {/* Teléfono */}
        <div className="flex flex-col gap-1">
          <label htmlFor="telefonoSocio" className="text-sm font-medium text-gray-700">
            Teléfono
          </label>

          <input
            id="telefonoSocio"
            type="tel"
            autoComplete="tel"
            placeholder="Ej: +56 9 8765 4321"
            {...register("telefonoSocio")}
            value={telefonoSocio}
            onChange={(e) => update("telefonoSocio", e.target.value)}
            className="
              rounded-lg border px-4 py-3 text-sm shadow-sm
              focus:ring-2 focus:ring-enap-cyan focus:border-enap-cyan
            "
          />

          {errors.telefonoSocio && (
            <span className="text-xs text-red-600">{errors.telefonoSocio.message}</span>
          )}
        </div>
      </div>

      {/* ============================ Correos ============================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Correo ENAP */}
        <div className="flex flex-col gap-1">
          <label htmlFor="correoEnap" className="text-sm font-medium text-gray-700">
            Correo ENAP
          </label>

          <input
            id="correoEnap"
            type="email"
            autoComplete="email"
            placeholder="usuario@enap.cl"
            {...register("correoEnap")}
            value={correoEnap}
            onChange={(e) => update("correoEnap", e.target.value)}
            className="
              rounded-lg border px-4 py-3 text-sm shadow-sm
              focus:ring-2 focus:ring-enap-cyan focus:border-enap-cyan
            "
          />

          {errors.correoEnap && (
            <span className="text-xs text-red-600">{errors.correoEnap.message}</span>
          )}
        </div>

        {/* Correo Personal */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="correoPersonal"
            className="text-sm font-medium text-gray-700"
          >
            Correo personal (opcional)
          </label>

          <input
            id="correoPersonal"
            type="email"
            autoComplete="personal-email"
            placeholder="ej: felipe.c@gmail.com"
            {...register("correoPersonal")}
            value={correoPersonal}
            onChange={(e) => update("correoPersonal", e.target.value)}
            className="
              rounded-lg border px-4 py-3 text-sm shadow-sm
              focus:ring-2 focus:ring-enap-cyan focus:border-enap-cyan
            "
          />

          {errors.correoPersonal && (
            <span className="text-xs text-red-600">
              {errors.correoPersonal.message}
            </span>
          )}
        </div>
      </div>
    </fieldset>
  );
};

export default DatosSocioForm;
