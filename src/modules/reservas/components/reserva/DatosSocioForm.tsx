// ============================================================
// DatosSocioForm.tsx — ENAP 2025 (FINAL SYNC)
// ============================================================

import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from "react-hook-form";

import { ReservaFrontendType } from "@/modules/reservas/schemas/reserva.schema";

interface Props {
  register: UseFormRegister<ReservaFrontendType>;
  errors: FieldErrors<ReservaFrontendType>;
  setValue: UseFormSetValue<ReservaFrontendType>;
}

const DatosSocioForm: React.FC<Props> = ({
  register,
  errors,
  setValue,
}) => {
  const update = (field: keyof ReservaFrontendType, value: string) => {
    setValue(field, value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  return (
    <fieldset className="space-y-6 border-t pt-6">
      <legend className="text-lg font-semibold text-[#002E3E]">
        Datos del Socio ENAP
      </legend>

      {/* ============================= Nombre ============================= */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Nombre completo
        </label>

        <input
          type="text"
          placeholder="Ej: Felipe Contreras Soto"
          {...register("nombreSocio", {
            onChange: (e) => update("nombreSocio", e.target.value),
          })}
          className="rounded-lg border px-4 py-3 text-sm shadow-sm
                     focus:ring-2 focus:ring-enap-cyan"
        />

        {errors.nombreSocio && (
          <span className="text-xs text-red-600">
            {errors.nombreSocio.message}
          </span>
        )}
      </div>

      {/* ======================= RUT + Teléfono ======================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            RUT del socio
          </label>

          <input
            type="text"
            placeholder="12.345.678-9"
            {...register("rutSocio", {
              onChange: (e) => update("rutSocio", e.target.value),
            })}
            className="rounded-lg border px-4 py-3 text-sm shadow-sm
                       focus:ring-2 focus:ring-enap-cyan"
          />

          {errors.rutSocio && (
            <span className="text-xs text-red-600">
              {errors.rutSocio.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Teléfono
          </label>

          <input
            type="tel"
            placeholder="+56 9 8765 4321"
            {...register("telefonoSocio", {
              onChange: (e) => update("telefonoSocio", e.target.value),
            })}
            className="rounded-lg border px-4 py-3 text-sm shadow-sm
                       focus:ring-2 focus:ring-enap-cyan"
          />

          {errors.telefonoSocio && (
            <span className="text-xs text-red-600">
              {errors.telefonoSocio.message}
            </span>
          )}
        </div>
      </div>

      {/* ============================ Correos ============================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Correo ENAP
          </label>

          <input
            type="email"
            placeholder="usuario@enap.cl"
            {...register("correoEnap", {
              onChange: (e) => update("correoEnap", e.target.value),
            })}
            className="rounded-lg border px-4 py-3 text-sm shadow-sm
                       focus:ring-2 focus:ring-enap-cyan"
          />

          {errors.correoEnap && (
            <span className="text-xs text-red-600">
              {errors.correoEnap.message}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-700">
            Correo personal (opcional)
          </label>

          <input
            type="email"
            placeholder="ej: felipe@gmail.com"
            {...register("correoPersonal", {
              onChange: (e) => update("correoPersonal", e.target.value),
            })}
            className="rounded-lg border px-4 py-3 text-sm shadow-sm
                       focus:ring-2 focus:ring-enap-cyan"
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
