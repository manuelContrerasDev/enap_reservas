// src/modules/admin/reservas/components/AdminCantidades.tsx
import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const AdminCantidades: React.FC<Props> = ({ register, errors }) => {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[#00394F] mb-4">
        Cantidades
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Adultos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adultos
          </label>
          <input
            type="number"
            min={1}
            {...register("cantidadAdultos")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A8A]"
          />
          {errors.cantidadAdultos && (
            <p className="mt-1 text-xs text-red-600">
              {String(errors.cantidadAdultos.message)}
            </p>
          )}
        </div>

        {/* Niños */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niños
          </label>
          <input
            type="number"
            min={0}
            {...register("cantidadNinos")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A8A]"
          />
          {errors.cantidadNinos && (
            <p className="mt-1 text-xs text-red-600">
              {String(errors.cantidadNinos.message)}
            </p>
          )}
        </div>

        {/* Piscina */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Personas piscina
          </label>
          <input
            type="number"
            min={0}
            {...register("cantidadPiscina")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007A8A]"
          />
          {errors.cantidadPiscina && (
            <p className="mt-1 text-xs text-red-600">
              {String(errors.cantidadPiscina.message)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminCantidades;
