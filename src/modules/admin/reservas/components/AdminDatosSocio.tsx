// src/modules/admin/reservas/components/AdminDatosSocio.tsx
import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const AdminDatosSocio: React.FC<Props> = ({ register, errors }) => {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[#00394F] mb-4">
        Datos del Socio
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* userId (por ahora manual - luego se reemplaza por buscador) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ID Usuario (interno)
          </label>
          <input
            type="text"
            {...register("userId")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A8A]"
            placeholder="UUID del usuario"
          />
          {errors.userId && (
            <p className="mt-1 text-xs text-red-600">
              {String(errors.userId.message)}
            </p>
          )}
          <p className="text-[11px] text-gray-500 mt-1">
            Más adelante esto se reemplaza por buscador de socio (por RUT).
          </p>
        </div>

        {/* Nombre socio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre socio
          </label>
          <input
            type="text"
            {...register("datosContacto.nombre")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A8A]"
            placeholder="Nombre completo"
          />
            {(errors.datosContacto as any)?.nombre && (
                <p className="mt-1 text-xs text-red-600">
                    {(errors.datosContacto as any).nombre.message}
                </p>
            )}

        </div>

        {/* RUT socio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            RUT socio
          </label>
          <input
            type="text"
            {...register("datosContacto.rut")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A8A]"
            placeholder="11.111.111-1"
          />
            {(errors.datosContacto as any)?.rut && (
                <p className="mt-1 text-xs text-red-600">
                    {(errors.datosContacto as any).rut.message}
                </p>
            )}
        </div>

        {/* Teléfono socio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Teléfono socio
          </label>
          <input
            type="text"
            {...register("datosContacto.telefono")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A8A]"
            placeholder="+56 9 1234 5678"
          />
            {(errors.datosContacto as any)?.telefono && (
                <p className="mt-1 text-xs text-red-600">
                    {(errors.datosContacto as any).telefono.message}
                </p>
            )}

        </div>

        {/* Correo ENAP */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo ENAP
          </label>
          <input
            type="email"
            {...register("datosContacto.correoEnap")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A8A]"
            placeholder="nombre@enap.cl"
          />
            {(errors.datosContacto as any)?.correoEnap && (
                <p className="mt-1 text-xs text-red-600">
                    {(errors.datosContacto as any).correoEnap.message}
                </p>
            )}
        </div>

        {/* Correo personal */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo personal (opcional)
          </label>
          <input
            type="email"
            {...register("datosContacto.correoPersonal")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A8A]"
            placeholder="nombre@correo.com"
          />
            {(errors.datosContacto as any)?.correoPersonal && (
                <p className="mt-1 text-xs text-red-600">
                    {(errors.datosContacto as any).correoPersonal.message}
                </p>
            )}

        </div>
      </div>
    </section>
  );
};

export default AdminDatosSocio;
