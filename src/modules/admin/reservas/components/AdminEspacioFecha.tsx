// src/modules/admin/reservas/components/AdminEspacioFecha.tsx
import React from "react";
import type { UseFormRegister, FieldErrors } from "react-hook-form";

interface EspacioLite {
  id: string;
  nombre: string;
  tipo: string;
  capacidad?: number | null;
  modalidadCobro?: string | null;
}

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  espacios: EspacioLite[];
  selectedEspacio?: EspacioLite | null;
}

const AdminEspacioFecha: React.FC<Props> = ({
  register,
  errors,
  espacios,
  selectedEspacio,
}) => {
  return (
    <section>
      <h2 className="text-lg font-semibold text-[#00394F] mb-4">
        Espacio y fechas
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Espacio */}
        <div className="md:col-span-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Espacio
          </label>
          <select
            {...register("espacioId")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#007A8A]"
          >
            <option value="">Selecciona un espacio</option>
            {espacios.map((espacio) => (
              <option key={espacio.id} value={espacio.id}>
                {espacio.nombre} ({espacio.tipo})
              </option>
            ))}
          </select>
          {errors.espacioId && (
            <p className="mt-1 text-xs text-red-600">
              {String(errors.espacioId.message)}
            </p>
          )}

          {selectedEspacio && (
            <p className="mt-2 text-[11px] text-gray-500">
              Capacidad: {selectedEspacio.capacidad ?? "-"} personas · Modalidad:{" "}
              {selectedEspacio.modalidadCobro ?? "-"}
            </p>
          )}
        </div>

        {/* Fecha inicio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha inicio
          </label>
          <input
            type="date"
            {...register("fechaInicio")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#007A8A]"
          />
          {errors.fechaInicio && (
            <p className="mt-1 text-xs text-red-600">
              {String(errors.fechaInicio.message)}
            </p>
          )}
        </div>

        {/* Fecha fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha fin
          </label>
          <input
            type="date"
            {...register("fechaFin")}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#007A8A]"
          />
          {errors.fechaFin && (
            <p className="mt-1 text-xs text-red-600">
              {String(errors.fechaFin.message)}
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AdminEspacioFecha;
