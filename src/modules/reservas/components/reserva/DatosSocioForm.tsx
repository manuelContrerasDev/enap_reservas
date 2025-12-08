// ============================================================
// DatosSocioForm.tsx — UX/UI Premium ENAP + Semántica + A11Y (FIXED)
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
  const nombreSocio = watch("nombreSocio") ?? "";
  const rutSocio = watch("rutSocio") ?? "";
  const telefonoSocio = watch("telefonoSocio") ?? "";
  const correoEnap = watch("correoEnap") ?? "";
  const correoPersonal = watch("correoPersonal") ?? "";

  const updateField = (
    field: keyof ReservaFrontendType,
    value: string
  ) => {
    setValue(field, value, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <fieldset className="space-y-5 border-t pt-6">
      <legend className="text-lg font-semibold text-[#002E3E]">
        Datos del Socio ENAP
      </legend>

      {/* =============== NOMBRE COMPLETO =============== */}
      <div className="flex flex-col gap-1">
        <label htmlFor="nombreSocio" className="text-sm font-medium text-gray-700">
          Nombre completo
        </label>

        <input
          id="nombreSocio"
          type="text"
          autoComplete="name"
          {...register("nombreSocio")}        // 👈 FIX
          value={nombreSocio}
          onChange={(e) => updateField("nombreSocio", e.target.value)} 
          className="
            rounded-lg border px-4 py-3 text-sm shadow-sm
            focus:ring-2 focus:ring-[#005D73] focus:border-[#005D73]
          "
          placeholder="Ej: Felipe Contreras Soto"
        />

        {errors.nombreSocio && (
          <span className="text-xs text-red-600">{errors.nombreSocio.message}</span>
        )}
      </div>

      {/* =============== RUT & TELÉFONO =============== */}
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
            {...register("rutSocio")}
            value={rutSocio}
            onChange={(e) => updateField("rutSocio", e.target.value)}
            className="
              rounded-lg border px-4 py-3 text-sm shadow-sm
              focus:ring-2 focus:ring-[#005D73] focus:border-[#005D73]
            "
            placeholder="Ej: 12.345.678-9"
          />

          {errors.rutSocio && (
            <span className="text-xs text-red-600">{errors.rutSocio.message}</span>
          )}
        </div>

        {/* TELÉFONO */}
        <div className="flex flex-col gap-1">
          <label htmlFor="telefonoSocio" className="text-sm font-medium text-gray-700">
            Teléfono
          </label>

          <input
            id="telefonoSocio"
            type="tel"
            autoComplete="tel"
            {...register("telefonoSocio")}
            value={telefonoSocio}
            onChange={(e) => updateField("telefonoSocio", e.target.value)}
            className="
              rounded-lg border px-4 py-3 text-sm shadow-sm
              focus:ring-2 focus:ring-[#005D73] focus:border-[#005D73]
            "
            placeholder="Ej: +56 9 8765 4321"
          />

          {errors.telefonoSocio && (
            <span className="text-xs text-red-600">{errors.telefonoSocio.message}</span>
          )}
        </div>
      </div>

      {/* =============== CORREOS =============== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

        {/* CORREO ENAP */}
        <div className="flex flex-col gap-1">
          <label htmlFor="correoEnap" className="text-sm font-medium text-gray-700">
            Correo ENAP
          </label>

          <input
            id="correoEnap"
            type="email"
            autoComplete="email"
            {...register("correoEnap")}
            value={correoEnap}
            onChange={(e) => updateField("correoEnap", e.target.value)}
            className="
              rounded-lg border px-4 py-3 text-sm shadow-sm
              focus:ring-2 focus:ring-[#005D73] focus:border-[#005D73]
            "
            placeholder="Ej: usuario@enap.cl"
          />

          {errors.correoEnap && (
            <span className="text-xs text-red-600">{errors.correoEnap.message}</span>
          )}
        </div>

        {/* CORREO PERSONAL */}
        <div className="flex flex-col gap-1">
          <label htmlFor="correoPersonal" className="text-sm font-medium text-gray-700">
            Correo personal (opcional)
          </label>

          <input
            id="correoPersonal"
            type="email"
            autoComplete="personal-email"
            {...register("correoPersonal")}
            value={correoPersonal}
            onChange={(e) => updateField("correoPersonal", e.target.value)}
            className="
              rounded-lg border px-4 py-3 text-sm shadow-sm
              focus:ring-2 focus:ring-[#005D73] focus:border-[#005D73]
            "
            placeholder="Ej: felipe.c@gmail.com"
          />

          {errors.correoPersonal && (
            <span className="text-xs text-red-600">{errors.correoPersonal.message}</span>
          )}
        </div>
      </div>
    </fieldset>
  );
};

export default DatosSocioForm;
