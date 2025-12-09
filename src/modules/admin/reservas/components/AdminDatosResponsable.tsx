// src/modules/admin/reservas/components/AdminDatosResponsable.tsx
import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const AdminDatosResponsable: React.FC<Props> = ({ register, errors }) => {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[#00394F] mb-2">
        Responsable (si el socio no asiste)
      </h2>
      <p className="text-xs text-gray-500 mb-4">
        Estos datos son opcionales, pero recomendados cuando el socio delega
        la asistencia.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre responsable */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre responsable
          </label>
          <input
            type="text"
            {...register("datosContacto.nombreResponsable")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A8A]"
            placeholder="Nombre completo"
          />
        </div>

        {/* RUT responsable */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RUT responsable
          </label>
          <input
            type="text"
            {...register("datosContacto.rutResponsable")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A8A]"
            placeholder="11.111.111-1"
          />
        </div>

        {/* Email responsable */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo responsable
          </label>
          <input
            type="email"
            {...register("datosContacto.emailResponsable")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A8A]"
            placeholder="correo@dominio.com"
          />
            {(errors.datosContacto as any)?.emailResponsable && (
                <p className="mt-1 text-xs text-red-600">
                    {(errors.datosContacto as any).emailResponsable.message}
                </p>
            )}

        </div>

        {/* Teléfono responsable */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono responsable
          </label>
          <input
            type="text"
            {...register("datosContacto.telefonoResponsable")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A8A]"
            placeholder="+56 9 1234 5678"
          />
        </div>
      </div>
    </section>
  );
};

export default AdminDatosResponsable;
