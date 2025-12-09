// src/modules/admin/reservas/components/AdminEstadoPago.tsx
import React from "react";
import type { UseFormRegister } from "react-hook-form";

interface Props {
  register: UseFormRegister<any>;
  loading: boolean;
}

const AdminEstadoPago: React.FC<Props> = ({ register, loading }) => {
  return (
    <section className="flex items-center justify-between gap-4 border-t border-gray-200 pt-4">
      <label className="inline-flex items-center gap-2 text-sm text-gray-700">
        <input
          type="checkbox"
          {...register("marcarPagada")}
          className="rounded border-gray-300 text-[#007A8A] focus:ring-[#007A8A]"
        />
        <span>Marcar como pagada (histórico / migración)</span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-lg bg-[#007A8A] px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#006272] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Guardando..." : "Crear reserva manual"}
      </button>
    </section>
  );
};

export default AdminEstadoPago;
