// src/modules/admin/reservas/manual/AdminDatosResponsable.tsx

import React from "react";
import type {
  UseFormRegister,
  FieldErrors,
} from "react-hook-form";

import type { ReservaManualFormValues } from "../schemas/ReservaManualFormValues";

interface Props {
  register: UseFormRegister<ReservaManualFormValues>;
  errors: FieldErrors<ReservaManualFormValues>;
  visible: boolean;
}

const AdminDatosResponsable: React.FC<Props> = ({
  register,
  errors,
  visible,
}) => {
  // ⛔ No renderizar si no aplica
  if (!visible) return null;

  return (
    <section className="mt-8">
      <h2 className="text-lg font-semibold text-[#00394F] mb-2">
        Responsable a cargo
      </h2>

      <p className="text-xs text-gray-500 mb-4">
        Complete estos datos solo si el socio o externo que reserva no asistirá.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Nombre responsable
          </label>
          <input
            {...register("responsable.nombre")}
            placeholder="Nombre completo"
            className="input-enap"
          />
          {errors.responsable?.nombre && (
            <p className="text-xs text-red-600">
              {errors.responsable.nombre.message}
            </p>
          )}
        </div>

        {/* RUT */}
        <div>
          <label className="block text-sm font-medium mb-1">
            RUT responsable
          </label>
          <input
            {...register("responsable.rut")}
            placeholder="11.111.111-1"
            className="input-enap"
          />
          {errors.responsable?.rut && (
            <p className="text-xs text-red-600">
              {errors.responsable.rut.message}
            </p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Correo responsable
          </label>
          <input
            type="email"
            {...register("responsable.email")}
            placeholder="correo@dominio.com"
            className="input-enap"
          />
          {errors.responsable?.email && (
            <p className="text-xs text-red-600">
              {errors.responsable.email.message}
            </p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Teléfono responsable
          </label>
          <input
            {...register("responsable.telefono")}
            placeholder="+56 9 1234 5678"
            className="input-enap"
          />
          {errors.responsable?.telefono && (
            <p className="text-xs text-red-600">
              {errors.responsable.telefono.message}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminDatosResponsable;
